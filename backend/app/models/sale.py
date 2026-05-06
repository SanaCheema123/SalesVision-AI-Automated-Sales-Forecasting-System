from sqlalchemy import Column, Integer, Float, Date, ForeignKey, String
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Sale(Base, TimestampMixin):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    sale_date = Column(Date, nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    revenue = Column(Float, nullable=False)
    region = Column(String(100), nullable=False)
    channel = Column(String(50), nullable=False, default="direct")  # direct, online, partner

    product = relationship("Product", back_populates="sales")
