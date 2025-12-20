"""
Usage service for aggregating and processing usage data.
"""
import logging

from app.clients.orbital_api import OrbitalAPIClient
from app.models.schemas import UsageItem
from app.services.credit_calculator import get_credits_for_message

logger = logging.getLogger(__name__)


async def get_usage_data(api_client: OrbitalAPIClient) -> list[UsageItem]:
    """
    Fetch and process all usage data for the current period.

    1. Fetch all messages
    2. Identify which messages have reports
    3. Batch fetch all needed reports
    4. Calculate credits for each message
    5. Return formatted usage items
    """
    # Fetch all messages
    messages = await api_client.get_messages()
    logger.info(f"Fetched {len(messages)} messages")

    # Identify report IDs needed
    report_ids = [msg["report_id"] for msg in messages if msg.get("report_id")]

    # Batch fetch all reports
    reports_map = await api_client.get_reports_batch(report_ids)
    logger.info(f"Fetched {len(reports_map)} unique reports")

    # Process each message
    usage_items = []
    for msg in messages:
        report_id = msg.get("report_id")
        report = reports_map.get(report_id) if report_id else None

        credits = get_credits_for_message(msg, report)

        usage_item = UsageItem(
            message_id=msg["id"],
            timestamp=msg["timestamp"],
            report_name=report["name"] if report else None,
            credits_used=credits,
        )
        usage_items.append(usage_item)

    return usage_items
