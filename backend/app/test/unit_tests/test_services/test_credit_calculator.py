"""
Tests for credit calculator service.
"""

from app.services.credit_calculator import (
    calculate_message_credits,
    get_credits_for_message,
    get_report_credits,
)


class TestCalculateMessageCredits:
    """Tests for calculate_message_credits function."""

    def test_short_message_returns_minimum(self):
        """Short messages should return minimum 1.00 credit."""
        result = calculate_message_credits("Hi")  # 2 chars = 0.5 tokens = 0.20 credits
        assert result == 1.00

    def test_longer_message_calculation(self):
        """Longer messages should calculate based on character count."""
        # 400 characters = 100 tokens = 40 credits
        text = "a" * 400
        result = calculate_message_credits(text)
        assert result == 40.00

    def test_rounding_to_two_decimals(self):
        """Result should be rounded to 2 decimal places."""
        # 156 chars = 39 tokens = 15.60 credits
        text = "a" * 156
        result = calculate_message_credits(text)
        assert result == 15.60

    def test_empty_message_returns_minimum(self):
        """Empty message should return minimum."""
        result = calculate_message_credits("")
        assert result == 1.00


class TestGetReportCredits:
    """Tests for get_report_credits function."""

    def test_returns_exact_credit_cost(self):
        """Should return the exact credit cost from the report."""
        result = get_report_credits(25)
        assert result == 25.00

    def test_zero_cost_allowed(self):
        """Zero cost reports should return 0.00 (no minimum)."""
        result = get_report_credits(0)
        assert result == 0.00

    def test_fractional_cost(self):
        """Should handle fractional costs."""
        result = get_report_credits(50)
        assert result == 50.00


class TestGetCreditsForMessage:
    """Tests for get_credits_for_message function."""

    def test_with_report_uses_report_cost(self):
        """Messages with reports should use report credit cost."""
        message = {"id": 1, "text": "Hello", "report_id": 10}
        report = {"id": 10, "name": "Test Report", "credit_cost": 30}
        result = get_credits_for_message(message, report)
        assert result == 30.00

    def test_without_report_calculates_from_text(self):
        """Messages without reports should calculate from text."""
        message = {"id": 1, "text": "a" * 400, "report_id": None}
        result = get_credits_for_message(message, None)
        assert result == 40.00
