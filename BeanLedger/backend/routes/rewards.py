from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session

from database import get_db
from models import Member, Reward, Transaction
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

    # Deduct only redeemable/current points
    member.current_points -= reward.points_required

    transaction = Transaction(
        member_id=member.id,
        type="REDEMPTION",
        amount=None,
        points=-reward.points_required,
        description=f"Redeemed {reward.name}"
    )

    db.add(transaction)
    db.commit()
    db.refresh(member)

    return {
        "message": "Reward redeemed successfully",
        "reward": reward.name,
        "points_redeemed": reward.points_required,
        "current_points": member.current_points,
        "lifetime_points": member.lifetime_points,
        "tier": member.tier
    }