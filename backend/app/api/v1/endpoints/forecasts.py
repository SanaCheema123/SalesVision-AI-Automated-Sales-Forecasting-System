from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.db.session import get_db
from app.core.deps import get_current_user
from app.schemas.forecast import ForecastCreate, ForecastResponse
from app.services.forecast_service import ForecastService

router = APIRouter()


@router.post("/", response_model=ForecastResponse, status_code=201)
async def create_forecast(
    data: ForecastCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = ForecastService(db)
    forecast = await service.create_forecast(data, current_user.id)
    return ForecastResponse.model_validate(forecast)


@router.get("/", response_model=List[ForecastResponse])
async def list_forecasts(
    product_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = ForecastService(db)
    return await service.list_forecasts(product_id)


@router.get("/{forecast_id}", response_model=ForecastResponse)
async def get_forecast(
    forecast_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = ForecastService(db)
    forecast = await service.get_by_id(forecast_id)
    if not forecast:
        raise HTTPException(status_code=404, detail="Forecast not found")
    return ForecastResponse.model_validate(forecast)
