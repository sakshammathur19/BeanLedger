“A café chain’s rewards programme. Members earn points on every purchase and redeem them for free items. Regulars reach higher tiers — Silver, then Gold — that earn faster. The counter needs to record a purchase, add the right points, let a member redeem, and always show the correct live balance. Staff look a member up by phone number, and the member list is long.

Build the counter something so every member’s points balance is always exactly right.

(Build it for any café and any member. Get earning, the tiers and redemption right first, then the lookups.)”

Mandatory:

Real DB with sensible schema
REST APIs for core operations, endpoints listed in README
Usable UI over APIs
User registration/login
Search
One-page landing page with what it is, key features, target audience, how it helps, 3 next features
Pagination and sorting
Root files README.md, REASONING.md, AI_LOGS.md
Public GitHub repo submission
Codespaces required

Twists:

Level 1 — T3 backward compatibility: Add top tier Platinum (lifetime >= 5000, earns 0.3/₹). Existing members’ tiers and balances unchanged unless they now qualify.
Level 2 — T2 automation: Points expire if unused for 90 days; a job expires stale points and adjusts balances. Graded via POST /clock.
Level 3 — T1 integrate: When a member crosses into a new tier, notify them via Notification Service. Graded via /outbox.

ASSISTANT:

For the challenge, use a simple stack that can be completed quickly:

Frontend:

React + Vite
Tailwind CSS

Backend:

Python FastAPI
SQLAlchemy
SQLite

Authentication:

JWT

API testing:

FastAPI Swagger /docs

Development:

Git
GitHub
GitHub Codespaces

Focus first on:

Purchase
Points
Tier progression
Redemption
Search

Then implement the three twists.

============================================================
BACKEND SETUP

USER:

Give backend setup.

ASSISTANT:

Run:

mkdir BeanLedger
cd BeanLedger
mkdir backend
mkdir backend/routes
mkdir frontend
cd backend

python -m venv venv
source venv/bin/activate

pip install fastapi uvicorn sqlalchemy python-jose[cryptography] passlib[bcrypt] python-multipart

pip freeze > requirements.txt

============================================================
EMAIL VALIDATOR FIX

USER:

I got an email-validator error.

ASSISTANT:

Install:

pip install email-validator

pip freeze > requirements.txt

============================================================
BCRYPT FIX

USER:

I got this bcrypt error:

ValueError: password cannot be longer than 72 bytes, truncate manually if necessary

ASSISTANT:

Fix it with:

pip install --upgrade bcrypt==4.0.1

pip freeze > requirements.txt

Then restart the backend.

============================================================
DATABASE

USER:

Give database setup.

ASSISTANT:

Use SQLite with SQLAlchemy.

database.py:

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./beanledger.db"

engine = create_engine(
DATABASE_URL,
connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
autocommit=False,
autoflush=False,
bind=engine
)

Base = declarative_base()

def get_db():
db = SessionLocal()
try:
yield db
finally:
db.close()

============================================================
DATABASE MODELS

USER:

Give models.

ASSISTANT:

The main models are:

User
Member
Reward
Transaction

For the twists, add:

PointLot
OutboxEvent

Member needs:

current_points
lifetime_points
tier

The important distinction is:

current_points = points currently available for redemption.

lifetime_points = lifetime points used to determine tier.

Redemption and expiry decrease current_points, but lifetime_points never decreases because of redemption or expiry.

============================================================
AUTHENTICATION

USER:

Give authentication.

ASSISTANT:

JWT authentication was implemented.

auth.py handles:

password hashing
password verification
JWT generation

dependencies.py extracts the Bearer token and identifies the current user.

Authentication endpoints:

POST /api/auth/register

POST /api/auth/login

============================================================
REGISTRATION

USER:

Test registration.

ASSISTANT:

Registration test:

{
"name": "BeanLedger Admin",
"email": "admin@beanledger.com",
"password": "admin123"
}

============================================================
LOGIN

USER:

Test login.

ASSISTANT:

Login uses form data:

curl -X POST http://127.0.0.1:8000/api/auth/login
-H "Content-Type: application/x-www-form-urlencoded"
-d "username=admin@beanledger.com&password=admin123"

The API returns a JWT access token.

============================================================
LOGIN FORMAT ISSUE

USER:

Login request format was confusing.

ASSISTANT:

FastAPI's OAuth2PasswordRequestForm expects:

Content-Type:
application/x-www-form-urlencoded

Fields:

username=email
password=password

Therefore the frontend should send URLSearchParams instead of JSON.

============================================================
MEMBER APIs

USER:

Give member APIs.

ASSISTANT:

Member endpoints:

POST /api/members

GET /api/members

GET /api/members/search

GET /api/members/{id}

The member listing supports:

phone-number search
pagination
sorting

This satisfies the requirement that the member list is long.

============================================================
PURCHASE LOGIC

USER:

Give purchase logic.

ASSISTANT:

Purchase endpoint:

POST /api/members/{member_id}/purchases

Purchase flow:

Find the member.
Validate the purchase amount.
Calculate points using the member's current tier.
Add earned points to current_points.
Add earned points to lifetime_points.
Recalculate the tier.
Create a transaction.
Commit the database transaction.

The important design is that lifetime points and redeemable points are tracked separately.

============================================================
TIER RULES

USER:

What are the tier rules?

ASSISTANT:

The final tier structure is:

Bronze:
0–499 lifetime points

Silver:
500–999 lifetime points

Gold:
1000–4999 lifetime points

Platinum:
5000+ lifetime points

Earning rates:

Bronze:
0.1 point/₹

Silver:
0.2 point/₹

Gold:
0.3 point/₹

Platinum:
0.3 point/₹

============================================================
PLATINUM BACKWARD COMPATIBILITY

USER:

Implement Platinum backward compatibility.

ASSISTANT:

Platinum is added as the new top tier.

The important backward-compatibility rule is:

Existing members should not have their balance or tier changed simply because Platinum was introduced.

They only qualify for Platinum if their existing lifetime points are at least 5000.

Tier calculation:

if lifetime_points >= 5000:
Platinum
elif lifetime_points >= 1000:
Gold
elif lifetime_points >= 500:
Silver
else:
Bronze

============================================================
POINT EXPIRY

USER:

Implement point expiry.

ASSISTANT:

A single current_points number is not enough to correctly implement point expiry.

Example:

A member has 100 old points.

They earn another 100 points.

They redeem 50 points.

The system must know exactly which points remain available and which points can later expire.

Therefore a PointLot model is required.

Each PointLot stores:

member_id

points_earned

points_remaining

earned_at

expires_at

When points are redeemed, the oldest available point lots are consumed first.

This prevents already-redeemed points from later expiring.

============================================================
90-DAY EXPIRY TESTING

USER:

How do we test 90 days without actually waiting 90 days?

ASSISTANT:

Create:

POST /clock

This endpoint triggers the expiry processing job.

The job:

Finds expired point lots.
Checks points_remaining.
Removes only unused points.
Decreases current_points.
Creates an EXPIRATION transaction.
Leaves lifetime_points unchanged.

This makes the time-based behavior deterministic and easy to test.

============================================================
NOTIFICATION / OUTBOX

USER:

Implement notification integration.

ASSISTANT:

When a purchase causes a member to cross into a new tier:

Bronze → Silver

Silver → Gold

Gold → Platinum

the backend creates an outbox event:

TIER_CHANGED

The /outbox endpoint allows the grader to inspect these events.

The current implementation creates the notification event. Actual external SMS/email/push delivery can be integrated later through a Notification Service.

============================================================
FRONTEND

USER:

Now frontend.

ASSISTANT:

Use:

React + Vite
Tailwind CSS
Axios
React Router

Pages:

LandingPage
Login
Dashboard
Members
AddMember
MemberDetails
Purchase
Rewards
Transactions

============================================================
AXIOS API SETUP

USER:

Give frontend API setup.

ASSISTANT:

src/api.js:

import axios from "axios";

const api = axios.create({
baseURL: "https://psychic-engine-wrgj4pg7gxxw3g6rv-8000.app.github.dev",
});

api.interceptors.request.use((config) => {
const token = localStorage.getItem("token");

if (token) {
config.headers.Authorization = Bearer ${token};
}

return config;
});

export default api;

============================================================
FRONTEND LOGIN

USER:

How should frontend login work?

ASSISTANT:

Use URLSearchParams:

const formData = new URLSearchParams();

formData.append("username", email);
formData.append("password", password);

const response = await api.post(
"/api/auth/login",
formData,
{
headers: {
"Content-Type": "application/x-www-form-urlencoded",
},
}
);

localStorage.setItem("token", response.data.access_token);

navigate("/dashboard");

============================================================
LANDING PAGE ISSUE

USER:

There was a missing LandingPage import.

ASSISTANT:

Create:

frontend/src/pages/LandingPage.jsx

and make sure App.jsx imports it correctly:

import LandingPage from "./pages/LandingPage";

============================================================
FRONTEND STATUS

USER:

Okay done.

ASSISTANT:

Good. Continue with the documentation and final testing.