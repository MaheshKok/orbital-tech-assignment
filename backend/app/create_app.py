"""
FastAPI application factory.

Creates and configures the FastAPI application instance.
"""
import logging
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import usage_router
from app.core.config import get_config

logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)


def register_routers(app: FastAPI):
    """Register all API routers."""
    app.include_router(usage_router)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.

    Creates shared HTTP client and report cache on startup.
    Cleans up resources on shutdown.
    """
    logging.info("Application startup")

    # Create a single HTTP client that will be reused across all requests
    app.state.http_client = httpx.AsyncClient(timeout=30.0)

    # In-memory cache for reports (reports are semi-static)
    app.state.report_cache = {}

    logging.info("Initialized HTTP client and report cache")

    try:
        yield
    finally:
        # Cleanup on shutdown
        await app.state.http_client.aclose()
        logging.info("Application shutdown")


def get_app(config_file: str) -> FastAPI:
    """
    Application factory function.

    Args:
        config_file: Configuration file name (e.g., "production.toml")

    Returns:
        Configured FastAPI application instance
    """
    config = get_config(config_file)

    app = FastAPI(
        title=config.get("api.title", "Orbital Witness Usage API"),
        description=config.get(
            "api.description", "FastAPI-based usage tracking and credit calculation"
        ),
        version=config.get("api.version", "1.0.0"),
        debug=config.get("api.debug", False),
        lifespan=lifespan,
    )

    app.state.config = config

    # Register routers
    register_routers(app)

    # Set up CORS middleware
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app
