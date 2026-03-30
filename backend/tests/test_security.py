"""Tests for security utilities."""
import pytest
from app.core.security import get_password_hash, verify_password, validate_password_strength


class TestPasswordHashing:
    """Test password hashing functionality."""

    def test_hash_password_returns_hash(self):
        """Test that get_password_hash returns a hash."""
        password = "SecurePassword123!"
        hashed = get_password_hash(password)

        assert hashed is not None
        assert hashed != password
        assert len(hashed) > 0

    def test_verify_password_correct(self):
        """Test that verify_password returns True for correct password."""
        password = "SecurePassword123!"
        hashed = get_password_hash(password)

        assert verify_password(password, hashed) is True

    def test_verify_password_incorrect(self):
        """Test that verify_password returns False for incorrect password."""
        password = "SecurePassword123!"
        wrong_password = "WrongPassword456!"
        hashed = get_password_hash(password)

        assert verify_password(wrong_password, hashed) is False

    def test_different_passwords_different_hashes(self):
        """Test that different passwords produce different hashes."""
        password1 = "PasswordOne!"
        password2 = "PasswordTwo!"

        hash1 = get_password_hash(password1)
        hash2 = get_password_hash(password2)

        assert hash1 != hash2

    def test_same_password_different_hashes(self):
        """Test that hashing same password twice produces different hashes (due to salt)."""
        password = "SamePassword123!"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)

        # Hashes should be different due to unique salt
        assert hash1 != hash2
        # But both should verify correctly
        assert verify_password(password, hash1) is True
        assert verify_password(password, hash2) is True


class TestPasswordValidation:
    """Test password strength validation."""

    def test_valid_password(self):
        """Test that strong passwords pass validation."""
        is_valid, error = validate_password_strength("SecurePass123!")
        assert is_valid is True
        assert error == ""

    def test_password_too_short(self):
        """Test that short passwords fail validation."""
        is_valid, error = validate_password_strength("Ab1!")
        assert is_valid is False
        assert "长度至少8个字符" in error

    def test_password_no_uppercase(self):
        """Test that passwords without uppercase fail validation."""
        is_valid, error = validate_password_strength("securepass123!")
        assert is_valid is False
        assert "大写字母" in error

    def test_password_no_lowercase(self):
        """Test that passwords without lowercase fail validation."""
        is_valid, error = validate_password_strength("SECUREPASS123!")
        assert is_valid is False
        assert "小写字母" in error

    def test_password_no_digit(self):
        """Test that passwords without digits fail validation."""
        is_valid, error = validate_password_strength("SecurePassword!")
        assert is_valid is False
        assert "数字" in error

    def test_password_no_special_char(self):
        """Test that passwords without special chars fail validation."""
        is_valid, error = validate_password_strength("SecurePass123")
        assert is_valid is False
        assert "特殊字符" in error