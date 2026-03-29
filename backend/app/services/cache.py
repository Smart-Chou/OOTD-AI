"""
Redis cache service for performance optimization.
"""
import json
from typing import Optional, Any
import redis.asyncio as redis
from app.core.config import settings


class RedisCache:
    def __init__(self):
        self._client: Optional[redis.Redis] = None

    async def get_client(self) -> redis.Redis:
        """Lazy initialization of Redis client."""
        if self._client is None:
            try:
                self._client = redis.from_url(
                    settings.REDIS_URL,
                    encoding="utf-8",
                    decode_responses=True
                )
            except Exception:
                # Fallback to no cache if Redis unavailable
                self._client = None
        return self._client

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        client = await self.get_client()
        if not client:
            return None
        try:
            value = await client.get(key)
            if value:
                return json.loads(value)
        except Exception:
            pass
        return None

    async def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        """Set value in cache with expiration in seconds."""
        client = await self.get_client()
        if not client:
            return False
        try:
            await client.setex(key, expire, json.dumps(value, default=str))
            return True
        except Exception:
            return False

    async def delete(self, key: str) -> bool:
        """Delete key from cache."""
        client = await self.get_client()
        if not client:
            return False
        try:
            await client.delete(key)
            return True
        except Exception:
            return False

    async def invalidate_pattern(self, pattern: str) -> bool:
        """Invalidate all keys matching pattern."""
        client = await self.get_client()
        if not client:
            return False
        try:
            keys = await client.keys(pattern)
            if keys:
                await client.delete(*keys)
            return True
        except Exception:
            return False


# Singleton instance
cache = RedisCache()