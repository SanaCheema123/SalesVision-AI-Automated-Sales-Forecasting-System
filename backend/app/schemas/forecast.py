from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import date


class ForecastCreate(BaseModel):
    product_id: int
    model_name: str = "ensemble"  # prophet, xgboost, lstm, ensemble
    granularity: str = "monthly"
    horizon_days: int = 90


class ForecastDataPoint(BaseModel):
    date: str
    predicted: float
    lower_bound: float
    upper_bound: float


class ForecastResponse(BaseModel):
    id: int
    product_id: int
    model_name: str
    granularity: str
    horizon_days: int
    status: str
    start_date: Optional[date]
    end_date: Optional[date]
    mape: Optional[float]
    rmse: Optional[float]
    forecast_data: Optional[List[Dict[str, Any]]]
    model_params: Optional[Dict[str, Any]]
    mlflow_run_id: Optional[str]

    class Config:
        from_attributes = True


class ScenarioRequest(BaseModel):
    product_id: int
    base_forecast_id: int
    adjustments: Dict[str, float]  # {"price_change": 0.1, "marketing_spend": 0.2}
    horizon_days: int = 90
