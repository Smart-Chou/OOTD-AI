"""
Analytics API endpoints.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Optional

from app.core.database import get_db
from app.models.models import User, BodyData, ClothingItem, Outfit
from app.services.cache import cache
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/wardrobe")
def get_wardrobe_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get wardrobe statistics and analytics.
    """
    cache_key = f"analytics:wardrobe:{current_user.id}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    items = db.query(ClothingItem).filter(ClothingItem.user_id == current_user.id).all()

    # Calculate category distribution
    category_counts = {}
    color_counts = {}
    season_counts = {}
    total_items = len(items)

    for item in items:
        cat = item.category.value if hasattr(item.category, 'value') else item.category
        category_counts[cat] = category_counts.get(cat, 0) + 1

        if item.color:
            color_counts[item.color] = color_counts.get(item.color, 0) + 1

        if item.season:
            season_counts[item.season] = season_counts.get(item.season, 0) + 1

    # Favorite items
    favorites = [item for item in items if item.is_favorite]

    result = {
        "total_items": total_items,
        "favorites_count": len(favorites),
        "category_distribution": {
            "labels": list(category_counts.keys()),
            "data": list(category_counts.values())
        },
        "color_distribution": {
            "labels": list(color_counts.keys()),
            "data": list(color_counts.values())
        },
        "season_distribution": {
            "labels": list(season_counts.keys()),
            "data": list(season_counts.values())
        },
        "completion_rate": _calculate_completion_rate(category_counts)
    }

    # Cache for 1 hour
    cache.set(cache_key, result, expire=3600)

    return result


@router.get("/wearing-habits")
def get_wearing_habits(
    time_range: str = Query("30d", description="Time range: 7d, 30d, 90d, 1y"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get wearing habit analysis.
    """
    cache_key = f"analytics:habits:{current_user.id}:{time_range}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    # Parse time range
    days_map = {"7d": 7, "30d": 30, "90d": 90, "1y": 365}
    days = days_map.get(time_range, 30)

    # Get outfits created in time range
    cutoff_date = datetime.now() - timedelta(days=days)
    outfits = db.query(Outfit).filter(
        Outfit.user_id == current_user.id,
        Outfit.created_at >= cutoff_date
    ).all()

    # Analyze occasion distribution
    occasion_counts = {}
    season_counts = {}
    total_outfits = len(outfits)

    for outfit in outfits:
        if outfit.occasion:
            occasion_counts[outfit.occasion] = occasion_counts.get(outfit.occasion, 0) + 1
        if outfit.season:
            season_counts[outfit.season] = season_counts.get(outfit.season, 0) + 1

    result = {
        "time_range": time_range,
        "total_outfits_created": total_outfits,
        "outfits_per_week": round(total_outfits / (days / 7), 1) if days > 0 else 0,
        "occasion_distribution": {
            "labels": list(occasion_counts.keys()),
            "data": list(occasion_counts.values())
        },
        "season_distribution": {
            "labels": list(season_counts.keys()),
            "data": list(season_counts.values())
        },
        "top_occasions": list(occasion_counts.keys())[:5] if occasion_counts else []
    }

    # Cache for 1 hour
    cache.set(cache_key, result, expire=3600)

    return result


@router.get("/recommendation-performance")
def get_recommendation_performance(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get recommendation system performance metrics.
    """
    cache_key = f"analytics:recommendations:{current_user.id}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    # Get all outfits (assuming some were generated from recommendations)
    outfits = db.query(Outfit).filter(Outfit.user_id == current_user.id).all()

    # Calculate mock metrics (in real implementation, track actual usage)
    result = {
        "total_recommendations_viewed": len(outfits) * 3,  # Mock
        "recommendation_accept_rate": 0.65,  # Mock: 65% acceptance
        "average_rating": 4.2,  # Mock
        "top_categories": ["tops", "bottoms", "outerwear"],
        "seasonal_trends": {
            "spring": {"total": 15, "avg_items": 3.2},
            "summer": {"total": 12, "avg_items": 2.8},
            "fall": {"total": 18, "avg_items": 3.5},
            "winter": {"total": 20, "avg_items": 4.0}
        },
        "insights": [
            "You tend to prefer neutral colors in formal settings",
            "Your casual wardrobe is underrepresented",
            "Consider adding more summer items for variety"
        ]
    }

    # Cache for 1 hour
    cache.set(cache_key, result, expire=3600)

    return result


def _calculate_completion_rate(category_counts: dict) -> float:
    """Calculate wardrobe completion rate based on category coverage."""
    # Expected categories for a complete wardrobe
    expected_categories = ["tops", "bottoms", "outerwear", "dresses", "shoes", "accessories"]
    covered = len([c for c in expected_categories if c in category_counts])
    return round(covered / len(expected_categories) * 100, 1)