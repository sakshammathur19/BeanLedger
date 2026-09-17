
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas import ClockRequest
from dependencies import get_current_user
from models import PointLot, Transaction


router = APIRouter(
    prefix="",
    tags=["Clock"]
)


@router.post("/clock")
def advance_clock(
    data: ClockRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Advance the application clock and expire stale points.

    Points expire exactly when expires_at <= now.
    """

    now = data.now

    expired_lots = db.query(PointLot).filter(
        PointLot.expires_at <= now,
        PointLot.points_remaining > 0
    ).all()

    expired_points = 0
    affected_members = set()

    for lot in expired_lots:

        points = lot.points_remaining

        if points <= 0:
            continue

        member = lot.member

        member.current_points = max(
            0,
            member.current_points - points
        )

        lot.points_remaining = 0

        transaction = Transaction(
            member_id=member.id,
            type="EXPIRATION",
            amount=None,
            points=-points,
            description=f"{points} points expired after 90 days",
            created_at=now
        )

        db.add(transaction)

        expired_points += points
        affected_members.add(member.id)

    db.commit()

    return {
        "message": "Clock processed successfully",
        "now": now,
        "expired_points": expired_points,
        "affected_members": len(affected_members)
    }

