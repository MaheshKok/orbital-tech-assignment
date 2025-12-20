"""
Configuration management for Orbital Usage API.

Loads configuration from TOML files based on environment,
allows environment variable overrides, and configures logging.
"""

import logging
import os
import sys
from pathlib import Path
from typing import Any

import tomli

from app.utils.constants import ConfigFile


class Config:
    """
    Configuration manager that loads settings from TOML files
    and allows environment variable overrides.
    """

    def __init__(self, config_file: str | None = None):
        """
        Initialize configuration.

        Args:
            config_file: Configuration file name (e.g., "development.toml").
                         Defaults to APP_ENV environment variable mapping or 'development.toml'.
        """
        if config_file is None:
            env = os.getenv("APP_ENV", "development")
            config_map = {
                "production": ConfigFile.PRODUCTION,
                "development": ConfigFile.DEVELOPMENT,
                "test": ConfigFile.TEST,
            }
            config_file = config_map.get(env, ConfigFile.DEVELOPMENT)

        self.config_file = config_file
        self.config: dict[str, Any] = {}
        self._load_config()
        self._configure_logging()

    def _load_config(self) -> None:
        """Load configuration from TOML file."""
        config_path = Path(__file__).parent.parent / "cfg" / self.config_file

        if not config_path.exists():
            raise FileNotFoundError(
                f"Configuration file not found: {config_path}\n"
                f"Config file: {self.config_file}"
            )

        try:
            with open(config_path, "rb") as f:
                self.config = tomli.load(f)
        except tomli.TOMLDecodeError as e:
            raise ValueError(f"Invalid TOML in {config_path}: {e}") from e

        # Apply environment variable overrides
        self._apply_env_overrides()

    def _apply_env_overrides(self) -> None:
        """Apply environment variable overrides to configuration."""
        # Server configuration overrides
        if host := os.getenv("SERVER_HOST"):
            self.config.setdefault("server", {})["host"] = host

        if port := os.getenv("SERVER_PORT"):
            self.config.setdefault("server", {})["port"] = int(port)

        # Database configuration overrides (full URL takes precedence)
        if db_url := os.getenv("DATABASE_URL"):
            self.config.setdefault("database", {})["url"] = db_url

        # Individual database component overrides (for Docker flexibility)
        if db_host := os.getenv("DATABASE_HOST"):
            self.config.setdefault("db", {})["host"] = db_host

        if db_port := os.getenv("DATABASE_PORT"):
            self.config.setdefault("db", {})["port"] = db_port

        if db_name := os.getenv("DATABASE_NAME"):
            self.config.setdefault("db", {})["database"] = db_name

        if db_user := os.getenv("DATABASE_USER"):
            self.config.setdefault("db", {})["username"] = db_user

        if db_password := os.getenv("DATABASE_PASSWORD"):
            self.config.setdefault("db", {})["password"] = db_password

        # Logging configuration overrides
        if log_level := os.getenv("LOG_LEVEL"):
            self.config.setdefault("logging", {})["level"] = log_level

        if log_format := os.getenv("LOG_FORMAT"):
            self.config.setdefault("logging", {})["format"] = log_format

        # API configuration overrides
        if api_timeout := os.getenv("API_TIMEOUT"):
            self.config.setdefault("api", {})["timeout"] = int(api_timeout)

    def _configure_logging(self) -> None:
        """Configure logging based on configuration settings."""
        logging_config = self.config.get("logging", {})
        log_level = logging_config.get("level", "INFO")
        log_format = logging_config.get(
            "format",
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

        # Convert string log level to logging constant
        numeric_level = getattr(logging, log_level.upper(), logging.INFO)

        # Configure root logger
        logging.basicConfig(
            level=numeric_level,
            format=log_format,
            handlers=[
                logging.StreamHandler(sys.stdout)
            ]
        )

        # Set specific logger levels if configured
        loggers_config = logging_config.get("loggers", {})
        for logger_name, logger_level in loggers_config.items():
            logger = logging.getLogger(logger_name)
            logger.setLevel(getattr(logging, logger_level.upper(), logging.INFO))

    def get(self, key: str, default: Any = None) -> Any:
        """
        Get configuration value by key using dot notation.

        Args:
            key: Configuration key (supports dot notation, e.g., 'server.host')
            default: Default value if key is not found

        Returns:
            Configuration value or default
        """
        keys = key.split(".")
        value = self.config

        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
                if value is None:
                    return default
            else:
                return default

        return value

    def __getitem__(self, key: str) -> Any:
        """
        Get configuration value using dictionary-style access.

        Args:
            key: Configuration key

        Returns:
            Configuration value

        Raises:
            KeyError: If key is not found
        """
        value = self.get(key)
        if value is None:
            raise KeyError(f"Configuration key not found: {key}")
        return value

    @property
    def server_host(self) -> str:
        """Get server host."""
        return self.get("server.host", "0.0.0.0")

    @property
    def server_port(self) -> int:
        """Get server port."""
        return self.get("server.port", 8000)

    @property
    def database_url(self) -> str:
        """Get database URL."""
        return self.get("database.url", "sqlite:///./orbital.db")

    @property
    def api_timeout(self) -> int:
        """Get API timeout in seconds."""
        return self.get("api.timeout", 30)

    @property
    def debug(self) -> bool:
        """Check if debug mode is enabled."""
        return self.get("debug", False)


# Global configuration instance
_config: Config | None = None


def get_config(config_file: str | None = None) -> Config:
    """
    Get or create global configuration instance.

    Args:
        config_file: Configuration file name (only used on first call)

    Returns:
        Configuration instance
    """
    global _config
    if _config is None:
        _config = Config(config_file)
    return _config


def reset_config() -> None:
    """Reset global configuration instance (useful for testing)."""
    global _config
    _config = None
