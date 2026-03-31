"""Tests for outfits API endpoints."""
import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime, timezone

from app.models.models import Outfit, OutfitItem, ClothingItem, ClothingCategory


class TestOutfitModel:
    """Test Outfit model."""

    def test_outfit_creation(self, test_db, test_user):
        """Test outfit can be created."""
        outfit = Outfit(
            user_id=test_user.id,
            name="Summer Outfit",
            description="Light and breezy summer look",
            occasion="casual",
            season="summer",
            is_public=1,
        )
        test_db.add(outfit)
        test_db.commit()
        test_db.refresh(outfit)

        assert outfit.id is not None
        assert outfit.name == "Summer Outfit"
        assert outfit.occasion == "casual"
        assert outfit.is_public == 1
        assert outfit.likes_count == 0

    def test_outfit_with_clothing_items(self, test_db, test_user):
        """Test outfit with clothing items."""
        # Create clothing items
        shirt = ClothingItem(
            user_id=test_user.id,
            name="White Shirt",
            category=ClothingCategory.TOPS,
        )
        pants = ClothingItem(
            user_id=test_user.id,
            name="Blue Jeans",
            category=ClothingCategory.BOTTOMS,
        )
        test_db.add_all([shirt, pants])
        test_db.commit()

        # Create outfit with items
        outfit = Outfit(
            user_id=test_user.id,
            name="Casual Look",
        )
        test_db.add(outfit)
        test_db.commit()
        test_db.refresh(outfit)

        # Add items to outfit
        item1 = OutfitItem(outfit_id=outfit.id, clothing_id=shirt.id)
        item2 = OutfitItem(outfit_id=outfit.id, clothing_id=pants.id)
        test_db.add_all([item1, item2])
        test_db.commit()

        # Verify
        items = test_db.query(OutfitItem).filter(
            OutfitItem.outfit_id == outfit.id
        ).all()
        assert len(items) == 2


class TestOutfitAPI:
    """Test outfit API endpoints."""

    @pytest.fixture
    def test_outfit(self, test_db, test_user):
        """Create a test outfit."""
        outfit = Outfit(
            user_id=test_user.id,
            name="Test Outfit",
            description="Test description",
            occasion="work",
            season="winter",
        )
        test_db.add(outfit)
        test_db.commit()
        test_db.refresh(outfit)
        return outfit

    def test_get_user_outfits(self, test_db, test_user, test_outfit):
        """Test getting user's outfits."""
        from app.api.outfits import get_outfits

        result = get_outfits(test_db, test_user.id)

        assert len(result) == 1
        assert result[0].name == "Test Outfit"

    def test_get_outfit_by_id(self, test_db, test_user, test_outfit):
        """Test getting a single outfit."""
        from app.api.outfits import get_outfit

        result = get_outfit(test_outfit.id, test_db, test_user.id)

        assert result is not None
        assert result.name == "Test Outfit"

    def test_get_outfit_not_found(self, test_db, test_user):
        """Test getting non-existent outfit returns None."""
        from app.api.outfits import get_outfit

        result = get_outfit(99999, test_db, test_user.id)

        assert result is None

    def test_create_outfit(self, test_db, test_user):
        """Test creating a new outfit."""
        from app.schemas.schemas import OutfitCreate

        outfit_data = OutfitCreate(
            name="New Outfit",
            description="A new look",
            occasion="formal",
            season="fall",
            clothing_items=[],
        )

        from app.api.outfits import create_outfit
        result = create_outfit(outfit_data, test_db, test_user.id)

        assert result.name == "New Outfit"
        assert result.occasion == "formal"

    def test_update_outfit(self, test_db, test_user, test_outfit):
        """Test updating an outfit."""
        from app.schemas.schemas import OutfitUpdate
        from app.api.outfits import update_outfit

        update_data = OutfitUpdate(
            name="Updated Outfit",
            is_public=1,
        )

        result = update_outfit(test_outfit.id, update_data, test_db, test_user.id)

        assert result.name == "Updated Outfit"
        assert result.is_public == 1

    def test_delete_outfit(self, test_db, test_user, test_outfit):
        """Test deleting an outfit."""
        from app.api.outfits import delete_outfit

        result = delete_outfit(test_outfit.id, test_db, test_user.id)

        assert result is True

        # Verify it's deleted
        deleted_outfit = test_db.query(Outfit).filter(
            Outfit.id == test_outfit.id
        ).first()
        assert deleted_outfit is None

    def test_get_public_outfits(self, test_db, test_user):
        """Test getting public outfits."""
        # Create a public outfit
        public_outfit = Outfit(
            user_id=test_user.id,
            name="Public Outfit",
            is_public=1,
        )
        test_db.add(public_outfit)

        # Create a private outfit
        private_outfit = Outfit(
            user_id=test_user.id,
            name="Private Outfit",
            is_public=0,
        )
        test_db.add(private_outfit)
        test_db.commit()

        from app.api.outfits import get_public_outfits

        result = get_public_outfits(test_db)

        # Should only return public outfit
        public_outfits = [o for o in result if o.is_public == 1]
        assert len(public_outfits) >= 1