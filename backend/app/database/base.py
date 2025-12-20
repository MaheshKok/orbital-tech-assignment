"""
Database base configuration following kkb_fastapi pattern.

Handles PostgreSQL async engine creation and URL construction.
"""

from sqlalchemy.engine.url import URL
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool

from app.core.config import Config

engine_kw = {
    "pool_pre_ping": True,
    "pool_size": 2,
    "max_overflow": 4,
    "connect_args": {
        "prepared_statement_cache_size": 0,
        "statement_cache_size": 0,
    },
}


def get_db_url(config: Config) -> URL:
    """
    Construct database URL from config.

    Args:
        config: Application config instance

    Returns:
        SQLAlchemy URL object for async PostgreSQL
    """
    db_config = config.config.get("db", {})
    return URL.create(
        drivername="postgresql+asyncpg",
        username=db_config.get("username", "postgres"),
        password=db_config.get("password", "postgres"),
        host=db_config.get("host", "localhost"),
        port=int(db_config.get("port", 5432)),
        database=db_config.get("database", "orbital_usage"),
    )


def get_async_engine(async_db_url: URL):
    """
    Create async database engine with connection pooling.
    """
    return create_async_engine(
        async_db_url,
        poolclass=QueuePool,
        pool_recycle=3600,
        pool_pre_ping=True,
        pool_size=60,
        max_overflow=80,
        pool_timeout=30,
    )


def get_async_session_maker(async_db_url: URL) -> sessionmaker:
    """
    Create async session maker.
    """
    async_engine = get_async_engine(async_db_url)
    return sessionmaker(
        bind=async_engine, expire_on_commit=False, class_=AsyncSession
    )
