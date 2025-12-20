"""
Repository for usage snapshot operations.
"""
from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repositories.base import BaseRepository
from app.database.schemas.usage import UsageSnapshotDBModel


class UsageSnapshotRepository(BaseRepository[UsageSnapshotDBModel]):
    """Repository for usage snapshots."""

    def __init__(self, session: AsyncSession):
        super().__init__(UsageSnapshotDBModel, session)

    async def get_by_date(self, snapshot_date: date) -> list[UsageSnapshotDBModel]:
        """Get all snapshots for a given date."""
        stmt = select(self.model).where(self.model.snapshot_date == snapshot_date)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_message_id(self, message_id: int) -> UsageSnapshotDBModel | None:
        """Get snapshot by message ID."""
        stmt = select(self.model).where(self.model.message_id == message_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()
