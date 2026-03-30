from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # App
    APP_NAME: str = "OOTD AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./ootd.db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "fashion_db"
    POSTGRES_USER: str = "fashion_user"
    POSTGRES_PASSWORD: str = "fashion_password"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT
    JWT_SECRET_KEY: str = ""  # Must be set via environment variable
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15  # SDD要求15分钟

    # MinIO
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ROOT_USER: str = "minioadmin"
    MINIO_ROOT_PASSWORD: str = "minioadmin"
    MINIO_BUCKET: str = "ootd-images"

    # MiniMax AI
    MINIMAX_API_KEY: str = ""
    MINIMAX_GROUP_ID: str = ""

    # AI Services (legacy)
    GOOGLE_CLOUD_API_KEY: str = ""
    STABILITY_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp", "image/gif"]

    # API
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def jwt_secret_key(self) -> str:
        """Get JWT secret key, ensure it's set in production."""
        key = self.JWT_SECRET_KEY or os.environ.get("JWT_SECRET_KEY", "")

        # 生产环境必须设置有效的密钥
        if not self.DEBUG:
            if not key or key in ["", "your-secret-key-change-in-production", "dev-only-secret-key-change-in-production"]:
                raise ValueError(
                    "JWT_SECRET_KEY must be set in production! "
                    "Please set a strong, unique secret key in your environment variables."
                )
            # 验证密钥长度
            if len(key) < 32:
                raise ValueError("JWT_SECRET_KEY must be at least 32 characters long in production!")
            return key

        # 开发环境警告
        if not key or key == "your-secret-key-change-in-production":
            return "dev-only-secret-key-change-in-production"

        return key

    @property
    def minio_credentials_set(self) -> bool:
        return bool(self.MINIO_ROOT_USER and self.MINIO_ROOT_PASSWORD)

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
