"""
Pytest configuration and fixtures.
"""
import asyncio

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.core.config import get_config, reset_config
from app.create_app import get_app
from app.utils.constants import ConfigFile


@pytest.fixture(scope="session")
def event_loop():
    """
    Create event loop for entire test session.
    """
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function", autouse=True)
def reset_config_fixture():
    """Reset config between tests."""
    reset_config()
    yield
    reset_config()


@pytest.fixture(scope="function")
def test_config():
    """
    Get test configuration.
    """
    reset_config()
    return get_config(ConfigFile.TEST)


@pytest_asyncio.fixture(scope="function")
async def test_app():
    """
    Create FastAPI application with test configuration.
    """
    app = get_app(ConfigFile.TEST)
    yield app


@pytest_asyncio.fixture(scope="function")
async def test_async_client(test_app):
    """
    Create async HTTP client for API testing.
    """
    transport = ASGITransport(app=test_app)
    async with AsyncClient(
        transport=transport, base_url="http://test", follow_redirects=True
    ) as ac:
        yield ac
