"""Tests for wardrobe/clothing API endpoints."""
import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime, timezone

from app.models.models import ClothingItem, ClothingCategory


class TestClothingModel:
    """Test ClothingItem model."""

    def test_clothing_item_creation(self, test_db, test_user):
        """Test clothing item can be created."""
        item = ClothingItem(
            user_id=test_user.id,
            name="Blue T-Shirt",
            category=ClothingCategory.TOPS,
            color="blue",
            brand="Nike",
            size="M",
        )
        test_db.add(item)
        test_db.commit()
        test_db.refresh(item)

        assert item.id is not None
        assert item.name == "Blue T-Shirt"
        assert item.category == ClothingCategory.TOPS
        assert item.color == "blue"
        assert item.is_favorite == 0

    def test_clothing_item_with_image(self, test_db, test_user):
        """Test clothing item with image URL."""
        item = ClothingItem(
            user_id=test_user.id,
            name="Winter Jacket",
            category=ClothingCategory.OUTERWEAR,
            color="black",
            image_url="https://example.com/jacket.jpg",
            thumbnail_url="https://example.com/jacket_thumb.jpg",
        )
        test_db.add(item)
        test_db.commit()
        test_db.refresh(item)

        assert item.image_url == "https://example.com/jacket.jpg"
        assert item.thumbnail_url == "https://example.com/jacket_thumb.jpg"

    def test_clothing_item_all_categories(self, test_db, test_user):
        """Test all clothing categories can be assigned."""
        categories = [
            ("T-Shirt", ClothingCategory.TOPS),
            ("Jeans", ClothingCategory.BOTTOMS),
            ("Summer Dress", ClothingCategory.DRESSES),
            ("Winter Coat", ClothingCategory.OUTERWEAR),
            ("Running Shoes", ClothingCategory.SHOES),
            ("Watch", ClothingCategory.ACCESSORIES),
        ]

        for name, category in categories:
            item = ClothingItem(
                user_id=test_user.id,
                name=name,
                category=category,
            )
            test_db.add(item)

        test_db.commit()

        items = test_db.query(ClothingItem).filter(
            ClothingItem.user_id == test_user.id
        ).all()

        assert len(items) == 6
        categories_found = {item.category for item in items}
        assert categories_found == set(ClothingCategory)


class TestClothingAPI:
    """Test clothing API endpoints."""

    @pytest.fixture
    def clothing_item(self, test_db, test_user):
        """Create a test clothing item."""
        item = ClothingItem(
            user_id=test_user.id,
            name="Test Shirt",
            category=ClothingCategory.TOPS,
            color="white",
            size="L",
            brand="Test Brand",
        )
        test_db.add(item)
        test_db.commit()
        test_db.refresh(item)
        return item

    def test_get_user_clothing_list(self, test_db, test_user, clothing_item):
        """Test getting user's clothing list."""
        from app.api.clothing import get_clothing_list

        # Mock the db query
        result = get_clothing_list(test_db, test_user.id)

        assert len(result) == 1
        assert result[0].name == "Test Shirt"

    def test_get_clothing_by_id(self, test_db, test_user, clothing_item):
        """Test getting a single clothing item."""
        from app.api.clothing import get_clothing

        result = get_clothing(clothing_item.id, test_db, test_user.id)

        assert result is not None
        assert result.name == "Test Shirt"

    def test_get_clothing_not_found(self, test_db, test_user):
        """Test getting non-existent clothing returns None."""
        from app.api.clothing import get_clothing

        result = get_clothing(99999, test_db, test_user.id)

        assert result is None

    def test_create_clothing_item(self, test_db, test_user):
        """Test creating a new clothing item."""
        from app.schemas.schemas import ClothingCreate

        clothing_data = ClothingCreate(
            name="New Pants",
            category="bottoms",
            color="black",
            size="32",
            brand="Levi's",
            season="fall",
        )

        from app.api.clothing import create_clothing
        result = create_clothing(clothing_data, test_db, test_user.id)

        assert result.name == "New Pants"
        assert result.category.value == "bottoms"

    def test_update_clothing_item(self, test_db, test_user, clothing_item):
        """Test updating a clothing item."""
        from app.schemas.schemas import ClothingUpdate
        from app.api.clothing import update_clothing

        update_data = ClothingUpdate(
            name="Updated Shirt",
            is_favorite=1,
        )

        result = update_clothing(clothing_item.id, update_data, test_db, test_user.id)

        assert result.name == "Updated Shirt"
        assert result.is_favorite == 1

    def test_delete_clothing_item(self, test_db, test_user, clothing_item):
        """Test deleting a clothing item."""
        from app.api.clothing import delete_clothing

        result = delete_clothing(clothing_item.id, test_db, test_user.id)

        assert result is True

        # Verify it's deleted
        deleted_item = test_db.query(ClothingItem).filter(
            ClothingItem.id == clothing_item.id
        ).first()
        assert deleted_item is None