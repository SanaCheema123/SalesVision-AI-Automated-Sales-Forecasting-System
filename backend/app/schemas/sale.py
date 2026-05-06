from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class SaleCreate(BaseModel):
    product_id: int
    sale_date: date
    quantity: int
    revenue: float
    region: str
    channel: str = "direct"


class SaleBulkCreate(BaseModel):
    sales: List[SaleCreate]


class SaleResponse(BaseModel):
    id: int
    product_id: int
    sale_date: date
    quantity: int
    revenue: float
    region: str
    channel: str

    class Config:
        from_attributes = True


class SalesAnalytics(BaseModel):
    total_revenue: float
    total_quantity: int
    avg_daily_revenue: float
    growth_rate: float
    top_products: List[dict]
    revenue_by_region: List[dict]
    revenue_by_channel: List[dict]
    monthly_trend: List[dict]
