from fastapi import APIRouter
from app.api import auth, body_data, clothing, outfits, recommendations, size_guides, analytics, bulk

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(body_data.router, prefix="/users", tags=["Users"])
api_router.include_router(clothing.router, prefix="/wardrobe", tags=["Wardrobe"])
api_router.include_router(outfits.router, prefix="/outfits", tags=["Outfits"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(size_guides.router, prefix="/size-guides", tags=["Size Guides"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(bulk.router, prefix="/bulk", tags=["Bulk"])
