"""
Pydantic models for Orbital Usage API.

These models define the strict API contract.
"""

from pydantic import BaseModel, Field


class UsageItem(BaseModel):
    """Single usage item in the response."""
    message_id: int
    timestamp: str
    report_name: str | None = None  # Omitted if not a report
    credits_used: float = Field(..., description="Always rounded to 2 decimals")


class UsageResponse(BaseModel):
    """Response model for GET /usage endpoint."""
    usage: list[UsageItem]


# Models for external API responses
class ExternalMessage(BaseModel):
    """Message from the external API."""
    id: int
    timestamp: str
    text: str
    report_id: int | None = None


class ExternalMessagesResponse(BaseModel):
    """Response from /messages/current-period endpoint."""
    messages: list[ExternalMessage]


class ExternalReport(BaseModel):
    """Report details from external API."""
    id: int
    name: str
    credit_cost: int
