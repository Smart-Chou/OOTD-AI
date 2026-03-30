import bcrypt
import re


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password strength.
    Returns (is_valid, error_message)
    """
    errors = []

    # Minimum length check
    if len(password) < 8:
        errors.append("密码长度至少8个字符")

    # Uppercase letter check
    if not re.search(r'[A-Z]', password):
        errors.append("密码包含至少一个大写字母")

    # Lowercase letter check
    if not re.search(r'[a-z]', password):
        errors.append("密码包含至少一个小写字母")

    # Number check
    if not re.search(r'\d', password):
        errors.append("密码包含至少一个数字")

    # Special character check
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("密码包含至少一个特殊字符(!@#$%^&*等)")

    if errors:
        return False, "; ".join(errors)

    return True, ""


def hash_password_with_validation(password: str) -> str:
    """
    Hash password with strength validation.
    Raises ValueError if password doesn't meet requirements.
    """
    is_valid, error_msg = validate_password_strength(password)
    if not is_valid:
        raise ValueError(f"密码强度不足: {error_msg}")

    return get_password_hash(password)