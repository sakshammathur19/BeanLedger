
from datetime import datetime, timedelta
import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Member, Transaction, PointLot, OutboxEvent
from schemas import PurchaseRequest
from dependencies import get_current_user


router = APIRouter(
    prefix="/api/members",
    tags=["Purchases"]
)


POINT_EXPIRY_DAYS = 90


def calculate_tier(lifetime_points: int) -> str:
    """
    Tier is based ONLY on lifetime points.

    Bronze: 0-499
    Silver: 500-999
    Gold: 1000-4999
    Platinum: 5000+
    """

    if lifetime_points >= 5000:
        return "Platinum"

    if lifetime_points >= 1000:
        return "Gold"

    if lifetime_points >= 500:
        return "Silver"

    return "Bronze"


def get_multiplier(tier: str) -> float:
    """
    Points per rupee.

    Bronze  = 0.1 point / ₹
    Silver  = 0.2 point / ₹
    Gold    = 0.3 point / ₹
    Platinum= 0.3 point / ₹

    This preserves the original rules:
    Bronze = 1 point / ₹10
    Silver = 2 points / ₹10
    Gold = 3 points / ₹10

    Platinum requirement says 0.3/₹.
    """

    if tier == "Platinum":
        return 0.3

    if tier == "Gold":
        return 0.3

    if tier == "Silver":
        return 0.2

    return 0.1


def calculate_points(amount: float, tier: str) -> int:
    """
    Calculate whole reward points.

    We keep points as integers because the existing DB schema
    and reward system use integer points.
    """

    multiplier = get_multiplier(tier)

    return int(amount * multiplier)


def create_tier_notification(
    db: Session,
    member: Member,
    old_tier: str,
    new_tier: str
):
    """
    Create a notification event only when the member
    crosses into a new tier.
    """

    if old_tier == new_tier:
        return

    payload = {
        "member_id": member.id,
        "member_name": member.name,
        "phone": member.phone,
        "old_tier": old_tier,
        "new_tier": new_tier,
        "message": (
            f"Congratulations {member.name}! "
            f"You have moved from {old_tier} to {new_tier}."
        )
    }

    event = OutboxEvent(
        event_type="TIER_CHANGED",
        member_id=member.id,
        payload=json.dumps(payload),
        processed=0
    )

    db.add(event)


@router.post("/{member_id}/purchases")
def record_purchase(
    member_id: int,
    data: PurchaseRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    member = db.query(Member).filter(
        Member.id == member_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    # The member earns points according to the tier
    # they have BEFORE this purchase.
    old_tier = member.tier

    points_earned = calculate_points(
        data.amount,
        old_tier
    )

    # Update balances.
    member.current_points += points_earned
    member.lifetime_points += points_earned

    # Recalculate tier from lifetime points.
    new_tier = calculate_tier(
        member.lifetime_points
    )

    member.tier = new_tier

    # Create an expiring point lot.
    now = datetime.utcnow()

    point_lot = PointLot(
        member_id=member.id,
        points_earned=points_earned,
        points_remaining=points_earned,
        earned_at=now,
        expires_at=now + timedelta(
            days=POINT_EXPIRY_DAYS
        )
    )

    db.add(point_lot)

    # Save purchase transaction.
    transaction = Transaction(
        member_id=member.id,
        type="PURCHASE",
        amount=data.amount,
        points=points_earned,
        description=f"Purchase of ₹{data.amount:.2f}",
        created_at=now
    )

    db.add(transaction)

    # Create notification if tier changed.
    create_tier_notification(
        db,
        member,
        old_tier,
        new_tier
    )

    db.commit()
    db.refresh(member)

    return {
        "message": "Purchase recorded successfully",
        "member_id": member.id,
        "purchase_amount": data.amount,
        "points_earned": points_earned,
        "current_points": member.current_points,
        "lifetime_points": member.lifetime_points,
        "tier": member.tier
    }


@router.get("/{member_id}/transactions")
def get_transactions(
    member_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    member = db.query(Member).filter(
        Member.id == member_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    transactions = db.query(Transaction).filter(
        Transaction.member_id == member_id
    ).order_by(
        Transaction.created_at.desc()
    ).all()

    return [
        {
            "id": transaction.id,
            "type": transaction.type,
            "amount": transaction.amount,
            "points": transaction.points,
            "description": transaction.description,
            "created_at": transaction.created_at
        }
        for transaction in transactions
    ]


def expire_points(
    db: Session,
    now: datetime
):
    """
    Expire all stale point lots.

    Lifetime points NEVER decrease.

    Only current/redeemable points decrease.
    """

    expired_lots = db.query(PointLot).filter(
        PointLot.expires_at <= now,
        PointLot.points_remaining > 0
    ).all()

    total_expired = 0

    for lot in expired_lots:

        points_to_expire = lot.points_remaining

        if points_to_expire <= 0:
            continue

        member = db.query(Member).filter(
            Member.id == lot.member_id
        ).first()

        if not member:
            continue

        # Reduce only redeemable balance.
        member.current_points = max(
            0,
            member.current_points - points_to_expire
        )

        # Lifetime points NEVER change.
        lot.points_remaining = 0

        # Record expiration transaction.
        transaction = Transaction(
            member_id=member.id,
            type="EXPIRATION",
            amount=None,
            points=-points_to_expire,
            description=(
                f"{points_to_expire} points expired "
                f"after {POINT_EXPIRY_DAYS} days"
            ),
            created_at=now
        )

        db.add(transaction)

        total_expired += points_to_expire

    db.commit()

    return total_expired

