from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from typing import Generator

Base = declarative_base()
_session_factory = None


def get_engine():
    """Lazy initialization of database engine."""
    import os
    from pathlib import Path

    # Check environment variable first, then .env file
    db_url = os.environ.get('DATABASE_URL')

    if not db_url:
        # Try to load from .env file
        from dotenv import load_dotenv
        env_path = Path(__file__).parent.parent / '.env'
        if env_path.exists():
            load_dotenv(env_path)
        db_url = os.environ.get('DATABASE_URL')

    # Default to SQLite if nothing set
    if not db_url:
        db_url = 'sqlite:///./ootd.db'

    print(f"Using database: {db_url}")

    connect_args = {}
    if 'sqlite' in db_url:
        connect_args['check_same_thread'] = False

    return create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True
    )


def get_session_factory():
    """Get or create session factory."""
    global _session_factory
    if _session_factory is None:
        engine = get_engine()
        _session_factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return _session_factory


def get_db() -> Generator[Session, None, None]:
    """Get database session."""
    SessionLocal = get_session_factory()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()