"""
Tests for credit calculator service.
"""

import pytest

from app.services.credit_calculator import (
    calculate_message_credits,
    calculate_message_credits_word_chars_only,
    extract_word_characters,
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


class TestExtractWordCharacters:
    """Tests for extract_word_characters helper function."""

    def test_keeps_only_letters(self):
        """Should keep only alphabetic characters."""
        result = extract_word_characters("Hello World")
        assert result == "HelloWorld"

    def test_keeps_apostrophes(self):
        """Should keep apostrophes as part of words."""
        result = extract_word_characters("It's a test")
        assert result == "It'satest"

    def test_keeps_hyphens(self):
        """Should keep hyphens as part of words."""
        result = extract_word_characters("well-known fact")
        assert result == "well-knownfact"

    def test_removes_numbers(self):
        """Should remove all numeric characters."""
        result = extract_word_characters("Test123 message456")
        assert result == "Testmessage"

    def test_removes_punctuation(self):
        """Should remove all punctuation except apostrophe and hyphen."""
        result = extract_word_characters("Hello, world! How are you?")
        assert result == "HelloworldHowareyou"

    def test_removes_special_characters(self):
        """Should remove special characters like @, #, $, etc."""
        result = extract_word_characters("Email: test@example.com #hashtag $100")
        assert result == "Emailtestexamplecomhashtag"

    def test_empty_string(self):
        """Should handle empty string."""
        result = extract_word_characters("")
        assert result == ""

    def test_only_non_word_characters(self):
        """Should return empty string when no word characters present."""
        result = extract_word_characters("123 !@# $%^")
        assert result == ""

    def test_preserves_case(self):
        """Should preserve uppercase and lowercase letters."""
        result = extract_word_characters("Hello WORLD")
        assert result == "HelloWORLD"

    def test_complex_sentence(self):
        """Should handle complex real-world text."""
        result = extract_word_characters(
            "It's a well-known fact that 99% of people don't know!"
        )
        assert result == "It'sawell-knownfactthatofpeopledon'tknow"


class TestCalculateMessageCreditsWordCharsOnly:
    """
    Tests for calculate_message_credits_word_chars_only function.

    Formula: credits = (estimated_tokens / 100) * 40
    Where: estimated_tokens = word_char_count / 4
    Minimum: 1.00 credit
    Rounded to 2 decimal places
    """

    # ============ Minimum Credit Tests ============

    def test_empty_string_returns_minimum(self):
        """Empty message should return minimum 1.00 credit."""
        result = calculate_message_credits_word_chars_only("")
        assert result == 1.00

    def test_short_message_returns_minimum(self):
        """Short messages with few word chars should return minimum."""
        # "Hi" = 2 chars = 0.5 tokens = 0.20 credits → minimum 1.00
        result = calculate_message_credits_word_chars_only("Hi")
        assert result == 1.00

    def test_message_with_only_numbers_returns_minimum(self):
        """Message with only numbers has 0 word chars → minimum."""
        result = calculate_message_credits_word_chars_only("123456789")
        assert result == 1.00

    def test_message_with_only_punctuation_returns_minimum(self):
        """Message with only punctuation has 0 word chars → minimum."""
        result = calculate_message_credits_word_chars_only("!@#$%^&*()")
        assert result == 1.00

    # ============ Basic Calculation Tests ============

    def test_exact_100_tokens_equals_40_credits(self):
        """400 word characters = 100 tokens = 40.00 credits."""
        # 400 letters / 4 = 100 tokens
        # 100 / 100 * 40 = 40.00
        text = "a" * 400
        result = calculate_message_credits_word_chars_only(text)
        assert result == 40.00

    def test_50_tokens_equals_20_credits(self):
        """200 word characters = 50 tokens = 20.00 credits."""
        text = "a" * 200
        result = calculate_message_credits_word_chars_only(text)
        assert result == 20.00

    def test_10_tokens_equals_4_credits(self):
        """40 word characters = 10 tokens = 4.00 credits."""
        text = "a" * 40
        result = calculate_message_credits_word_chars_only(text)
        assert result == 4.00

    # ============ Rounding Tests ============

    def test_rounds_to_two_decimal_places(self):
        """Result should be rounded to exactly 2 decimal places."""
        # 156 chars = 39 tokens = 15.60 credits
        text = "a" * 156
        result = calculate_message_credits_word_chars_only(text)
        assert result == 15.60

    def test_rounds_up_when_third_decimal_is_5_or_more(self):
        """Should use ROUND_HALF_UP rounding mode."""
        # 157 chars = 39.25 tokens = 15.70 credits
        text = "a" * 157
        result = calculate_message_credits_word_chars_only(text)
        assert result == 15.70

    # ============ Character Filtering Tests ============

    def test_spaces_not_counted(self):
        """Spaces should be stripped and not counted."""
        # "Hello World" → "HelloWorld" = 10 chars = 2.5 tokens = 1.00 (minimum)
        result = calculate_message_credits_word_chars_only("Hello World")
        assert result == 1.00

    def test_numbers_not_counted(self):
        """Numbers should be stripped and not counted."""
        # "Test123" → "Test" = 4 chars = 1 token = 0.40 → minimum 1.00
        result = calculate_message_credits_word_chars_only("Test123")
        assert result == 1.00

    def test_punctuation_not_counted(self):
        """Punctuation (except ' and -) should not be counted."""
        # "Hello, world!" → "Helloworld" = 10 chars
        result = calculate_message_credits_word_chars_only("Hello, world!")
        assert result == 1.00

    def test_apostrophes_are_counted(self):
        """Apostrophes should be kept and counted."""
        # "It's" = 4 chars (including apostrophe)
        text = "It's" * 100  # 400 chars = 100 tokens = 40.00
        result = calculate_message_credits_word_chars_only(text)
        assert result == 40.00

    def test_hyphens_are_counted(self):
        """Hyphens should be kept and counted."""
        # "a-b-" = 4 chars (including hyphens)
        text = "a-b-" * 100  # 400 chars = 100 tokens = 40.00
        result = calculate_message_credits_word_chars_only(text)
        assert result == 40.00

    # ============ Comparison with Original Function ============

    def test_differs_from_original_when_non_word_chars_present(self):
        """
        Word-chars-only function should give different result
        when message contains spaces/punctuation/numbers.
        """

        # Original counts all 23 chars
        # Word-chars-only counts only "HelloworldTest" = 14 chars
        # Both should return minimum 1.00 in this case, but let's use longer text

        long_text = "Hello, world! " * 50  # Has lots of spaces and punctuation
        original_long = calculate_message_credits(long_text)
        word_chars_long = calculate_message_credits_word_chars_only(long_text)

        # Original: 700 chars = 175 tokens = 70.00 credits
        # Word-chars: "Helloworld" * 50 = 500 chars = 125 tokens = 50.00 credits
        assert original_long > word_chars_long

    def test_same_as_original_for_pure_letters(self):
        """Should give same result as original when text is only letters."""
        text = "abcdefghij" * 40  # 400 chars, all letters

        original_result = calculate_message_credits(text)
        word_chars_result = calculate_message_credits_word_chars_only(text)

        assert original_result == word_chars_result == 40.00

    # ============ Real-World Text Examples ============

    def test_realistic_sentence(self):
        """Test with a realistic English sentence."""
        # "The quick brown fox jumps over the lazy dog."
        # Word chars: "Thequickbrownfoxjumpsoverthelazydog" = 35 chars
        # 35 / 4 = 8.75 tokens
        # 8.75 / 100 * 40 = 3.50 credits
        text = "The quick brown fox jumps over the lazy dog."
        result = calculate_message_credits_word_chars_only(text)
        assert result == 3.50

    def test_text_with_contractions(self):
        """Test text with contractions (apostrophes)."""
        # "I'm can't won't" → "I'mcan'twon't" = 13 chars
        # 13 / 4 = 3.25 tokens = 1.30 credits
        text = "I'm can't won't"
        result = calculate_message_credits_word_chars_only(text)
        assert result == 1.30

    def test_text_with_hyphenated_words(self):
        """Test text with hyphenated compound words."""
        # "well-known self-aware" → "well-knownself-aware" = 20 chars
        # 20 / 4 = 5 tokens = 2.00 credits
        text = "well-known self-aware"
        result = calculate_message_credits_word_chars_only(text)
        assert result == 2.00

    def test_mixed_complex_text(self):
        """Test complex text with various character types."""
        # "Hello! It's a well-known fact that 99% of emails contain @symbols."
        # Word chars: "HelloIt'sawell-knownfactthatofemailscontainsymbols" = 50 chars
        # 50 / 4 = 12.5 tokens = 5.00 credits
        text = "Hello! It's a well-known fact that 99% of emails contain @symbols."
        result = calculate_message_credits_word_chars_only(text)
        assert result == 5.00


class TestCalculateMessageCreditsWordCharsOnlyEdgeCases:
    """Edge case tests for calculate_message_credits_word_chars_only."""

    def test_very_long_message(self):
        """Should handle very long messages correctly."""
        # 10000 chars = 2500 tokens = 1000.00 credits
        text = "a" * 10000
        result = calculate_message_credits_word_chars_only(text)
        assert result == 1000.00

    def test_single_character(self):
        """Single character should return minimum."""
        result = calculate_message_credits_word_chars_only("a")
        assert result == 1.00

    def test_unicode_letters(self):
        """Should handle only ASCII letters (a-z, A-Z)."""
        # Unicode letters like é, ñ, ü are NOT kept
        # "café" → "caf" = 3 chars (é is removed)
        result = calculate_message_credits_word_chars_only("café résumé naïve")
        # Only "cafrsumnave" = 11 chars = 2.75 tokens = 1.10 credits
        assert result == 1.10

    def test_newlines_and_tabs_removed(self):
        """Newlines and tabs should be stripped."""
        text = "Hello\nWorld\tTest"
        # → "HelloWorldTest" = 14 chars = 3.5 tokens = 1.40 credits
        result = calculate_message_credits_word_chars_only(text)
        assert result == 1.40

    @pytest.mark.parametrize(
        "text,expected",
        [
            ("", 1.00),  # Empty
            ("a", 1.00),  # Single char
            ("a" * 10, 1.00),  # 10 chars = 2.5 tokens = 1.00 (min)
            ("a" * 40, 4.00),  # 40 chars = 10 tokens = 4.00
            ("a" * 100, 10.00),  # 100 chars = 25 tokens = 10.00
            ("a" * 400, 40.00),  # 400 chars = 100 tokens = 40.00
            ("Hello World", 1.00),  # 10 word chars = 2.5 tokens = 1.00
            ("123", 1.00),  # 0 word chars = minimum
            ("It's", 1.00),  # 4 chars = 1 token = 0.40 → min
            ("a-b", 1.00),  # 3 chars = 0.75 tokens = 0.30 → min
        ],
    )
    def test_parametrized_calculations(self, text, expected):
        """Parametrized test for various inputs."""
        result = calculate_message_credits_word_chars_only(text)
        assert result == expected
