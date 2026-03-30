import os
from pathlib import Path

# 提前加载 .env 文件
from dotenv import load_dotenv
env_path = Path(__file__).parent.parent / '.env'
if env_path.exists():
    load_dotenv(env_path)
    print(f"Loaded env from: {env_path}")

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import Base, get_engine
from app.api import api_router

# Rate Limiter setup
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI辅助穿搭Web应用API"
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 启动时验证配置
@app.on_event("startup")
async def startup_event():
    """Initialize database tables and validate configuration on startup."""
    # 验证 JWT 密钥 (会在 config 中自动检查)
    if not settings.DEBUG:
        key = settings.jwt_secret_key
        print(f"[SECURITY] Production mode detected. Using secure JWT key (length: {len(key)})")

    # 初始化数据库
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    print("[DATABASE] Tables initialized successfully")


# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
@limiter.limit("30/minute")
def root(request: Request):
    return {"message": "Welcome to OOTD AI API", "version": settings.APP_VERSION}


@app.get("/health")
@limiter.limit("60/minute")
def health_check(request: Request):
    return {"status": "healthy"}