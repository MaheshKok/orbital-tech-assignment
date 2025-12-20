"""
Base repository with generic CRUD operations.
"""
from typing import Any, Generic, TypeVar

from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

ModelType = TypeVar("ModelType")


class BaseRepository(Generic[ModelType]):
    """Generic repository for database operations."""

    def __init__(self, model: type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    async def create(self, **kwargs: Any) -> ModelType:
        """Create a new record."""
        instance = self.model(**kwargs)
        self.session.add(instance)
        await self.session.flush()
        await self.session.refresh(instance)
        return instance

    async def get_by_id(self, record_id: int) -> ModelType | None:
        """Get a record by ID."""
        stmt = select(self.model).where(self.model.id == record_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_all(
        self, limit: int | None = None, offset: int = 0
    ) -> list[ModelType]:
        """Get all records with optional pagination."""
        stmt = select(self.model).offset(offset)
        if limit:
            stmt = stmt.limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def update(self, record_id: int, **kwargs: Any) -> ModelType | None:
        """Update a record by ID."""
        stmt = (
            update(self.model)
            .where(self.model.id == record_id)
            .values(**kwargs)
            .returning(self.model)
        )
        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.scalars().first()

    async def delete(self, record_id: int) -> bool:
        """Hard delete a record by ID."""
        stmt = delete(self.model).where(self.model.id == record_id)
        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.rowcount > 0

    async def soft_delete(self, record_id: int) -> ModelType | None:
        """Soft delete a record by ID (if model supports it)."""
        if not hasattr(self.model, "deleted_at"):
            raise NotImplementedError(
                f"{self.model.__name__} does not support soft delete"
            )
        from datetime import datetime

        return await self.update(record_id, deleted_at=datetime.utcnow())

    async def count(self, **filters: Any) -> int:
        """Count records with optional filters."""
        stmt = select(func.count()).select_from(self.model)
        for key, value in filters.items():
            stmt = stmt.where(getattr(self.model, key) == value)
        result = await self.session.execute(stmt)
        return result.scalar() or 0

    async def exists(self, **filters: Any) -> bool:
        """Check if a record exists with given filters."""
        count = await self.count(**filters)
        return count > 0

    async def bulk_create(self, records: list[dict[str, Any]]) -> list[ModelType]:
        """Bulk create multiple records."""
        instances = [self.model(**record) for record in records]
        self.session.add_all(instances)
        await self.session.flush()
        for instance in instances:
            await self.session.refresh(instance)
        return instances
