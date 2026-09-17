
import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import OutboxEvent
from dependencies import get_current_user


router = APIRouter(
    prefix="",
    tags=["Outbox"]
)


@router.get("/outbox")
def get_outbox(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    events = db.query(OutboxEvent).order_by(
        OutboxEvent.id.asc()
    ).all()

    return [
        {
            "id": event.id,
            "event_type": event.event_type,
            "member_id": event.member_id,
            "payload": json.loads(event.payload),
            "created_at": event.created_at,
            "processed": bool(event.processed)
        }
        for event in events
    ]

