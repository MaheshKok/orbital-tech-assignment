"""
Credit calculation logic for Orbital Usage API.

Implements the credit calculation rules:
- 1 token ≈ 4 characters
- Base rate: 40 credits per 100 tokens
- Minimum 1.00 credit for text messages (not for reports)
- Round to 2 decimal places
"""
from decimal import ROUND_HALF_UP, Decimal

from app.utils.constants import BASE_MODEL_RATE, CHARACTERS_PER_TOKEN, MINIMUM_CREDITS


def calculate_message_credits(text: str) -> float:
    """
    Calculate credits for a text-based message (no report).

    Uses character-based token estimation: 1 token ≈ 4 characters.
    """
    char_count = len(text)
    estimated_tokens = char_count / CHARACTERS_PER_TOKEN
    credits = Decimal(str((estimated_tokens / 100) * BASE_MODEL_RATE))

    # Round to 2 decimal places
    credits = credits.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    # Apply minimum AFTER rounding
    return float(max(credits, Decimal(str(MINIMUM_CREDITS))))


def get_report_credits(credit_cost: int) -> float:
    """
    Get credits for a report-based message.

    Report costs are authoritative from the external API.
    No minimum applies - format to 2 decimal places for consistency.
    """
    return float(Decimal(str(credit_cost)).quantize(Decimal("0.01")))


def get_credits_for_message(message: dict, report: dict | None) -> float:
    """
    Unified credit calculation for any message type.
    """
    if report:
        return get_report_credits(report["credit_cost"])
    else:
        return calculate_message_credits(message["text"])
