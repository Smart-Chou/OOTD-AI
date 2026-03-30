"""Tests for auth models."""
import pytest
from datetime import datetime, timedelta, timezone

from app.models.models import User, RefreshToken


class TestUserModel:
    """Test User model."""

    def test_user_creation(self, test_db, test_user):
        """Test user can be created and retrieved."""
        assert test_user.id is not None
        assert test_user.email == "test@example.com"
        assert test_user.username == "testuser"
        assert test_user.full_name == "Test User"

    def test_user_unique_email(self, test_db, test_user):
        """Test that duplicate email raises error."""
        from sqlalchemy.exc import IntegrityError

        duplicate_user = User(
            email="test@example.com",
            username="anotheruser",
            hashed_password="hash",
        )
        test_db.add(duplicate_user)
        with pytest.raises(IntegrityError):
            test_db.commit()

    def test_user_unique_username(self, test_db, test_user):
        """Test that duplicate username raises error."""
        from sqlalchemy.exc import IntegrityError

        duplicate_user = User(
            email="another@example.com",
            username="testuser",
            hashed_password="hash",
        )
        test_db.add(duplicate_user)
        with pytest.raises(IntegrityError):
            test_db.commit()


class TestRefreshTokenModel:
    """Test RefreshToken model."""

    def test_refresh_token_creation(self, test_db, test_user):
        """Test refresh token can be created."""
        token = RefreshToken(
            user_id=test_user.id,
            token="test_token_123456789",
            expires_at=datetime.now(timezone.utc) + timedelta(days=12),
        )
        test_db.add(token)
        test_db.commit()
        test_db.refresh(token)

        assert token.id is not None
        assert token.user_id == test_user.id
        assert token.token == "test_token_123456789"
        assert token.is_revoked == 0

    def test_refresh_token_revoked_flag(self, test_db, test_user):
        """Test refresh token can be revoked."""
        token = RefreshToken(
            user_id=test_user.id,
            token="test_token_789",
            expires_at=datetime.now(timezone.utc) + timedelta(days=12),
        )
        test_db.add(token)
        test_db.commit()

        token.is_revoked = 1
        test_db.commit()
        test_db.refresh(token)

        assert token.is_revoked == 1