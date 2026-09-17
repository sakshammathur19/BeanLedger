
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, SessionLocal
import models

from routes.auth import router as auth_router
from routes.members import router as members_router
from routes.purchases import router as purchases_router
from routes.rewards import router as rewards_router
from routes.clock import router as clock_router
from routes.outbox import router as outbox_router


# Create all database tables.
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="BeanLedger API",
    description="Café Rewards and Points Management System",
    version="2.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Existing routers
app.include_router(auth_router)
app.include_router(members_router)
app.include_router(purchases_router)
app.include_router(rewards_router)

# New twist routers
app.include_router(clock_router)
app.include_router(outbox_router)


@app.on_event("startup")
def startup():
    seed_rewards()


def seed_rewards():
    db: Session = SessionLocal()

    try:
        existing_rewards = db.query(
            models.Reward
        ).count()

        if existing_rewards == 0:
            rewards = [
                models.Reward(
                    name="Coffee",
                    points_required=100
                ),
                models.Reward(
                    name="Pastry",
                    points_required=150
                ),
                models.Reward(
                    name="Sandwich",
                    points_required=200
                ),
                models.Reward(
                    name="Cold Coffee",
                    points_required=250
                )
            ]

            db.add_all(rewards)
            db.commit()

    finally:
        db.close()


@app.get("/")
def root():
    return {
        "message": "Welcome to BeanLedger API",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

