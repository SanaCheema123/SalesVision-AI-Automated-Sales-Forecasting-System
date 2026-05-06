from fastapi import APIRouter, Depends
from app.core.deps import get_current_user

router = APIRouter()

@router.get("/")
async def list_sales(current_user=Depends(get_current_user)):
    return {"message": "sales endpoint - implement as needed", "data": []}
