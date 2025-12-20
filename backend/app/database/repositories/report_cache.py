"""
Repository for report cache operations.
"""
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repositories.base import BaseRepository
from app.database.schemas.usage import ReportCacheDBModel


class ReportCacheRepository(BaseRepository[ReportCacheDBModel]):
    """Repository for cached report data."""

    def __init__(self, session: AsyncSession):
        super().__init__(ReportCacheDBModel, session)

    async def get_by_report_id(self, report_id: int) -> ReportCacheDBModel | None:
        """Get cached report by external report ID."""
        stmt = select(self.model).where(
            self.model.report_id == report_id,
            self.model.expires_at > datetime.utcnow(),
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def cache_report(
        self, report_id: int, name: str, credit_cost: int, ttl_hours: int = 1
    ) -> ReportCacheDBModel:
        """Cache a report with TTL."""
        expires_at = datetime.utcnow() + timedelta(hours=ttl_hours)

        # Check if exists
        existing = await self.get_by_report_id(report_id)
        if existing:
            return await self.update(
                existing.id, name=name, credit_cost=credit_cost, expires_at=expires_at
            )

        return await self.create(
            report_id=report_id,
            name=name,
            credit_cost=credit_cost,
            expires_at=expires_at,
        )
