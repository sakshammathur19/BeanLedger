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