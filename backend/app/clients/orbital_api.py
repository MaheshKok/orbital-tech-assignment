"""
HTTP client for Orbital Witness external APIs.

Implements:
- GET /messages/current-period
- GET /reports/:id
- In-memory caching for reports
- Concurrent batch fetching
"""
import asyncio
import logging

import httpx

from app.utils.constants import ORBITAL_API_BASE_URL

logger = logging.getLogger(__name__)


class OrbitalAPIClient:
    """
    Async client for Orbital Witness external APIs.

    Usage:
        client = OrbitalAPIClient(http_client, cache)
        messages = await client.get_messages()
        reports = await client.get_reports_batch([1, 2, 3])
    """

    def __init__(self, client: httpx.AsyncClient, cache: dict | None = None):
        self._client = client
        self._report_cache = cache if cache is not None else {}

    async def get_messages(self) -> list[dict]:
        """Fetch all messages for the current billing period."""
        response = await self._client.get(f"{ORBITAL_API_BASE_URL}/messages/current-period")
        response.raise_for_status()
        data = response.json()
        return data.get("messages", [])

    async def get_report(self, report_id: int) -> dict:
        """
        Fetch a single report by ID.

        Results are cached for future requests.
        """
        # Check cache first
        if report_id in self._report_cache:
            logger.debug(f"Report {report_id} found in cache")
            return self._report_cache[report_id]

        response = await self._client.get(f"{ORBITAL_API_BASE_URL}/reports/{report_id}")
        response.raise_for_status()
        report = response.json()

        # Cache for future requests
        self._report_cache[report_id] = report
        logger.debug(f"Report {report_id} cached")
        return report

    async def get_reports_batch(self, report_ids: list[int]) -> dict[int, dict]:
        """
        Fetch multiple reports concurrently with deduplication.

        Returns a dict mapping report_id -> report data.
        """
        # Deduplicate IDs
        unique_ids = list(set(report_ids))

        # Filter out already-cached reports
        to_fetch = [rid for rid in unique_ids if rid not in self._report_cache]

        # Fetch uncached reports concurrently
        if to_fetch:
            logger.info(f"Fetching {len(to_fetch)} uncached reports")
            tasks = [self.get_report(rid) for rid in to_fetch]
            await asyncio.gather(*tasks, return_exceptions=True)

        # Return all requested reports from cache
        return {rid: self._report_cache[rid] for rid in unique_ids if rid in self._report_cache}
