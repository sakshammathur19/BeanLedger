# BeanLedger

### Café Rewards & Points Management System

BeanLedger is a rewards management system for cafés that helps staff manage members, record purchases, calculate reward points, redeem rewards, and maintain an accurate live points balance.

The system is designed around one core requirement:

> **Every member's points balance should always be exactly right.**

It supports tier-based earning, reward redemption, member search, pagination, sorting, point expiry, and tier-change notifications.

---

## 1. Problem Statement

A café chain runs a rewards programme where members earn points on purchases and redeem those points for free items.

As members become regular customers, they move through reward tiers:

* Bronze
* Silver
* Gold
* Platinum

Higher tiers earn points faster.

The café counter needs to:

* Record a member purchase
* Calculate the correct points automatically
* Maintain the member's current balance
* Track lifetime earned points
* Automatically update the member's tier
* Allow reward redemption
* Prevent redemption when the member has insufficient points
* Search members by phone number
* Handle a large member list using pagination and sorting
* Expire unused points after 90 days
* Notify members when they move to a new tier

---

# 2. Solution Overview

BeanLedger separates the application into a React frontend and a FastAPI backend.

```text
                    ┌─────────────────────┐
                    │     React + Vite     │
                    │      Frontend        │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │     SQLAlchemy      │
                    │        ORM          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       SQLite        │
                    │      Database       │
                    └─────────────────────┘

Additional backend flows:

Purchase
   ↓
Points Calculation
   ↓
Point Lot (90-day expiry)
   ↓
Balance Update
   ↓
Tier Calculation
   ↓
Tier Change?
   ↓
Outbox Notification Event

POST /clock
   ↓
Find Expired Point Lots
   ↓
Reduce Current Balance
   ↓
Record Expiration Transaction
```

---

# 3. Key Features

### Member Management

* Create new café members
* Store member name and phone number
* Phone number is unique
* View member details
* Search members by phone number

### Purchase Management

* Record purchases
* Backend calculates points
* Points are calculated according to the member's tier
* Current points are increased
* Lifetime points are increased
* Tier is recalculated automatically
* Every purchase is stored as a transaction

### Reward Redemption

* View available rewards
* Redeem rewards using points
* Prevent redemption when points are insufficient
* Current points are reduced after redemption
* Redemption is recorded as a transaction
* Lifetime points are not reduced by redemption

### Tier Management

The system automatically calculates tiers using lifetime points.

### Point Expiry

* Earned points are tracked as individual point lots
* Each point lot expires after 90 days
* Expired points are removed from the redeemable balance
* Lifetime points remain unchanged
* Expiration is recorded in transaction history
* Expiry can be triggered using `POST /clock`

### Tier Notifications

When a member crosses into a new tier, BeanLedger creates a notification event in the outbox.

The event can be retrieved through:

```text
GET /outbox
```

---

# 4. Tier & Earning Rules

Tier is calculated from **lifetime points**.

| Tier     | Lifetime Points |  Earning Rate |
| -------- | --------------: | ------------: |
| Bronze   |           0–499 | 0.1 point / ₹ |
| Silver   |         500–999 | 0.2 point / ₹ |
| Gold     |       1000–4999 | 0.3 point / ₹ |
| Platinum |           5000+ | 0.3 point / ₹ |

Equivalent original rates:

```text
Bronze  → 1 point / ₹10
Silver  → 2 points / ₹10
Gold    → 3 points / ₹10
Platinum → 0.3 point / ₹
```

The backend is responsible for calculating points rather than trusting the frontend.

---

# 5. Important Points Logic

Two separate balances are maintained:

### Current Points

`current_points` represents points that can currently be redeemed.

It can increase when points are earned and decrease when points are:

* Redeemed
* Expired

### Lifetime Points

`lifetime_points` represents the total points earned by the member over time.

It:

* Increases when points are earned
* Does not decrease after redemption
* Does not decrease after point expiry
* Determines the member's tier

Therefore:

```text
current_points    → redeemable balance
lifetime_points   → historical earned points
```

This separation ensures that redemption and expiry do not incorrectly downgrade a member's tier.

---

# 6. Purchase Processing

When a purchase is recorded:

```text
Purchase Amount
      ↓
Read Member's Current Tier
      ↓
Calculate Points
      ↓
Increase Current Points
      ↓
Increase Lifetime Points
      ↓
Recalculate Tier
      ↓
Create Point Lot
      ↓
Create Purchase Transaction
      ↓
If Tier Changed → Create Outbox Event
```

The member's tier **before the purchase** is used to calculate the points for that purchase.

After the points are added, the system recalculates the tier.

This means a purchase can cause a member to cross into a new tier, but that same purchase is calculated using the tier the member had before the purchase.

---

# 7. Point Expiry

Every purchase-generated point balance is represented by a `PointLot`.

Each point lot stores:

* Member
* Points originally earned
* Points remaining
* Earned date
* Expiry date

Expiry date:

```text
earned_at + 90 days
```

When `POST /clock` is called, the backend finds point lots where:

```text
expires_at <= supplied clock time
```

and still contain unused points.

Those points are removed from `current_points`.

The system also creates an `EXPIRATION` transaction.

Example:

```text
Before expiry:

Current Points  = 100
Lifetime Points = 100

After expiry:

Current Points  = 0
Lifetime Points = 100
```

The lifetime balance remains unchanged.

---

# 8. Reward Redemption & Point Lots

When a reward is redeemed, the system consumes points from the member's point lots.

The oldest available point lots are consumed first.

For example:

```text
Point Lot 1 → 50 points remaining
Point Lot 2 → 100 points remaining

Reward cost → 100 points

Result:

Point Lot 1 → 0
Point Lot 2 → 50
```

The member's `current_points` is reduced by the reward cost.

The `lifetime_points` value is not changed.

This allows the expiry system to know which earned points are still unused.

---

# 9. Tier Change Notifications

When a member crosses a tier boundary, BeanLedger creates an outbox event.

Examples:

```text
Bronze → Silver
Silver → Gold
Gold → Platinum
```

The event contains:

* Member ID
* Member name
* Phone number
* Previous tier
* New tier
* Notification message

Example event:

```json
{
  "event_type": "TIER_CHANGED",
  "member_id": 1,
  "old_tier": "Bronze",
  "new_tier": "Silver"
}
```

The event is stored in the database through the outbox pattern and can be retrieved through:

```text
GET /outbox
```

This keeps the tier change and notification event within the same backend operation.

---

# 10. Database Design

BeanLedger uses SQLite with SQLAlchemy.

## Users

Stores staff login information.

```text
users
├── id
├── name
├── email
├── password
└── created_at
```

## Members

Stores café members and their current reward state.

```text
members
├── id
├── name
├── phone
├── current_points
├── lifetime_points
├── tier
├── created_at
└── updated_at
```

## Rewards

Stores available rewards.

```text
rewards
├── id
├── name
├── points_required
└── created_at
```

## Transactions

Stores purchases, redemptions and point expirations.

```text
transactions
├── id
├── member_id
├── type
├── amount
├── points
├── description
└── created_at
```

## Point Lots

Tracks unused points and their expiry dates.

```text
point_lots
├── id
├── member_id
├── points_earned
├── points_remaining
├── earned_at
└── expires_at
```

## Outbox Events

Stores tier-change notification events.

```text
outbox_events
├── id
├── event_type
├── member_id
├── payload
├── created_at
└── processed
```

---

# 11. REST API

Base URL:

```text
http://localhost:8000
```

In GitHub Codespaces, FastAPI exposes the backend through the forwarded port URL.

## Authentication

### Register

```http
POST /api/auth/register
```

Registers a staff user.

### Login

```http
POST /api/auth/login
```

Returns a JWT access token.

The protected APIs use:

```text
Authorization: Bearer <token>
```

---

## Members

### Create Member

```http
POST /api/members
```

Creates a new café member.

### List Members

```http
GET /api/members
```

Supports pagination and sorting.

Query parameters:

```text
page
limit
sort
order
```

Example:

```text
GET /api/members?page=1&limit=10&sort=name&order=asc
```

Supported sorting fields include:

```text
name
phone
current_points
lifetime_points
tier
created_at
```

### Get Member

```http
GET /api/members/{member_id}
```

Returns a specific member.

### Search Member

```http
GET /api/members/search?phone={phone}
```

Searches members using their phone number.

---

## Purchases

### Record Purchase

```http
POST /api/members/{member_id}/purchases
```

Records a purchase and calculates reward points.

Request:

```json
{
  "amount": 500
}
```

The backend calculates the points based on the member's tier.

### Get Transactions

```http
GET /api/members/{member_id}/transactions
```

Returns the member's transaction history.

---

## Rewards

### Get Rewards

```http
GET /api/rewards
```

Returns available rewards.

### Redeem Reward

```http
POST /api/members/{member_id}/redeem
```

Request:

```json
{
  "reward_id": 1
}
```

The API rejects the request when the member does not have enough current points.

---

## Point Expiry

### Advance Clock

```http
POST /clock
```

Used to run the point-expiration job against a supplied timestamp.

Request:

```json
{
  "now": "2026-12-01T00:00:00"
}
```

The API finds stale point lots and expires their remaining points.

---

## Notifications

### View Outbox

```http
GET /outbox
```

Returns tier-change notification events created by the system.

---

## Health Check

```http
GET /health
```

Returns:

```json
{
  "status": "healthy"
}
```

---

# 12. Default Rewards

BeanLedger seeds the following rewards automatically when the database is first created:

| Reward      | Points Required |
| ----------- | --------------: |
| Coffee      |             100 |
| Pastry      |             150 |
| Sandwich    |             200 |
| Cold Coffee |             250 |

---

# 13. Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication

### Database

* SQLite

### Development

* Git
* GitHub
* GitHub Codespaces
* FastAPI Swagger UI

---

# 14. Project Structure

```text
BeanLedger/
│
├── backend/
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── members.py
│   │   ├── purchases.py
│   │   ├── rewards.py
│   │   ├── clock.py
│   │   └── outbox.py
│   │
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth.py
│   ├── dependencies.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── README.md
├── REASONING.md
├── AI_LOGS.md
└── .gitignore
```

---

# 15. Running the Backend

Open a terminal and run:

```bash
cd backend
```

Create and activate the virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

The backend runs on:

```text
http://localhost:8000
```

Swagger API documentation is available at:

```text
http://localhost:8000/docs
```

---

# 16. Running the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev -- --host 0.0.0.0
```

The frontend can then be opened through the forwarded Codespaces port.

---

# 17. API Testing

FastAPI provides an interactive Swagger interface at:

```text
/docs
```

The main flows tested include:

### Authentication

```text
Register
↓
Login
↓
JWT authentication
```

### Member Flow

```text
Create Member
↓
Search Member
↓
View Member
```

### Purchase Flow

```text
Create Member
↓
Record Purchase
↓
Points Added
↓
Lifetime Points Updated
↓
Tier Recalculated
```

### Redemption Flow

```text
Earn Points
↓
View Rewards
↓
Redeem Reward
↓
Current Balance Reduced
```

### Platinum Flow

```text
Lifetime Points >= 5000
↓
Platinum Tier
```

### Expiry Flow

```text
Purchase
↓
Point Lot Created
↓
90 Days
↓
POST /clock
↓
Unused Points Expire
```

### Notification Flow

```text
Tier Boundary Crossed
↓
TIER_CHANGED Event
↓
GET /outbox
```

---

# 18. Design Principles

### Backend owns business rules

The frontend does not decide how many points a member earns.

The backend calculates:

* Points
* Tier
* Redemption eligibility
* Point expiry
* Tier-change events

This prevents clients from sending incorrect point values.

### Current vs Lifetime Balance

Current points and lifetime points are deliberately stored separately because they have different meanings.

### Point Lots

Point lots make 90-day expiry possible without incorrectly expiring already-redeemed points.

### Outbox

Tier notifications are stored as outbox events so that a notification service can consume them separately.

### Database Persistence

Member balances and transactions are persisted in SQLite rather than being held only in application memory.

---

# 19. Implemented Challenge Twists

## Level 1 — T3: Platinum

Implemented:

```text
Platinum = lifetime_points >= 5000
```

Platinum earns:

```text
0.3 points / ₹
```

Existing Bronze, Silver and Gold rules remain supported.

Tier calculation is based on lifetime points, so existing member balances are not changed simply because Platinum was added.

---

## Level 2 — T2: Point Expiry

Implemented:

```text
Point expiry = 90 days
```

Each purchase creates a point lot with an expiry timestamp.

The expiration job is triggered using:

```http
POST /clock
```

Expired points reduce `current_points` but do not reduce `lifetime_points`.

---

## Level 3 — T1: Tier Notification

Implemented using an outbox table.

When a member crosses a tier boundary:

```text
Bronze → Silver
Silver → Gold
Gold → Platinum
```

a `TIER_CHANGED` event is created.

Events can be inspected using:

```http
GET /outbox
```

---

# 20. Future Improvements

The current implementation provides the required counter, reward management, point expiry and outbox functionality.

Possible future improvements include:

1. Connect the outbox to an external Notification Service for actual SMS/email/push delivery.
2. Add multi-café/location management.
3. Add reward and customer analytics dashboards.

---

# 21. Summary

BeanLedger provides a persistent café rewards counter that keeps member balances accurate through:

* Tier-based point earning
* Separate current and lifetime balances
* Reward redemption validation
* Transaction history
* Individual point lots
* 90-day point expiry
* Platinum tier support
* Tier-change outbox notifications
* Phone-number member search
* Pagination and sorting
* JWT authentication
* REST APIs
* React-based user interface
* SQLite persistence
