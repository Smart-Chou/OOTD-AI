"""
Pytest configuration and fixtures for backend tests.
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base
from app.models.models import User, BodyData, ClothingItem, Outfit, RefreshToken


@pytest.fixture(scope="function")
def test_db():
    """Create a test database session."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def test_user(test_db):
    """Create a test user."""
    from app.core.security import get_password_hash

    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("testpassword123"),
        full_name="Test User",
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture
def test_body_data(test_db, test_user):
    """Create test body data."""
    body_data = BodyData(
        user_id=test_user.id,
        height=175.0,
        weight=70.0,
        age=25,
        gender="male",
        chest=95.0,
        waist=80.0,
        hips=95.0,
        shoulder_width=45.0,
        preferred_style="casual",
    )
    test_db.add(body_data)
    test_db.commit()
    test_db.refresh(body_data)
    return body_data