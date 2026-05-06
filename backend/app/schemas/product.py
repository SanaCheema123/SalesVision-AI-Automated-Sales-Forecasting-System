from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductCreate(BaseModel):
    name: str
    sku: str
    category: str
    region: str
    unit_price: float
    description: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    unit_price: Optional[float] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    category: str
    region: str
    unit_price: float
    description: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
