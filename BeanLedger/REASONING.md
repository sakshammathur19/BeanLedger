###  Problem Understanding

The main requirement was to build a café rewards system where a member's points balance is always accurate.

The system needed to handle:

Member registration and lookup
Purchase recording
Automatic point calculation
Tier-based earning
Current and lifetime points
Reward redemption
90-day point expiry
Platinum tier support
Tier-change notifications
Phone-number search
Pagination and sorting
Staff authentication
REST APIs
A usable frontend

The main design principle was to keep the reward and points logic in the backend so that the frontend cannot directly modify or calculate the member's balance.

###  Overall Architecture

BeanLedger was divided into three main layers:

React + Vite Frontend
        ↓
FastAPI REST API
        ↓
SQLAlchemy ORM
        ↓
SQLite Database

The frontend provides the counter interface, while the backend handles business rules, validation and database updates.

FastAPI Swagger UI was also used to test the APIs directly during development.

The application was developed and tested in GitHub Codespaces as required by the challenge.

### Database Design

SQLite was selected because it provides a real persistent database while keeping the project simple to run in Codespaces.

SQLAlchemy was used as the ORM.

The database contains:

users — staff registration and authentication
members — member details, current points, lifetime points and tier
rewards — available rewards and their point costs
transactions — purchase, redemption and expiration records
point_lots — individual earned-point batches and expiry information
outbox_events — tier-change notification events

The database acts as the source of truth for member balances and transaction history.

### Current Points and Lifetime Points

Two separate balances were used because they have different meanings.

Current Points

current_points represents points currently available for redemption.

It can:

Increase when points are earned
Decrease when points are redeemed
Decrease when points expire
Lifetime Points

lifetime_points represents the total points earned by the member over time.

It:

Increases when points are earned
Does not decrease after redemption
Does not decrease after expiry
Determines the member's tier

Example:

Member earns 100 points

Current Points  = 100
Lifetime Points = 100

Member redeems 100 points

Current Points  = 0
Lifetime Points = 100

This prevents redemption or expiry from incorrectly downgrading a member's tier.

### Purchase and Point Calculation

The backend receives the purchase amount and calculates the points.

The frontend does not send the points to be awarded.

The purchase flow is:

Purchase Amount
      ↓
Find Member
      ↓
Read Member's Current Tier
      ↓
Calculate Points
      ↓
Update Current Points
      ↓
Update Lifetime Points
      ↓
Recalculate Tier
      ↓
Create Point Lot
      ↓
Create Purchase Transaction
      ↓
If Tier Changed → Create Outbox Event

The purchase uses the member's tier before the purchase for calculating the points.

For example, if a Bronze member crosses the Silver threshold because of a purchase, that purchase is still calculated using the Bronze rate. The member becomes Silver after the points are added and the tier is recalculated.

This keeps the earning rule deterministic.

### Tier Rules

Tier calculation is based on lifetime points.

Bronze   → 0–499
Silver   → 500–999
Gold     → 1000–4999
Platinum → 5000+

The earning rates implemented are:

Bronze   → 0.1 point / ₹
Silver   → 0.2 point / ₹
Gold     → 0.3 point / ₹
Platinum → 0.3 point / ₹

The backend recalculates the tier after every purchase.

### Platinum Backward Compatibility

The first challenge twist required adding Platinum without breaking existing behaviour.

The implemented rule is:

Lifetime Points >= 5000 → Platinum

Existing Bronze, Silver and Gold rules remain supported.

Because tier calculation is based on lifetime points, adding Platinum does not directly change a member's current points balance.

A member moves to Platinum only when the lifetime-point threshold is reached.

### Reward Redemption

The reward API first checks whether the member has enough current points.

The redemption flow is:

Select Reward
      ↓
Check Reward Exists
      ↓
Check Member Exists
      ↓
Check Current Balance
      ↓
Consume Required Points
      ↓
Update Current Points
      ↓
Create Redemption Transaction

If the member does not have enough points, the redemption is rejected.

Lifetime points are not reduced during redemption.

### Point Lots and Expiry

The 90-day expiry requirement required tracking individual batches of earned points.

For this reason, every purchase creates a PointLot.

Each point lot stores:

member_id
points_earned
points_remaining
earned_at
expires_at

The expiry date is:

earned_at + 90 days

This allows the system to identify exactly which unused points have expired.

### Oldest-First Redemption

When a member redeems a reward, the system consumes available point lots from the oldest lot first.

Example:

Lot 1 → 50 points
Lot 2 → 100 points

Reward Cost → 100 points

After redemption:

Lot 1 → 0 points
Lot 2 → 50 points

The system tracks both points_earned and points_remaining.

This is important because already-redeemed points must not be expired later.

### Point Expiry and /clock

The challenge required unused points to expire after 90 days.

Waiting 90 days for testing is not practical, so the system provides:

POST /clock

The endpoint accepts a supplied timestamp.

The backend finds point lots where:

expires_at <= supplied time

and unused points are still remaining.

The expired points are:

Removed from current_points
Recorded as an EXPIRATION transaction
Kept unchanged in lifetime_points

Example:

Before expiry:

Current Points  = 100
Lifetime Points = 100

After expiry:

Current Points  = 0
Lifetime Points = 100

Using /clock makes the expiry behaviour deterministic and easy to test.

### Tier-Change Notifications

The third challenge twist required a notification when a member crosses into a new tier.

Instead of directly connecting the application to an external notification provider, an outbox pattern was implemented.

When a tier changes, the backend creates a TIER_CHANGED event.

Examples:

Bronze → Silver
Silver → Gold
Gold → Platinum

The event stores information such as:

Member ID
Member name
Phone number
Previous tier
New tier
Notification message

The events can be viewed using:

GET /outbox

The current implementation creates and stores the notification event. Actual SMS, email or push delivery can be connected to a separate Notification Service later.

### Authentication

Staff registration and login were implemented using JWT authentication.

The flow is:

Register
   ↓
Hash Password
   ↓
Store User
   ↓
Login
   ↓
Generate JWT
   ↓
Send Bearer Token
   ↓
Access Protected APIs

Protected operations require authentication.

Passwords are stored as hashes rather than plain text.

### Member Search

The café staff need to find members quickly, especially when the member list becomes large.

The member API supports phone-number search:

GET /api/members/search?phone={phone}

The phone number is unique in the database.

The phone field is also indexed to support efficient lookup.

15. Pagination and Sorting

The member list supports pagination and sorting instead of loading the complete member list at once.

Example:

GET /api/members?page=1&limit=10&sort=name&order=asc

Supported sorting fields include:

name
phone
current_points
lifetime_points
tier
created_at

This was implemented because the challenge specifically mentions that the member list can be long.

### Frontend Design

The frontend was built using React and Vite with Tailwind CSS.

The main screens cover:

Landing page
Staff login
Dashboard
Member list
Add member
Member details
Purchase recording
Rewards
Transactions

The landing page explains:

What BeanLedger is
Key features
Target café users
How the system helps staff
Future improvements

The interface was kept simple so that café staff can perform common counter operations without unnecessary steps.

### Testing Strategy

Testing was performed feature by feature instead of waiting until the complete application was finished.

The general development cycle was:

Implement Feature
      ↓
Run Backend
      ↓
Test API
      ↓
Check Database
      ↓
Test Frontend
      ↓
Fix Issue
      ↓
Retest

Testing was mainly performed using FastAPI Swagger UI and the React frontend.

### Authentication Testing

The following cases were tested:

Staff registration
Duplicate email registration
Valid login
Invalid login
JWT token generation
Access to protected APIs

The login request was tested using the form format required by OAuth2PasswordRequestForm.

### Member Testing

The following cases were tested:

Create member
Create member with duplicate phone number
Get member details
Search member by phone
List members
Pagination
Sorting

The database was checked to confirm that member information was persisted correctly.

### Purchase Testing

The purchase flow was tested by:

Creating a member
Recording a purchase
Checking calculated points
Checking current points
Checking lifetime points
Checking the tier
Checking the transaction
Checking the point lot

Tier-boundary purchases were also tested to verify that the tier changes after the purchase.

### Redemption Testing

The redemption flow was tested by:

Viewing available rewards
Redeeming with sufficient points
Checking the reduced current balance
Checking lifetime points remain unchanged
Checking transaction creation
Testing redemption with insufficient points
Checking point-lot consumption

Oldest-first point consumption was also verified.

### Platinum Testing

The Platinum boundary was tested using lifetime points.

The main condition checked was:

Lifetime Points >= 5000

The tests verified that:

Platinum is assigned at the required threshold
Existing tiers still work
Lifetime points are used for tier calculation
Adding Platinum does not directly modify existing current balances
### Expiry Testing

The expiry flow was tested without waiting 90 days.

The test sequence was:

Create Member
      ↓
Record Purchase
      ↓
Create Point Lot
      ↓
Check Expiry Date
      ↓
Call POST /clock
      ↓
Expire Unused Points
      ↓
Check Current Balance
      ↓
Check Lifetime Balance
      ↓
Check Expiration Transaction

The main validation was that expired points reduce current_points but do not reduce lifetime_points.

### Outbox Testing

Tier-change notifications were tested by triggering tier boundaries.

The sequence was:

Member Purchase
      ↓
Cross Tier Boundary
      ↓
Tier Updated
      ↓
TIER_CHANGED Event Created
      ↓
GET /outbox

The returned event was checked to verify the old tier, new tier and member information.

### Issues Encountered and Fixes
Issue 1 — Missing email-validator

Pydantic's EmailStr required the email-validator package.

Fix
pip install email-validator
pip freeze > requirements.txt

After installation, registration worked correctly.

Issue 2 — bcrypt Compatibility

During password hashing, an error occurred related to bcrypt password handling.

Fix

A compatible bcrypt version was installed:

pip install --upgrade bcrypt==4.0.1
pip freeze > requirements.txt

After the fix, registration, password hashing and login worked correctly.

Issue 3 — Login Request Format

The login endpoint uses OAuth2PasswordRequestForm, so sending normal JSON was not the correct request format.

Fix

The frontend was changed to send:

username
password

using:

application/x-www-form-urlencoded

URLSearchParams was used on the frontend to match the FastAPI endpoint.

Issue 4 — Expiry Testing

The system could not practically be tested by waiting 90 days.

Fix

The /clock endpoint was added so a test timestamp can be supplied and the expiry process can be triggered immediately.

Issue 5 — Tracking Expirable Points

A single current_points value was not enough to determine which points were eligible for expiry.

Fix

The PointLot model was introduced to track:

points_earned
points_remaining
earned_at
expires_at

This made individual point expiry possible.

Issue 6 — Preventing Redeemed Points From Expiring

The system needed to distinguish between points that were originally earned and points that were still unused.

Fix

points_remaining is reduced during redemption.

The expiry process only considers the remaining unused points, preventing already-redeemed points from being expired.

26. Key Design Decisions
Backend as the Source of Truth

All important reward calculations happen on the backend.

This includes:

Point calculation
Tier calculation
Redemption validation
Point expiry
Transaction creation
Tier-change events
Separate Current and Lifetime Points

This prevents redemption and expiry from incorrectly changing a member's historical tier progress.

Point Lots

Point lots make 90-day expiry possible while correctly handling partial redemption.

Outbox Pattern

The outbox keeps tier-change events persisted and separate from the eventual notification delivery service.

Persistent Database

SQLite ensures member balances, point lots and transactions remain available after restarting the backend.

Pagination and Sorting

These features address the requirement that the café may have a large member list.

27. Final Validation

After completing the implementation, the complete reward lifecycle was validated:

Staff Login
    ↓
Create / Search Member
    ↓
Record Purchase
    ↓
Calculate Points
    ↓
Update Current + Lifetime Points
    ↓
Recalculate Tier
    ↓
Create Point Lot
    ↓
Create Transaction
    ↓
Tier Change → Outbox Event
    ↓
Redeem Reward
    ↓
Consume Point Lots
    ↓
Advance Time Using /clock
    ↓
Expire Unused Points
    ↓
Record Expiration

The final implementation was checked through both the API layer and the React frontend to ensure that the displayed member balance matches the persisted backend state.