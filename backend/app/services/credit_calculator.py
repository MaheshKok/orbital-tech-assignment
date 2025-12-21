"""
Credit calculation logic for Orbital Usage API.

Implements the credit calculation rules:
- 1 token ≈ 4 characters
- Base rate: 40 credits per 100 tokens
- Minimum 1.00 credit for text messages (not for reports)
- Round to 2 decimal places
"""

import re
from decimal import ROUND_HALF_UP, Decimal

from app.utils.constants import BASE_MODEL_RATE, CHARACTERS_PER_TOKEN, MINIMUM_CREDITS


def calculate_message_credits(text: str) -> float:
    """
    Calculate credits for a text-based message (no report).

    Uses character-based token estimation: 1 token ≈ 4 characters.
    Counts ALL characters including spaces and punctuation.
    """

    # Step 1: Count characters
    char_count = len(text)

    # Step 2: Estimate tokens (1 token ≈ 4 characters)
    estimated_tokens = char_count / CHARACTERS_PER_TOKEN

    # Step 3: Calculate credits using formula
    credits = Decimal(str((estimated_tokens / 100) * BASE_MODEL_RATE))

    # Step 4: Round to 2 decimal places
    credits = credits.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    # Step 5: Apply minimum of 1.00 credit
    return float(max(credits, Decimal(str(MINIMUM_CREDITS))))


def extract_word_characters(text: str) -> str:
    """
    Extract only word characters from text.

    A "word" is defined as any continual sequence of letters, plus ' and -.
    All other characters (spaces, punctuation, numbers, etc.) are stripped.
    """
    # Keep only letters (a-z, A-Z), apostrophes ('), and hyphens (-)
    return re.sub(r"[^a-zA-Z'\-]", "", text)


def calculate_message_credits_word_chars_only(text: str) -> float:
    """
    Calculate credits for a text-based message using word characters only.

    This is an alternative implementation that follows the assignment's
    definition of a "word" more strictly:
    - A "word" is any continual sequence of letters, plus ' and -
    - Spaces, punctuation, numbers, and special characters are NOT counted

    Formula: credits_used = (estimated_tokens / 100) * base_model_rate
    Where:
        - estimated_tokens = word_char_count / 4 (1 token ≈ 4 characters)
        - base_model_rate = 40
        - Minimum 1.00 credit always applies
        - Result rounded to 2 decimal places
    """
    word_chars = extract_word_characters(text)

    return calculate_message_credits(word_chars)


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
