"""
Rate limiting middleware for API endpoints.
"""
from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings


def get_limiter() -> Limiter:
    """Get configured rate limiter."""
    return Limiter(key_func=get_remote_address)


def get_user_identifier(request: Request) -> str:
    """
    Get user identifier for rate limiting.
    Uses user ID if authenticated, otherwise uses IP address.
    """
    # Try to get user from request state (set by auth middleware)
    if hasattr(request.state, 'user_id'):
        return f"user_{request.state.user_id}"

    # Fall back to IP address
    return get_remote_address(request)


# Rate limit configurations
RATE_LIMITS = {
    # Authentication endpoints - strict limits
    "auth_login": "5/minute",
    "auth_register": "3/minute",
    "auth_refresh": "10/minute",

    # General API endpoints
    "default": "100/minute",

    # Read operations - more lenient
    "read": "200/minute",

    # Write operations - moderate limits
    "write": "30/minute",

    # Heavy operations (AI generation, etc.)
    "heavy": "5/minute",

    # File uploads
    "upload": "10/minute",
}


def get_rate_limit_key(endpoint_type: str, user_id: int = None) -> str:
    """
    Get rate limit string for an endpoint type.

    Args:
        endpoint_type: Type of endpoint (from RATE_LIMITS keys)
        user_id: Optional user ID for user-specific limiting

    Returns:
        Rate limit string (e.g., "100/minute")
    """
    limit = RATE_LIMITS.get(endpoint_type, RATE_LIMITS["default"])

    # For user-specific limiting, we include user ID in the key
    # The actual limiting is handled per-endpoint with @limiter.limit()
    return limit


# Per-endpoint rate limits
AUTH_RATE_LIMIT = "5/minute"
API_RATE_LIMIT = "100/minute"
UPLOAD_RATE_LIMIT = "10/minute"
AI_GENERATION_RATE_LIMIT = "5/minute"
DEFAULT_RATE_LIMIT = "30/minute"