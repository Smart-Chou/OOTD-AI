from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    role = Column(Enum(UserRole), default=UserRole.USER)
    avatar_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    body_data = relationship("BodyData", back_populates="user", uselist=False)
    wardrobe = relationship("ClothingItem", back_populates="user")
    outfits = relationship("Outfit", back_populates="user")


class BodyData(Base):
    __tablename__ = "body_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    height = Column(Float, nullable=False)  # cm
    weight = Column(Float, nullable=False)  # kg
    age = Column(Integer)
    gender = Column(String(20))  # male/female/other
    chest = Column(Float)  # cm
    waist = Column(Float)  # cm
    hips = Column(Float)  # cm
    shoulder_width = Column(Float)  # cm
    preferred_style = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="body_data")


class ClothingCategory(str, enum.Enum):
    TOPS = "tops"
    BOTTOMS = "bottoms"
    OUTERWEAR = "outerwear"
    DRESSES = "dresses"
    SHOES = "shoes"
    ACCESSORIES = "accessories"


class ClothingItem(Base):
    __tablename__ = "clothing_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(200), nullable=False)
    category = Column(Enum(ClothingCategory), nullable=False)
    color = Column(String(50))
    season = Column(String(50))  # spring/summer/fall/winter
    brand = Column(String(100))
    size = Column(String(20))
    image_url = Column(String(500))
    thumbnail_url = Column(String(500))
    tags = Column(Text)  # JSON string
    is_favorite = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="wardrobe")
    outfit_items = relationship("OutfitItem", back_populates="clothing")


class Outfit(Base):
    __tablename__ = "outfits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(200), nullable=False)
    description = Column(Text)
    style_tags = Column(Text)  # JSON string
    occasion = Column(String(50))  # casual/formal/work/etc
    season = Column(String(50))
    is_public = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    image_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="outfits")
    items = relationship("OutfitItem", back_populates="outfit")


class OutfitItem(Base):
    __tablename__ = "outfit_items"

    id = Column(Integer, primary_key=True, index=True)
    outfit_id = Column(Integer, ForeignKey("outfits.id"))
    clothing_id = Column(Integer, ForeignKey("clothing_items.id"))
    position_x = Column(Float, default=0)
    position_y = Column(Float, default=0)

    outfit = relationship("Outfit", back_populates="items")
    clothing = relationship("ClothingItem", back_populates="outfit_items")
