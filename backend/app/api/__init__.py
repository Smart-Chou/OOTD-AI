from fastapi import APIRouter
from app.api import auth, body_data, clothing, outfits

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(body_data.router, prefix="/users", tags=["Users"])
api_router.include_router(clothing.router, prefix="/wardrobe", tags=["Wardrobe"])
api_router.include_router(outfits.router, prefix="/outfits", tags=["Outfits"])
