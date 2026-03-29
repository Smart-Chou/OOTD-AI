from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.config import settings
from app.models.models import User, BodyData
from app.schemas.schemas import BodyDataCreate, BodyDataResponse
from app.api.auth import get_current_user

router = APIRouter()


@router.post("/body-data", response_model=BodyDataResponse, status_code=status.HTTP_201_CREATED)
def create_body_data(
    body_data: BodyDataCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if body data already exists
    existing = db.query(BodyData).filter(BodyData.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Body data already exists, use PUT to update")

    db_body_data = BodyData(**body_data.model_dump(), user_id=current_user.id)
    db.add(db_body_data)
    db.commit()
    db.refresh(db_body_data)
    return db_body_data


@router.get("/body-data", response_model=BodyDataResponse)
def get_body_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    body_data = db.query(BodyData).filter(BodyData.user_id == current_user.id).first()
    if not body_data:
        raise HTTPException(status_code=404, detail="Body data not found")
    return body_data


@router.put("/body-data", response_model=BodyDataResponse)
def update_body_data(
    body_data: BodyDataCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(BodyData).filter(BodyData.user_id == current_user.id).first()
    if not existing:
        # Create if not exists
        db_body_data = BodyData(**body_data.model_dump(), user_id=current_user.id)
        db.add(db_body_data)
        db.commit()
        db.refresh(db_body_data)
        return db_body_data

    # Update existing
    for key, value in body_data.model_dump().items():
        setattr(existing, key, value)
    db.commit()
    db.refresh(existing)
    return existing


@router.delete("/body-data", status_code=status.HTTP_204_NO_CONTENT)
def delete_body_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    body_data = db.query(BodyData).filter(BodyData.user_id == current_user.id).first()
    if not body_data:
        raise HTTPException(status_code=404, detail="Body data not found")
    db.delete(body_data)
    db.commit()
    return None
