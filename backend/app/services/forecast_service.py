from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.forecast import Forecast, ForecastStatus
from app.schemas.forecast import ForecastCreate
from app.utils.ml_runner import run_forecast_pipeline
from datetime import date, timedelta
from loguru import logger
from typing import Optional, List


class ForecastService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_forecast(self, data: ForecastCreate, user_id: int) -> Forecast:
        forecast = Forecast(
            product_id=data.product_id,
            created_by_id=user_id,
            model_name=data.model_name,
            granularity=data.granularity,
            horizon_days=data.horizon_days,
            status=ForecastStatus.pending,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=data.horizon_days),
        )
        self.db.add(forecast)
        await self.db.flush()
        await self.db.refresh(forecast)

        # Trigger async ML pipeline
        try:
            result = await run_forecast_pipeline(forecast.id, data)
            forecast.status = ForecastStatus.completed
            forecast.forecast_data = result["forecast_data"]
            forecast.mape = result.get("mape")
            forecast.rmse = result.get("rmse")
            forecast.mlflow_run_id = result.get("mlflow_run_id")
        except Exception as e:
            logger.error(f"Forecast failed: {e}")
            forecast.status = ForecastStatus.failed

        return forecast

    async def get_by_id(self, forecast_id: int) -> Optional[Forecast]:
        result = await self.db.execute(select(Forecast).where(Forecast.id == forecast_id))
        return result.scalar_one_or_none()

    async def list_forecasts(self, product_id: Optional[int] = None) -> List[Forecast]:
        query = select(Forecast)
        if product_id:
            query = query.where(Forecast.product_id == product_id)
        result = await self.db.execute(query.order_by(Forecast.created_at.desc()))
        return result.scalars().all()
