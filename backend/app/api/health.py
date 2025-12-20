"""
Health check endpoint.

GET /health - Returns health status of the application.
"""

import logging

from fastapi import APIRouter

logger = logging.getLogger(__name__)

health_router = APIRouter(tags=["health"])


@health_router.get("/health")
async def get_health() -> dict:
    """
    Get health status of the application.

    Returns:
        dict: Health status of the application.
    """
    return {"status": "ok"}
