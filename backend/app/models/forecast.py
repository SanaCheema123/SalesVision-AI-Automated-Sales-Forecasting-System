from sqlalchemy import Column, Integer, Float, Date, ForeignKey, String, JSON, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin
import enum


class ForecastStatus(str, enum.Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"


class ForecastGranularity(str, enum.Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    quarterly = "quarterly"


class Forecast(Base, TimestampMixin):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    model_name = Column(String(50), nullable=False)  # prophet, xgboost, lstm, ensemble
    granularity = Column(Enum(ForecastGranularity), default=ForecastGranularity.monthly)
    horizon_days = Column(Integer, default=90)
    status = Column(Enum(ForecastStatus), default=ForecastStatus.pending)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    mape = Column(Float, nullable=True)         # Mean Absolute Percentage Error
    rmse = Column(Float, nullable=True)         # Root Mean Squared Error
    forecast_data = Column(JSON, nullable=True)  # {date: value, lower: val, upper: val}
    model_params = Column(JSON, nullable=True)
    mlflow_run_id = Column(String(255), nullable=True)

    product = relationship("Product", back_populates="forecasts")
    created_by = relationship("User", back_populates="forecasts")
