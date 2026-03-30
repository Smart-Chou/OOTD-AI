"""Tests for API authentication endpoints."""
import pytest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch, MagicMock

from app.models.models import User, RefreshToken


class TestAuthEndpoints:
    """Test authentication API endpoints."""

    def test_register_success(self, test_db):
        """Test successful user registration."""
        from app.api.auth import register
        from app.schemas.schemas import UserCreate

        user_data = UserCreate(
            email="newuser@example.com",
            username="newuser",
            password="SecurePassword123!",
            full_name="New User"
        )

        result = register(user_data, test_db)

        assert result.email == "newuser@example.com"
        assert result.username == "newuser"
        assert result.full_name == "New User"

    def test_register_duplicate_email(self, test_db, test_user):
        """Test registration with duplicate email fails."""
        from app.api.auth import register
        from app.schemas.schemas import UserCreate
        from fastapi import HTTPException

        user_data = UserCreate(
            email="test@example.com",  # Already exists
            username="differentuser",
            password="SecurePassword123!",
        )

        with pytest.raises(HTTPException) as exc_info:
            register(user_data, test_db)
        assert exc_info.value.status_code == 400
        assert "Email already registered" in exc_info.value.detail

    def test_register_duplicate_username(self, test_db, test_user):
        """Test registration with duplicate username fails."""
        from app.api.auth import register
        from app.schemas.schemas import UserCreate
        from fastapi import HTTPException

        user_data = UserCreate(
            email="different@example.com",
            username="testuser",  # Already exists
            password="SecurePassword123!",
        )

        with pytest.raises(HTTPException) as exc_info:
            register(user_data, test_db)
        assert exc_info.value.status_code == 400
        assert "Username already taken" in exc_info.value.detail


class TestRefreshTokenFunctionality:
    """Test refresh token functionality."""

    def test_create_refresh_token(self, test_db, test_user):
        """Test refresh token creation."""
        from app.api.auth import _create_refresh_token

        token = _create_refresh_token(test_db, test_user.id)

        assert token is not None
        assert len(token) > 50  # Should be 64 chars

        # Verify stored in database
        stored_token = test_db.query(RefreshToken).filter(
            RefreshToken.token == token
        ).first()
        assert stored_token is not None
        assert stored_token.user_id == test_user.id

    def test_verify_refresh_token_valid(self, test_db, test_user):
        """Test verification of valid refresh token."""
        from app.api.auth import _create_refresh_token, _verify_refresh_token

        token = _create_refresh_token(test_db, test_user.id)
        result = _verify_refresh_token(test_db, token)

        assert result is not None
        assert result.user_id == test_user.id

    def test_verify_refresh_token_expired(self, test_db, test_user):
        """Test verification of expired refresh token."""
        from app.api.auth import _verify_refresh_token

        # Create an expired token
        expired_token = RefreshToken(
            user_id=test_user.id,
            token="expired_token_123",
            expires_at=datetime.now(timezone.utc) - timedelta(hours=1),
        )
        test_db.add(expired_token)
        test_db.commit()

        result = _verify_refresh_token(test_db, "expired_token_123")
        assert result is None

    def test_verify_refresh_token_revoked(self, test_db, test_user):
        """Test verification of revoked refresh token."""
        from app.api.auth import _create_refresh_token, _verify_refresh_token

        token = _create_refresh_token(test_db, test_user.id)
        stored_token = test_db.query(RefreshToken).filter(
            RefreshToken.token == token
        ).first()
        stored_token.is_revoked = 1
        test_db.commit()

        result = _verify_refresh_token(test_db, token)
        assert result is None

    def test_revoke_refresh_token(self, test_db, test_user):
        """Test refresh token revocation."""
        from app.api.auth import _create_refresh_token, _revoke_refresh_token

        token = _create_refresh_token(test_db, test_user.id)
        result = _revoke_refresh_token(test_db, token)

        assert result is True

        stored_token = test_db.query(RefreshToken).filter(
            RefreshToken.token == token
        ).first()
        assert stored_token.is_revoked == 1