"""
Size Guide API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.models.models import User, BodyData
from app.services.size_guide import size_guide_service
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/{brand}")
def get_brand_size_guide(
    brand: str,
    category: Optional[str] = Query(None, description="Clothing category (tops, bottoms)"),
    gender: str = Query("male", description="Gender (male, female)"),
    current_user: User = Depends(get_current_user)
):
    """
    Get size guide for a specific brand.

    Supported brands: zara, hm, uniqlo
    Supported categories: tops, bottoms
    """
    result = size_guide_service.get_size_guide(brand, category, gender)
    return result


@router.post("/recommend")
def recommend_size(
    brand: str = Query(..., description="Brand name (zara, hm, uniqlo)"),
    category: str = Query(..., description="Clothing category (tops, bottoms)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get size recommendation based on user's body measurements.
    """
    # Get user body data
    body_data = db.query(BodyData).filter(BodyData.user_id == current_user.id).first()

    if not body_data:
        raise HTTPException(
            status_code=400,
            detail="Please complete your body measurements first"
        )

    body_measurements = {
        "height_cm": body_data.height,
        "weight_kg": body_data.weight,
        "gender": body_data.gender,
        "chest_cm": body_data.chest,
        "waist_cm": body_data.waist,
        "hips_cm": body_data.hips,
        "shoulder_width_cm": body_data.shoulder_width
    }

    result = size_guide_service.recommend_size(brand, category, body_measurements)

    if not result:
        return {
            "error": "Size recommendation not available for this brand/category combination",
            "supported_brands": ["zara", "hm", "uniqlo"],
            "supported_categories": ["tops", "bottoms"]
        }

    return {
        "brand": brand,
        "category": category,
        "recommended_size": result.recommended_size,
        "confidence": result.confidence,
        "fit_notes": result.fit_notes,
        "alternatives": result.alternatives
    }


@router.get("/brands/list")
def list_supported_brands():
    """Get list of supported brands."""
    return {
        "brands": [
            {"name": "zara", "display_name": "ZARA", "logo": "zara-logo-url"},
            {"name": "hm", "display_name": "H&M", "logo": "hm-logo-url"},
            {"name": "uniqlo", "display_name": "Uniqlo", "logo": "uniqlo-logo-url"}
        ]
    }