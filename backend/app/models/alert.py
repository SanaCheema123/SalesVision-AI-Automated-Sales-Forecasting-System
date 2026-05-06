from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin
import enum


class AlertSeverity(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class Alert(Base, TimestampMixin):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(Enum(AlertSeverity), default=AlertSeverity.medium)
    is_read = Column(Boolean, default=False)
    alert_type = Column(String(50), nullable=False)  # anomaly, threshold, trend_change
    threshold_value = Column(Float, nullable=True)
    actual_value = Column(Float, nullable=True)
