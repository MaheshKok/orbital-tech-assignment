# Orbital Usage API - Backend

FastAPI-based REST API for tracking AI credit usage with PostgreSQL persistence.

## Tech Stack

| Category         | Technology      | Version | Purpose                        |
| ---------------- | --------------- | ------- | ------------------------------ |
| Framework        | FastAPI         | 0.109.1 | Async web framework            |
| Server           | Uvicorn         | 0.22.0  | ASGI server                    |
| Database         | PostgreSQL      | Latest  | Data persistence               |
| ORM              | SQLAlchemy      | 2.x     | Database abstraction           |
| Migrations       | Alembic         | 1.11+   | Schema versioning              |
| Validation       | Pydantic        | 2.x     | Request/response validation    |
| HTTP Client      | HTTPX           | 0.24+   | Async HTTP requests            |
| Package Manager  | uv              | Latest  | Fast Python package management |

## Project Structure

```
backend/
├── app/
│   ├── create_app.py          # FastAPI application factory
│   ├── routes/
│   │   └── usage.py           # Usage endpoint handlers
│   ├── models/
│   │   └── usage.py           # SQLAlchemy models
│   ├── schemas/
│   │   └── usage.py           # Pydantic schemas
│   ├── utils/
│   │   ├── constants.py       # Configuration enums
│   │   └── credits.py         # Credit calculation logic
│   └── db/
│       └── session.py         # Database session management
├── main.py                    # Application entry point
├── pyproject.toml             # Dependencies and project config
├── uv.lock                    # Locked dependencies
└── tests/                     # Test suite
```

## API Endpoints

### `GET /usage`

Returns all usage records with credits calculated based on message length.

**Response:**

```json
{
  "usage": [
    {
      "message_id": 1,
      "timestamp": "2024-01-15T14:30:00Z",
      "report_name": "Contract Analysis",
      "credits_used": 15.6
    },
    {
      "message_id": 2,
      "timestamp": "2024-01-15T15:45:00Z",
      "credits_used": 8.2
    }
  ]
}
```

**Notes:**
- `report_name` is optional (omitted for non-report messages)
- `credits_used` always has 2 decimal places
- Timestamps are ISO 8601 format

### `GET /health`

Health check endpoint for monitoring.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T16:00:00Z"
}
```

## Credit Calculation

Credits are calculated using a token approximation:

```python
# Approximate 1 token ≈ 4 characters
tokens = len(message_text) / 4

# Rate: 40 credits per 100 tokens
credits = (tokens / 100) * 40

# Minimum charge: 1.0 credit
credits = max(1.0, round(credits, 2))
```

**Examples:**

| Message Length | Tokens (approx) | Credits |
| -------------- | --------------- | ------- |
| 50 chars       | 12.5            | 5.00    |
| 100 chars      | 25              | 10.00   |
| 500 chars      | 125             | 50.00   |

## Getting Started

### Prerequisites

- Python 3.10-3.12
- PostgreSQL (for production)
- uv package manager (recommended)

### Installation

```bash
# Install dependencies with uv
uv sync

# Or with pip
pip install -e .
```

### Running Locally

```bash
# Development mode with hot-reload
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using the main.py script
uv run python main.py
```

The API will be available at `http://localhost:8000`.

### Environment Variables

| Variable         | Default                                      | Description          |
| ---------------- | -------------------------------------------- | -------------------- |
| `DATABASE_URL`   | `postgresql://user:pass@localhost/orbital`  | PostgreSQL connection string |
| `CONFIG_ENV`     | `development`                                | Config environment   |

### Database Setup

```bash
# Run migrations
uv run alembic upgrade head

# Create a new migration
uv run alembic revision --autogenerate -m "description"
```

## Docker Support

### Building and Running

```bash
# Build the image
docker build -t backend .

# Run the container
docker run -p 8000:8000 -e DATABASE_URL=postgresql://... backend
```

### Using Docker Compose

```bash
# Start both frontend and backend
docker-compose up --build

# Backend: http://localhost:8000
# API docs: http://localhost:8000/docs
```

The Dockerfile uses `uv` for fast dependency installation.

## API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing

```bash
# Run tests
uv run pytest

# With coverage
uv run pytest --cov=app

# Run specific test
uv run pytest tests/test_usage.py
```

## Code Quality

### Linting

```bash
# Ruff (fast linter)
uv run ruff check .

# Fix issues automatically
uv run ruff check --fix .

# Flake8 (additional checks)
uv run flake8 app/
```

### Formatting

The project uses Ruff for formatting with these settings:

- Line length: 120 characters
- Target Python: 3.10+
- Import sorting: isort-compatible

## Development Workflow

1. **Make changes** to the code
2. **Run linter**: `uv run ruff check .`
3. **Run tests**: `uv run pytest`
4. **Test locally**: `uv run python main.py`
5. **Build Docker**: `docker build -t backend .`

## Configuration

The app supports multiple configuration files via `ConfigFile` enum:

```python
# app/utils/constants.py
class ConfigFile(str, Enum):
    DEVELOPMENT = "development"
    PRODUCTION = "production"
    TEST = "test"

# main.py
app = get_app(ConfigFile.DEVELOPMENT)
```

Configuration files are loaded from `config/` directory.

## Performance Considerations

- **Async handlers**: All routes use `async def` for non-blocking I/O
- **Connection pooling**: SQLAlchemy manages database connections
- **Response caching**: Consider adding Redis for `/usage` endpoint
- **Token estimation**: Uses simple division (fast) vs actual tokenizer (accurate but slow)

## Production Recommendations

1. **Use actual tokenizer**: Replace `/4` approximation with `tiktoken` library
2. **Add caching**: Cache `/usage` responses for 1-5 minutes
3. **Database indexing**: Add indexes on `timestamp` for faster queries
4. **Rate limiting**: Add rate limiting middleware
5. **Monitoring**: Integrate with logging/monitoring service

## Troubleshooting

### Port already in use

```bash
# Find process on port 8000
lsof -i :8000

# Kill it
kill -9 <PID>
```

### Database connection issues

```bash
# Check PostgreSQL is running
pg_isready

# Verify connection string
echo $DATABASE_URL
```

### Import errors

```bash
# Reinstall dependencies
uv sync --refresh

# Clear Python cache
find . -type d -name __pycache__ -exec rm -rf {} +
```

## Additional Documentation

For detailed information about tokenization and credit calculation, see [TOKENIZATION_NOTES.md](./TOKENIZATION_NOTES.md).
