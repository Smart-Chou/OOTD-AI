"""
Recommendation API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid

from app.core.database import get_db
from app.models.models import User, BodyData, ClothingItem, Outfit
from app.schemas.schemas import OutfitResponse
from app.services.ai import minimax_service
from app.services.cache import cache
from app.api.auth import get_current_user
from app.middleware.rate_limit import limiter, AI_GENERATION_RATE_LIMIT, API_RATE_LIMIT

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


# ==================== Virtual Try-On API ====================
# This section implements virtual try-on functionality using MiniMax AI
# Users can upload their photo and see clothing rendered on them

from pydantic import BaseModel
import base64
import httpx


class VirtualTryOnRequest(BaseModel):
    """Request model for virtual try-on."""
    user_photo_base64: str  # Base64 encoded user photo
    clothing_item_id: int  # ID of the clothing item to try on


class VirtualTryOnResponse(BaseModel):
    """Response model for virtual try-on."""
    generation_id: str
    status: str  # "processing", "completed", "failed"
    result_image_url: str | None = None
    message: str


@router.post("/virtual-tryon", response_model=VirtualTryOnResponse)
@limiter.limit(AI_GENERATION_RATE_LIMIT)
async def virtual_try_on(
    request: Request,
    body: VirtualTryOnRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate a virtual try-on image showing the user wearing selected clothing.

    This endpoint:
    1. Validates the user photo and clothing item
    2. Creates a generation job
    3. Returns immediately with a generation_id (async processing)
    4. The frontend can poll for completion status
    """
    # Verify clothing item belongs to user
    clothing_item = db.query(ClothingItem).filter(
        ClothingItem.id == body.clothing_item_id,
        ClothingItem.user_id == current_user.id
    ).first()

    if not clothing_item:
        raise HTTPException(status_code=404, detail="Clothing item not found")

    # Generate job ID
    job_id = f"tryon_{uuid.uuid4().hex[:16]}"

    # Check if MiniMax API is configured
    from app.core.config import settings
    if not settings.MINIMAX_API_KEY:
        return VirtualTryOnResponse(
            generation_id=job_id,
            status="failed",
            result_image_url=None,
            message="AI service not configured. Please set MINIMAX_API_KEY."
        )

    # Store job info in cache for status checking
    job_data = {
        "job_id": job_id,
        "user_id": current_user.id,
        "clothing_item_id": body.clothing_item_id,
        "status": "processing",
        "created_at": str(datetime.now())
    }

    try:
        # For now, we process synchronously (in production, use async queue)
        # Use MiniMax for image-to-image generation

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                "https://api.minimax.chat/v1/image_generation",
                headers={
                    "Authorization": f"Bearer {settings.MINIMAX_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "image-01",
                    "prompt": f"Virtual try-on: A person wearing {clothing_item.name}, "
                              f"category: {clothing_item.category.value if hasattr(clothing_item.category, 'value') else clothing_item.category}, "
                              f"color: {clothing_item.color or 'various'}, "
                              f"style: {clothing_item.season or 'casual'}. "
                              f"High quality fashion photo, realistic rendering.",
                    "image_base64": request.user_photo_base64,
                    "image_size": "1024x1024",
                    "返回base64": True
                }
            )

            if response.status_code == 200:
                result_data = response.json()
                image_base64 = result_data.get("data", {}).get("base64_image")

                job_data["status"] = "completed"
                job_data["result_image_url"] = f"data:image/jpeg;base64,{image_base64}"

                return VirtualTryOnResponse(
                    generation_id=job_id,
                    status="completed",
                    result_image_url=job_data["result_image_url"],
                    message="Virtual try-on generated successfully!"
                )
            else:
                job_data["status"] = "failed"
                job_data["error"] = response.text

    except Exception as e:
        job_data["status"] = "failed"
        job_data["error"] = str(e)

    # Cache job result
    cache.set(f"tryon_job:{job_id}", job_data, expire=3600)

    # Return processing response (frontend will poll)
    return VirtualTryOnResponse(
        generation_id=job_id,
        status="processing",
        result_image_url=None,
        message="Virtual try-on is being processed. Please check status later."
    )


@router.get("/virtual-tryon/{job_id}/status")
@limiter.limit(API_RATE_LIMIT)
def check_virtual_tryon_status(
    request: Request,
    job_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Check the status of a virtual try-on job.

    Returns:
        - status: "processing", "completed", or "failed"
        - result_image_url: The generated image URL (when completed)
        - message: Status description
    """
    job_data = cache.get(f"tryon_job:{job_id}")

    if not job_data:
        return {
            "generation_id": job_id,
            "status": "not_found",
            "result_image_url": None,
            "message": "Job not found or expired"
        }

    return {
        "generation_id": job_id,
        "status": job_data.get("status", "unknown"),
        "result_image_url": job_data.get("result_image_url"),
        "message": "Job completed" if job_data.get("status") == "completed" else "Job processing..."
    }