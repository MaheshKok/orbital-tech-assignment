# Orbital Copilot - Usage Dashboard

A full-stack application for tracking and visualizing AI credit usage. Built with React + TypeScript frontend and Python FastAPI backend.

## Quick Start

```bash
# Run with Docker Compose (recommended)
docker-compose up --build

# Or run locally
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
cd frontend && npm install && npm run dev
```

| Service  | URL                        |
| -------- | -------------------------- |
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:8000      |
| API Docs | http://localhost:8000/docs |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              React 19 + TypeScript + Chakra UI               │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │    │
│  │  │  Bar Chart   │  │  Data Table  │  │  URL State Mgmt  │   │    │
│  │  │  (Recharts)  │  │  (Sortable)  │  │  (React Router)  │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP GET /usage
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PYTHON BACKEND (FastAPI)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │
│  │  /usage API  │──│ Credit Calc  │──│  External API Client     │   │
│  │  Endpoint    │  │ Service      │  │  (async + caching)       │   │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP GET (async)
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL APIs (Orbital Witness)                   │
│  ┌────────────────────────┐    ┌─────────────────────────────────┐  │
│  │ /messages/current-period│    │ /reports/:id                    │  │
│  └────────────────────────┘    └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend

| Component   | Technology     | Purpose                                          |
| ----------- | -------------- | ------------------------------------------------ |
| Framework   | FastAPI        | Async API with automatic OpenAPI docs            |
| HTTP Client | httpx          | Async external API calls with connection pooling |
| Validation  | Pydantic       | Request/response validation                      |
| Testing     | pytest + httpx | Async test client                                |

### Frontend

| Component     | Technology            | Purpose                          |
| ------------- | --------------------- | -------------------------------- |
| Framework     | React 19 + TypeScript | UI with type safety              |
| Build Tool    | Vite 7                | Fast HMR and optimized builds    |
| UI Library    | Chakra UI             | Component library with theming   |
| Data Fetching | TanStack Query        | Caching, loading states, retries |
| Charts        | Recharts              | Declarative bar charts           |
| Testing       | Jest + Cypress        | Unit and E2E testing             |

---

## Key Features

### Credit Calculation

Messages are billed using a token-based model:

- **With Report**: Uses `credit_cost` from report API (authoritative)
- **Without Report**: Estimated from message text
  - Formula: `credits = (characters / 4 / 100) * 40`
  - Minimum: 1.00 credit
  - Rounded to 2 decimal places

### Multi-Column Sorting

- Tri-state toggle: `none → asc → desc → none`
- Click order determines sort precedence
- URL-persisted: `?sort=credits_used:desc,report_name:asc`
- Empty report names always sort to end

### UTC Date Handling

All dates processed in UTC for consistency:

- Table timestamps: `DD-MM-YYYY HH:mm`
- Chart bucketing: Grouped by UTC date
- Avoids timezone mismatches between views

---

## Key Architectural Decisions

### 1. Chakra UI over Tailwind CSS

Originally planned Tailwind, switched to Chakra UI for:

- Built-in component library (less custom CSS)
- Theming with custom brand colors
- Accessible components out of the box

### 2. Async External API Calls

- Single `httpx.AsyncClient` reused via FastAPI lifespan
- Concurrent report fetching with `asyncio.gather()`
- In-memory caching for report data

### 3. URL-Based Sort State

- Shareable URLs with exact sort configuration
- Browser back/forward button support
- No external state management library needed

### 4. Response Contract: `exclude_none=True`

```python
# API omits report_name when None (not null)
@app.get("/usage", response_model_exclude_none=True)
```

Frontend expects optional field, not null value.

### 5. Decimal for Credit Calculations

```python
from decimal import Decimal, ROUND_HALF_UP
credits = Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
```

Avoids floating-point precision errors in billing.

---

## Project Structure

```
orbital-tech-assignment/
├── backend/
│   ├── app/
│   │   ├── api/routes/usage.py      # GET /usage endpoint
│   │   ├── services/
│   │   │   └── credit_calculator.py # Credit calculation logic
│   │   ├── clients/orbital_api.py   # External API client
│   │   └── models/schemas.py        # Pydantic models
│   ├── tests/                       # pytest tests
│   ├── Dockerfile
│   └── README.md                    # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/           # Main dashboard
│   │   │   ├── UsageTable/          # Sortable table
│   │   │   └── UsageChart/          # Bar chart
│   │   ├── hooks/useUrlSortState.ts # URL-synced sorting
│   │   └── utils/sortUtils.ts       # Multi-column sort logic
│   ├── cypress/                     # E2E tests
│   ├── Dockerfile
│   └── README.md                    # Frontend documentation
├── docker-compose.yml               # Production setup
├── docker-compose.dev.yml           # Development setup
└── PLANNING.md                      # Technical design document
```

---

## Running the Application

### Option 1: Docker Compose (Recommended)

```bash
# Production build
docker-compose up --build

# Development with hot reload
docker-compose -f docker-compose.dev.yml up --build
```

### Option 2: Local Development

**Backend:**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

---

## Running Tests

### Backend

```bash
cd backend
source .venv/bin/activate
pytest -v                           # All tests
pytest -v --cov=app --cov-report=html  # With coverage
```

### Frontend

```bash
cd frontend
npm test                            # Unit tests
npm run test:coverage               # With coverage
npm run cypress:run                 # E2E tests
npm run cypress:open                # Interactive E2E
```

---

## API Endpoints

### `GET /usage`

Returns aggregated usage data for the current billing period.

**Response:**

```json
{
  "usage": [
    {
      "message_id": 1000,
      "timestamp": "2024-04-29T02:08:29.375Z",
      "report_name": "Tenant Report",
      "credits_used": 15.5
    },
    {
      "message_id": 1001,
      "timestamp": "2024-04-29T03:15:00.000Z",
      "credits_used": 2.4
    }
  ]
}
```

Note: `report_name` is omitted (not null) when message has no associated report.

### `GET /health`

Health check endpoint for container orchestration.

---

## Environment Variables

### Backend

| Variable      | Default       | Description       |
| ------------- | ------------- | ----------------- |
| `APP_ENV`     | `development` | Environment mode  |
| `LOG_LEVEL`   | `INFO`        | Logging verbosity |
| `SERVER_HOST` | `0.0.0.0`     | Bind address      |
| `SERVER_PORT` | `8000`        | Server port       |

### Frontend

| Variable       | Default      | Description     |
| -------------- | ------------ | --------------- |
| `VITE_API_URL` | `""` (proxy) | Backend API URL |

---

## Design Trade-offs

| Decision            | Alternative   | Rationale                                    |
| ------------------- | ------------- | -------------------------------------------- |
| **In-memory cache** | Redis         | Simple, sufficient for demo scale            |
| **Custom table**    | AG Grid       | Full control over tri-state sorting          |
| **Chakra UI**       | Tailwind      | Faster development with pre-built components |
| **URL state**       | Redux/Context | Shareable URLs, simpler architecture         |
| **UTC everywhere**  | Local time    | Unambiguous for B2B product                  |

---

## Scalability Considerations

For production scale (10,000+ messages):

1. **Backend Pagination**: Server-side sorting and pagination
2. **Database Cache**: PostgreSQL/Redis for report caching
3. **Virtual Scrolling**: react-window for large tables
4. **Background Sync**: Pre-fetch reports in background job

See `PLANNING.md` for detailed scalability analysis.

---

## Documentation

| Document                                | Description                                |
| --------------------------------------- | ------------------------------------------ |
| [Backend README](./backend/README.md)   | Backend setup, API details, testing        |
| [Frontend README](./frontend/README.md) | Frontend architecture, components, testing |
| [PLANNING.md](./PLANNING.md)            | Technical design, trade-offs, scalability  |

---

## License

Private - Orbital Witness Technical Assignment
