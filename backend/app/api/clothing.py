from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import uuid
import os

from app.core.database import get_db
from app.models.models import User, ClothingItem
from app.schemas.schemas import ClothingCreate, ClothingUpdate, ClothingResponse
from app.api.auth import get_current_user

router = APIRouter()

# Upload folder for clothing images
UPLOAD_DIR = "uploads/clothing"


@router.post("/", response_model=ClothingResponse, status_code=status.HTTP_201_CREATED)
def create_clothing(
    clothing: ClothingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_clothing = ClothingItem(**clothing.model_dump(), user_id=current_user.id)
    db.add(db_clothing)
    db.commit()
    db.refresh(db_clothing)
    return db_clothing


@router.get("/", response_model=List[ClothingResponse])
def get_clothing_list(
    category: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(ClothingItem).filter(ClothingItem.user_id == current_user.id)
    if category:
        query = query.filter(ClothingItem.category == category)
    return query.all()


@router.get("/{clothing_id}", response_model=ClothingResponse)
def get_clothing(
    clothing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    clothing = db.query(ClothingItem).filter(
        ClothingItem.id == clothing_id,
        ClothingItem.user_id == current_user.id
    ).first()
    if not clothing:
        raise HTTPException(status_code=404, detail="Clothing not found")
    return clothing


@router.put("/{clothing_id}", response_model=ClothingResponse)
def update_clothing(
    clothing_id: int,
    clothing_update: ClothingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    clothing = db.query(ClothingItem).filter(
        ClothingItem.id == clothing_id,
        ClothingItem.user_id == current_user.id
    ).first()
    if not clothing:
        raise HTTPException(status_code=404, detail="Clothing not found")

    for key, value in clothing_update.model_dump(exclude_unset=True).items():
        setattr(clothing, key, value)
    db.commit()
    db.refresh(clothing)
    return clothing


@router.delete("/{clothing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_clothing(
    clothing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    clothing = db.query(ClothingItem).filter(
        ClothingItem.id == clothing_id,
        ClothingItem.user_id == current_user.id
    ).first()
    if not clothing:
        raise HTTPException(status_code=404, detail="Clothing not found")
    db.delete(clothing)
    db.commit()
    return None


@router.post("/upload")
async def upload_clothing_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Create upload directory if not exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Save file
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    return {"image_url": f"/uploads/clothing/{filename}", "filename": filename}
