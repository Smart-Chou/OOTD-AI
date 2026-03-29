"""
Recommendation API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.models.models import User, BodyData, ClothingItem, Outfit
from app.schemas.schemas import OutfitResponse
from app.services.ai import minimax_service
from app.services.cache import cache
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/outfits")
def get_recommended_outfits(
    occasion: Optional[str] = Query(None, description="Occasion type (casual, formal, work, etc.)"),
    season: Optional[str] = Query(None, description="Season (spring, summer, fall, winter)"),
    weather: Optional[str] = Query(None, description="Weather condition"),
    temperature_c: Optional[float] = Query(None, description="Temperature in Celsius"),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get personalized outfit recommendations based on body data and preferences.
    """
    # Get user body data
    body_data = db.query(BodyData).filter(BodyData.user_id == current_user.id).first()
    if not body_data:
        raise HTTPException(status_code=400, detail="Please complete your body data first")

    # Get user clothing items
    items = db.query(ClothingItem).filter(ClothingItem.user_id == current_user.id).all()
    if not items:
        raise HTTPException(status_code=400, detail="Please add some clothing items first")

    # Get cached recommendation if available
    cache_key = f"recommendation:{current_user.id}:{occasion}:{season}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    # Generate AI-based recommendation
    body_dict = {
        "height": body_data.height,
        "weight": body_data.weight,
        "gender": body_data.gender,
        "chest": body_data.chest,
        "waist": body_data.waist,
        "preferred_style": body_data.preferred_style
    }

    items_list = [
        {
            "id": item.id,
            "name": item.name,
            "category": item.category.value if hasattr(item.category, 'value') else item.category,
            "color": item.color,
            "season": item.season
        }
        for item in items
    ]

    # Use AI service for recommendation
    import asyncio
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    recommendation = loop.run_until_complete(
        minimax_service.generate_outfit_recommendation(body_dict, occasion or "casual", season or "spring", items_list)
    )

    # Find matching items
    recommended_items = []
    if recommendation:
        for item in items_list:
            if recommendation.get("top") and recommendation["top"] in item.get("name", ""):
                recommended_items.append(item)
            if recommendation.get("bottom") and recommendation["bottom"] in item.get("name", ""):
                recommended_items.append(item)

    # Create outfit recommendation response
    result = {
        "recommendation": recommendation,
        "matching_items": recommended_items[:limit],
        "total_items": len(items_list)
    }

    # Cache for 1 hour
    cache.set(cache_key, result, expire=3600)

    return result


@router.get("/clothing")
def get_clothing_recommendations(
    category: Optional[str] = Query(None, description="Clothing category"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    brands: Optional[str] = Query(None, description="Comma-separated brand names"),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get clothing item recommendations.
    """
    # Get user's existing items
    query = db.query(ClothingItem).filter(ClothingItem.user_id == current_user.id)

    if category:
        query = query.filter(ClothingItem.category == category)

    existing_items = query.all()

    # Analyze user's style preferences
    user_body = db.query(BodyData).filter(BodyData.user_id == current_user.id).first()

    return {
        "recommendations": [
            {
                "id": item.id,
                "name": item.name,
                "category": item.category.value if hasattr(item.category, 'value') else item.category,
                "color": item.color,
                "season": item.season,
                "reason": "Matches your style preferences"
            }
            for item in existing_items[:limit]
        ],
        "total": len(existing_items)
    }


@router.post("/ai-outfits")
async def generate_ai_outfit(
    items: List[int],
    style: str = Query("realistic", description="Generation style"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate AI-powered outfit visualization.
    """
    # Verify items belong to user
    clothing_items = db.query(ClothingItem).filter(
        ClothingItem.id.in_(items),
        ClothingItem.user_id == current_user.id
    ).all()

    if not clothing_items:
        raise HTTPException(status_code=404, detail="No valid clothing items found")

    # Generate a unique job ID
    job_id = str(uuid.uuid4())

    # In a real implementation, this would queue the generation job
    # For now, return a mock response
    return {
        "generation_id": job_id,
        "status": "completed",
        "items": [
            {
                "id": item.id,
                "name": item.name,
                "category": item.category.value if hasattr(item.category, 'value') else item.category
            }
            for item in clothing_items
        ],
        "result": {
            "image_url": None,  # Would contain generated image URL
            "style": style,
            "message": "AI generation endpoint - integrate with MiniMax for actual image generation"
        }
    }


@router.get("/ai-outfits/{generation_id}/status")
def check_generation_status(
    generation_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Check the status of an AI outfit generation job.
    """
    # In a real implementation, check job status from queue/Redis
    return {
        "generation_id": generation_id,
        "status": "completed",
        "message": "Job completed successfully"
    }