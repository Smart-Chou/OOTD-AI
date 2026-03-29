from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.models import User, Outfit, OutfitItem, ClothingItem
from app.schemas.schemas import OutfitCreate, OutfitUpdate, OutfitResponse, OutfitItemCreate
from app.api.auth import get_current_user

router = APIRouter()


@router.post("/outfits", response_model=OutfitResponse, status_code=status.HTTP_201_CREATED)
def create_outfit(
    outfit: OutfitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create outfit
    db_outfit = Outfit(
        name=outfit.name,
        description=outfit.description,
        style_tags=outfit.style_tags,
        occasion=outfit.occasion,
        season=outfit.season,
        user_id=current_user.id
    )
    db.add(db_outfit)
    db.commit()
    db.refresh(db_outfit)

    # Add items to outfit
    for item_id in outfit.item_ids:
        clothing = db.query(ClothingItem).filter(
            ClothingItem.id == item_id,
            ClothingItem.user_id == current_user.id
        ).first()
        if not clothing:
            continue
        outfit_item = OutfitItem(outfit_id=db_outfit.id, clothing_id=item_id)
        db.add(outfit_item)

    db.commit()
    db.refresh(db_outfit)
    return db_outfit


@router.get("/outfits", response_model=List[OutfitResponse])
def get_outfits(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Outfit).filter(Outfit.user_id == current_user.id).all()


@router.get("/outfits/public", response_model=List[OutfitResponse])
def get_public_outfits(
    db: Session = Depends(get_db)
):
    return db.query(Outfit).filter(Outfit.is_public == 1).all()


@router.get("/outfits/{outfit_id}", response_model=OutfitResponse)
def get_outfit(
    outfit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    outfit = db.query(Outfit).filter(Outfit.id == outfit_id).first()
    if not outfit:
        raise HTTPException(status_code=404, detail="Outfit not found")
    # Only owner can view private outfits
    if not outfit.is_public and outfit.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Outfit not found")
    return outfit


@router.put("/outfits/{outfit_id}", response_model=OutfitResponse)
def update_outfit(
    outfit_id: int,
    outfit_update: OutfitUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    outfit = db.query(Outfit).filter(
        Outfit.id == outfit_id,
        Outfit.user_id == current_user.id
    ).first()
    if not outfit:
        raise HTTPException(status_code=404, detail="Outfit not found")

    for key, value in outfit_update.model_dump(exclude_unset=True).items():
        setattr(outfit, key, value)
    db.commit()
    db.refresh(outfit)
    return outfit


@router.delete("/outfits/{outfit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_outfit(
    outfit_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    outfit = db.query(Outfit).filter(
        Outfit.id == outfit_id,
        Outfit.user_id == current_user.id
    ).first()
    if not outfit:
        raise HTTPException(status_code=404, detail="Outfit not found")
    db.delete(outfit)
    db.commit()
    return None
