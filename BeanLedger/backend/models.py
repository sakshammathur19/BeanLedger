
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False, index=True)

    current_points = Column(Integer, default=0, nullable=False)
    lifetime_points = Column(Integer, default=0, nullable=False)

    tier = Column(String, default="Bronze", nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    transactions = relationship(
        "Transaction",
        back_populates="member",
        cascade="all, delete-orphan"
    )

    point_lots = relationship(
        "PointLot",
        back_populates="member",
        cascade="all, delete-orphan"
    )


class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    points_required = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False
    )

    type = Column(String, nullable=False)

    amount = Column(Float, nullable=True)
    points = Column(Integer, nullable=False)

    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    member = relationship(
        "Member",
        back_populates="transactions"
    )


class PointLot(Base):
    """
    Tracks individual batches of earned points.

    Each purchase creates a point lot.
    Points in the lot expire 90 days after they were earned.
    """

    __tablename__ = "point_lots"

    id = Column(Integer, primary_key=True, index=True)

    member_id = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False,
        index=True
    )

    points_earned = Column(Integer, nullable=False)

    points_remaining = Column(Integer, nullable=False)

    earned_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    expires_at = Column(
        DateTime,
        nullable=False,
        index=True
    )

    member = relationship(
        "Member",
        back_populates="point_lots"
    )


class OutboxEvent(Base):
    """
    Notification outbox.

    Events are stored in the same database transaction as
    the tier change. A separate notification service can
    consume these events later.
    """

    __tablename__ = "outbox_events"

    id = Column(Integer, primary_key=True, index=True)

    event_type = Column(
        String,
        nullable=False
    )

    member_id = Column(
        Integer,
        nullable=False,
        index=True
    )

    payload = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    processed = Column(
        Integer,
        default=0,
        nullable=False
    )

