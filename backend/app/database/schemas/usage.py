"""
Usage data SQLAlchemy models.

Models for caching report data and storing usage snapshots.
"""
import uuid
from datetime import datetime

from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Index,
    Integer,
    Numeric,
    String,
)
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class ReportCacheDBModel(Base):
    """
    Reports cache table for storing fetched report data.

    Reduces external API calls by caching report details.
    """

    __tablename__ = "reports_cache"

    __table_args__ = (
        Index("ix_reports_cache_report_id", "report_id"),
        Index("ix_reports_cache_expires", "expires_at"),
        {"comment": "Cache for external API report data"},
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(Integer, unique=True, nullable=False, comment="External report ID")
    name = Column(String(255), nullable=False, comment="Report name")
    credit_cost = Column(Numeric(10, 2), nullable=False, comment="Credit cost for this report")

    fetched_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False, comment="Cache expiration time")

    def __repr__(self):
        return f"<ReportCacheDBModel: {self.report_id} - {self.name}>"


class UsageSnapshotDBModel(Base):
    """
    Usage snapshots for analytics and historical tracking.

    Stores daily usage data for reporting and auditing.
    """

    __tablename__ = "usage_snapshots"

    __table_args__ = (
        Index("ix_usage_snapshots_date", "snapshot_date"),
        Index("ix_usage_snapshots_message_id", "message_id"),
        {"comment": "Historical usage data snapshots"},
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    snapshot_date = Column(Date, nullable=False, comment="Date of the snapshot")
    message_id = Column(Integer, nullable=False, comment="External message ID")
    timestamp = Column(DateTime, nullable=False, comment="Message timestamp")
    report_name = Column(String(255), nullable=True, comment="Report name if applicable")
    credits_used = Column(Numeric(10, 2), nullable=False, comment="Credits used")

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<UsageSnapshotDBModel: {self.message_id} - {self.credits_used} credits>"
