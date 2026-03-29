import os
from pathlib import Path

# 提前加载 .env 文件
from dotenv import load_dotenv
env_path = Path(__file__).parent.parent / '.env'
if env_path.exists():
    load_dotenv(env_path)
    print(f"Loaded env from: {env_path}")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, get_engine
from app.api import api_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI辅助穿搭Web应用API"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup."""
    engine = get_engine()
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Welcome to OOTD AI API", "version": settings.APP_VERSION}


@app.get("/health")
def health_check():
    return {"status": "healthy"}