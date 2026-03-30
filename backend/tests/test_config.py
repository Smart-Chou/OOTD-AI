"""Tests for configuration module."""
import pytest
import os
from unittest.mock import patch


class TestSettings:
    """Test configuration settings."""

    def test_default_values(self):
        """Test default configuration values."""
        from app.core.config import Settings

        settings = Settings(_env_file=".env", DEBUG=True)

        assert settings.APP_NAME == "OOTD AI"
        assert settings.APP_VERSION == "1.0.0"
        assert settings.JWT_ALGORITHM == "HS256"
        # ACCESS_TOKEN_EXPIRE_MINUTES might vary, just check it exists
        assert settings.ACCESS_TOKEN_EXPIRE_MINUTES > 0

    def test_jwt_secret_dev_mode(self):
        """Test JWT secret key in development mode."""
        from app.core.config import Settings

        settings = Settings(_env_file=".env", DEBUG=True)

        # In dev mode, should return dev key even if not set
        key = settings.jwt_secret_key
        assert key == "dev-only-secret-key-change-in-production"

    def test_jwt_secret_production_requires_key(self):
        """Test that production mode requires JWT secret."""
        from app.core.config import Settings

        settings = Settings(_env_file=".env", DEBUG=False)

        with pytest.raises(ValueError) as exc_info:
            _ = settings.jwt_secret_key

        assert "JWT_SECRET_KEY must be set in production" in str(exc_info.value)

    def test_jwt_secret_production_minimum_length(self):
        """Test that JWT secret meets minimum length in production."""
        from app.core.config import Settings

        settings = Settings(_env_file=".env", DEBUG=False, JWT_SECRET_KEY="short")

        with pytest.raises(ValueError) as exc_info:
            _ = settings.jwt_secret_key

        assert "at least 32 characters" in str(exc_info.value)

    def test_cors_origins_parsing(self):
        """Test CORS origins parsing."""
        from app.core.config import Settings

        settings = Settings(
            _env_file=".env",
            CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
        )

        origins = settings.cors_origins_list
        assert len(origins) == 2
        assert "http://localhost:3000" in origins
        assert "http://localhost:5173" in origins

    def test_minio_credentials_check(self):
        """Test MinIO credentials validation."""
        from app.core.config import Settings

        # Test with empty credentials
        settings = Settings(_env_file=".env", MINIO_ROOT_USER="", MINIO_ROOT_PASSWORD="")
        assert settings.minio_credentials_set is False

        # Test with set credentials
        settings.MINIO_ROOT_USER = "admin"
        settings.MINIO_ROOT_PASSWORD = "password"
        assert settings.minio_credentials_set is True