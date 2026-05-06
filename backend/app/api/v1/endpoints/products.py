from fastapi import APIRouter, Depends
from app.core.deps import get_current_user

router = APIRouter()

@router.get("/")
async def list_products(current_user=Depends(get_current_user)):
    return {"message": "products endpoint - implement as needed", "data": []}
