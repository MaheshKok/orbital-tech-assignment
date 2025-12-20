# Orbital Witness - Product Engineering Task

## Overview

Build a **Credit Usage Dashboard** for Orbital Copilot, an AI assistant for Real Estate lawyers. The system tracks consumption-based billing where customers are charged based on "credits" consumed.

---

## Tech Stack (Chosen)

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React + TypeScript      |
| Backend  | Python (FastAPI)        |
| Database | PostgreSQL              |

---

## Data Sources (External APIs)

### 1. Messages Endpoint
**URL:** `https://owpublic.blob.core.windows.net/tech-task/messages/current-period`

**Method:** GET (no auth required)

**Response:** Array of messages sent to Orbital Copilot in current billing period

```json
{
  "messages": [
    {
      "id": 1000,
      "text": "Generate a Tenant Obligations Report for the new lease terms.",
      "timestamp": "2024-04-29T02:08:29.375Z",
      "report_id": 5392
    },
    {
      "id": 1001,
      "text": "Are there any restrictions on alterations or improvements?",
      "timestamp": "2024-04-29T03:25:03.613Z"
    }
  ]
}
```

**Fields:**
- `id` (number): Unique message identifier
- `text` (string): The message content
- `timestamp` (string): ISO 8601 format
- `report_id` (number, optional): If present, indicates a report was generated

---

### 2. Reports Endpoint
**URL:** `https://owpublic.blob.core.windows.net/tech-task/reports/:id`

**Method:** GET (no auth required)

**Response:** Report name and credit cost

```json
{
  "id": 1124,
  "name": "Short Lease Report",
  "credit_cost": 61
}
```

**Known Report IDs from data:**
- 5392 - Tenant Obligations Report
- 8806 - Maintenance Responsibilities Report
- 1124 - Short Lease Report
- 5447 - Landlord Responsibilities Report
- 7321 - Environmental Compliance Report
- 9634 - Occupancy Rate Report
- 8452 - Rent Payment History Report
- 3952 - Retail Lease Report

---

## Backend Requirements

### API Endpoint
**Route:** `GET /usage`

**Response Format (STRICT CONTRACT):**

```json
{
  "usage": [
    {
      "message_id": 1000,
      "timestamp": "2024-04-29T02:08:29.375Z",
      "report_name": "Tenant Obligations Report",
      "credits_used": 79.00
    },
    {
      "message_id": 1001,
      "timestamp": "2024-04-29T03:25:03.613Z",
      "credits_used": 5.20
    }
  ]
}
```

**Field Rules:**
- `message_id` (number): Required
- `timestamp` (string): Required, ISO 8601 format
- `report_name` (string): **OMIT if no report** (not null, not empty string)
- `credits_used` (number): Required, 2 decimal places

---

### Credit Calculation Logic

#### Case 1: Message WITH `report_id`
- Ignore message text
- Fetch report from `/reports/:id`
- Use the `credit_cost` from report response

#### Case 2: Message WITHOUT `report_id`
Use token-based estimation:

```
credits_used = (estimated_tokens / 100) * base_model_rate
```

**Rules:**
- `estimated_tokens` = character_count / 4 (1 token ≈ 4 characters)
- `base_model_rate` = 40 (fixed)
- Round to 2 decimal places
- **Minimum cost: 1.00 credits** (always apply)

**Word Definition:** A "word" is any continual sequence of letters, plus `'` and `-`

**Example Calculation:**
```
Message: "What is the rent?" (18 characters)
estimated_tokens = 18 / 4 = 4.5
credits = (4.5 / 100) * 40 = 1.8
Result: 1.80 credits (above minimum)

Message: "Hi" (2 characters)
estimated_tokens = 2 / 4 = 0.5
credits = (0.5 / 100) * 40 = 0.2
Result: 1.00 credits (minimum applied)
```

---

## Frontend Requirements

### Dashboard Components

#### 1. Bar Chart
- **X-axis:** Date (from earliest to latest in data)
- **Y-axis:** Credits consumed
- **Bars:** One bar per day showing total credits for that day
- Must include ALL dates in range (even if zero usage)

#### 2. Data Table

| Column | Format | Sortable |
|--------|--------|----------|
| Message ID | Number | No |
| Timestamp | `DD-MM-YYYY HH:mm` | No |
| Report Name | String (empty if none) | Yes |
| Credits Used | 2 decimal places | Yes |

**Sorting Behavior:**
- Click 1: Ascending
- Click 2: Descending  
- Click 3: Original order (reset)
- Multiple columns can be sorted simultaneously

#### 3. URL State
- Sorting state must be reflected in URL
- Sharing URL should show same results with same sorting

---

## Reflection Questions (for README/Interview)

1. **Why approximate 1 token ≈ 4 characters?**
   - How might this break down for legal language/formatting?

2. **Different models (GPT-3.5 vs GPT-4) implications?**
   - How would credit calculation logic change?

3. **How to improve token estimation in production?**
   - Tools/libraries for exact token count?

4. **Caching/batching strategies for slow/rate-limited LLM API?**

5. **Normalizing token billing for fairness across users?**
   - Include user intent or confidence in pricing?

6. **How to explain cost differences to lawyers?**
   - What information to expose in UI?

---

## Sample Data Summary

**Total Messages:** 110 (ID 1000-1109)
**Date Range:** 2024-04-29 to 2024-05-04

**Message Breakdown:**
- Messages with reports: ~35
- Messages without reports: ~75

---

## Evaluation Criteria

1. **Code Quality** - Clean, maintainable code
2. **Problem Solving Approach** - Reasoning about decisions
3. **Frontend Focus** - Primary evaluation area
4. **Documentation** - README with decisions, concessions, run instructions
5. **Understanding** - Must explain decisions in interview

---

## Time Constraint

**Target:** 3-4 hours maximum

**Priority:** Frontend > Backend (if running low on time)

---

## Important Notes

⚠️ **API Contract is STRICT** - Multiple teams depend on exact format

⚠️ **Interview includes code walkthrough** - Must understand all decisions

⚠️ **Tools allowed** - But must be able to explain everything
