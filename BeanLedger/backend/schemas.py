
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class MemberCreate(BaseModel):
    name: str
    phone: str


class MemberResponse(BaseModel):
    id: int
    name: str
    phone: str
    current_points: int
    lifetime_points: int
    tier: str

    class Config:
        from_attributes = True


class PurchaseRequest(BaseModel):
    amount: float = Field(gt=0)


class RedeemRequest(BaseModel):
    reward_id: int


class RewardResponse(BaseModel):
    id: int
    name: str
    points_required: int

    class Config:
        from_attributes = True


class ClockRequest(BaseModel):
    now: datetime

