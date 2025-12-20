"""
Usage API endpoint.

GET /usage - Returns all usage data for the current billing period.
"""
import logging

from fastapi import APIRouter, Request

from app.clients.orbital_api import OrbitalAPIClient
from app.models.schemas import UsageResponse
from app.services.usage_service import get_usage_data

logger = logging.getLogger(__name__)

router = APIRouter(tags=["usage"])


@router.get(
    "/usage",
    response_model=UsageResponse,
    response_model_exclude_none=True,  # CRITICAL: Omit report_name when None
    summary="Get usage data for current billing period",
    description="Returns all messages with calculated credits for the current billing period.",
)
async def get_usage(request: Request) -> UsageResponse:
    """
    Get all usage data for the current billing period.

    Returns:
        UsageResponse with list of usage items.
        Each item contains message_id, timestamp, credits_used,
        and optionally report_name if the message was a report.
    """
    # Get the shared HTTP client and cache from app state
    api_client = OrbitalAPIClient(
        request.app.state.http_client,
        request.app.state.report_cache,
    )

    usage_items = await get_usage_data(api_client)

    return UsageResponse(usage=usage_items)
