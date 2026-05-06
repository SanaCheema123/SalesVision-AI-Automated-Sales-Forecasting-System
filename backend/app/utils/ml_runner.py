"""
ML Pipeline Runner - bridges FastAPI with the ML module.
In production, this triggers a Celery task.
"""
import asyncio
import random
from datetime import date, timedelta
from app.schemas.forecast import ForecastCreate


async def run_forecast_pipeline(forecast_id: int, data: ForecastCreate) -> dict:
    """
    Run the ML forecast pipeline.
    In production: dispatches Celery task → ML scripts → MLflow tracking.
    For development: returns mock forecast data.
    """
    await asyncio.sleep(0.5)  # Simulate processing

    # Generate mock forecast data
    start = date.today()
    forecast_data = []
    base = 50000

    for i in range(data.horizon_days):
        day = start + timedelta(days=i)
        trend = base * (1 + 0.002 * i)
        noise = random.gauss(0, base * 0.05)
        predicted = max(0, trend + noise)
        forecast_data.append({
            "date": day.isoformat(),
            "predicted": round(predicted, 2),
            "lower_bound": round(predicted * 0.85, 2),
            "upper_bound": round(predicted * 1.15, 2),
        })

    return {
        "forecast_data": forecast_data,
        "mape": round(random.uniform(3.5, 8.5), 2),
        "rmse": round(random.uniform(1200, 3500), 2),
        "mlflow_run_id": f"run_{forecast_id}_{random.randint(1000, 9999)}",
    }
