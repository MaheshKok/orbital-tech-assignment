"""
Application constants for Orbital Usage API.
"""


class ConfigFile:
    """Configuration file paths."""
    PRODUCTION = "production.toml"
    DEVELOPMENT = "development.toml"
    TEST = "test.toml"


# Credit calculation constants from PLANNING_1.md
BASE_MODEL_RATE = 40
MINIMUM_CREDITS = 1.00
CHARACTERS_PER_TOKEN = 4

# External API
ORBITAL_API_BASE_URL = "https://owpublic.blob.core.windows.net/tech-task"
