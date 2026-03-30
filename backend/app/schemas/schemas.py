from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.models import UserRole, ClothingCategory


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: UserRole
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None


class LoginRequest(BaseModel):
    username: str
    password: str


# Body Data schemas
class BodyDataBase(BaseModel):
    height: float
    weight: float
    age: Optional[int] = None
    gender: Optional[str] = None
    chest: Optional[float] = None
    waist: Optional[float] = None
    hips: Optional[float] = None
    shoulder_width: Optional[float] = None
    preferred_style: Optional[str] = None


class BodyDataCreate(BodyDataBase):
    pass


class BodyDataUpdate(BodyDataBase):
    pass


class BodyDataResponse(BodyDataBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Clothing schemas
class ClothingBase(BaseModel):
    name: str
    category: ClothingCategory
    color: Optional[str] = None
    season: Optional[str] = None
    brand: Optional[str] = None
    size: Optional[str] = None


class ClothingCreate(ClothingBase):
    image_url: Optional[str] = None
    tags: Optional[str] = None


class ClothingUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[ClothingCategory] = None
    color: Optional[str] = None
    season: Optional[str] = None
    brand: Optional[str] = None
    size: Optional[str] = None
    is_favorite: Optional[int] = None


class ClothingResponse(ClothingBase):
    id: int
    user_id: int
    image_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags: Optional[str] = None
    is_favorite: int
    created_at: datetime

    class Config:
        from_attributes = True


# Outfit schemas
class OutfitBase(BaseModel):
    name: str
    description: Optional[str] = None
    style_tags: Optional[str] = None
    occasion: Optional[str] = None
    season: Optional[str] = None


class OutfitCreate(OutfitBase):
    item_ids: List[int]


class OutfitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    style_tags: Optional[str] = None
    occasion: Optional[str] = None
    season: Optional[str] = None
    is_public: Optional[int] = None


class OutfitItemCreate(BaseModel):
    clothing_id: int
    position_x: float = 0
    position_y: float = 0


class OutfitResponse(OutfitBase):
    id: int
    user_id: int
    is_public: int
    likes_count: int
    image_url: Optional[str] = None
    created_at: datetime
    items: List[ClothingResponse] = []

    class Config:
        from_attributes = True


# Refresh Token schemas
class RefreshTokenRequest(BaseModel):
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class TokenRevokeRequest(BaseModel):
    refresh_token: str


# Bulk import/export schemas
class CSVImportRequest(BaseModel):
    csv_data: str  # CSV content as string


class CSVImportResponse(BaseModel):
    success: bool
    imported_count: int
    total_errors: int
    errors: List[str] = []


class CSVExportResponse(BaseModel):
    total_count: int
    categories: List[str] = []
