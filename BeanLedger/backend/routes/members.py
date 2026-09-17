from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query
)
from sqlalchemy.orm import Session

from database import get_db
from models import Member
from schemas import MemberCreate, MemberResponse
from dependencies import get_current_user


router = APIRouter(
    prefix="/api/members",
    tags=["Members"]
)


@router.post(
    "",
    response_model=MemberResponse
)
def create_member(
    data: MemberCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing = db.query(Member).filter(
        Member.phone == data.phone
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Member with this phone already exists"
        )

    member = Member(
        name=data.name,
        phone=data.phone,
        current_points=0,
        lifetime_points=0,
        tier="Bronze"
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return member


@router.get(
    "",
    response_model=list[MemberResponse]
)
def get_members(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    sort: str = Query("created_at"),
    order: str = Query("desc"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    allowed_sort_fields = {
        "name": Member.name,
        "phone": Member.phone,
        "current_points": Member.current_points,
        "lifetime_points": Member.lifetime_points,
        "tier": Member.tier,
        "created_at": Member.created_at
    }

    sort_column = allowed_sort_fields.get(
        sort,
        Member.created_at
    )

    if order.lower() == "asc":
        query = db.query(Member).order_by(
            sort_column.asc()
        )
    else:
        query = db.query(Member).order_by(
            sort_column.desc()
        )

    offset = (page - 1) * limit

    members = query.offset(offset).limit(limit).all()

    return members


@router.get(
    "/search",
    response_model=list[MemberResponse]
)
def search_member(
    phone: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    members = db.query(Member).filter(
        Member.phone.like(f"%{phone}%")
    ).all()

    return members


@router.get(
    "/{member_id}",
    response_model=MemberResponse
)
def get_member(
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

    return member