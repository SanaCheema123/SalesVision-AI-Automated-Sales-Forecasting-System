from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, timedelta
from typing import Optional
from app.db.session import get_db
from app.core.deps import get_current_user
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/summary")
async def get_summary(
    start_date: Optional[date] = Query(default=None),
    end_date: Optional[date] = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = AnalyticsService(db)
    return await service.get_summary(start_date, end_date)


@router.get("/revenue-by-region")
async def revenue_by_region(
    start_date: date = Query(default=date.today() - timedelta(days=30)),
    end_date: date = Query(default=date.today()),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = AnalyticsService(db)
    return await service.revenue_by_region(start_date, end_date)


@router.get("/monthly-trend")
async def monthly_trend(
    year: int = Query(default=date.today().year),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = AnalyticsService(db)
    return await service.monthly_trend(year)
