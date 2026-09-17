from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session

from database import get_db
from models import Member, Transaction
from schemas import PurchaseRequest
from dependencies import get_current_user


router = APIRouter(
    prefix="/api/members",
    tags=["Purchases"]
)


def calculate_tier(lifetime_points: int) -> str:
    if lifetime_points >= 1000:
        return "Gold"

    if lifetime_points >= 500:
        return "Silver"

    return "Bronze"


def get_multiplier(tier: str) -> int:
    if tier == "Gold":
        return 3

    if tier == "Silver":
        return 2

    return 1


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

    # Current tier determines points for this purchase
    multiplier = get_multiplier(member.tier)

    points_earned = (
        int(data.amount // 10)
        * multiplier
    )

    # Update balances
    member.current_points += points_earned
    member.lifetime_points += points_earned

    # Recalculate tier using lifetime points
    member.tier = calculate_tier(
        member.lifetime_points
    )

    transaction = Transaction(
        member_id=member.id,
        type="PURCHASE",
        amount=data.amount,
        points=points_earned,
        description=f"Purchase of ₹{data.amount:.2f}"
    )

    db.add(transaction)
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