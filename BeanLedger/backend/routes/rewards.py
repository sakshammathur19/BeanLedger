
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Member, Reward, Transaction, PointLot
from schemas import RewardResponse, RedeemRequest
from dependencies import get_current_user


router = APIRouter(
    prefix="/api",
    tags=["Rewards"]
)


@router.get(
    "/rewards",
    response_model=list[RewardResponse]
)
def get_rewards(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Reward).order_by(
        Reward.points_required.asc()
    ).all()


@router.post("/members/{member_id}/redeem")
def redeem_reward(
    member_id: int,
    data: RedeemRequest,
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

    reward = db.query(Reward).filter(
        Reward.id == data.reward_id
    ).first()

    if not reward:
        raise HTTPException(
            status_code=404,
            detail="Reward not found"
        )

    if member.current_points < reward.points_required:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Insufficient points. "
                f"You need {reward.points_required} points "
                f"but have {member.current_points}."
            )
        )

    points_to_redeem = reward.points_required

    # Consume oldest points first.
    point_lots = db.query(PointLot).filter(
        PointLot.member_id == member.id,
        PointLot.points_remaining > 0
    ).order_by(
        PointLot.earned_at.asc()
    ).all()

    remaining = points_to_redeem

    for lot in point_lots:

        if remaining <= 0:
            break

        used = min(
            lot.points_remaining,
            remaining
        )

        lot.points_remaining -= used
        remaining -= used

    # Safety check.
    if remaining > 0:
        raise HTTPException(
            status_code=400,
            detail="Point ledger is inconsistent"
        )

    member.current_points -= points_to_redeem

    transaction = Transaction(
        member_id=member.id,
        type="REDEMPTION",
        amount=None,
        points=-points_to_redeem,
        description=f"Redeemed {reward.name}",
        created_at=datetime.utcnow()
    )

    db.add(transaction)

    db.commit()
    db.refresh(member)

    return {
        "message": "Reward redeemed successfully",
        "reward": reward.name,
        "points_redeemed": points_to_redeem,
        "current_points": member.current_points,
        "lifetime_points": member.lifetime_points,
        "tier": member.tier
    }

