from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from app.models.sale import Sale
from app.models.product import Product
from datetime import date, timedelta
from typing import Optional


class AnalyticsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_summary(self, start_date: Optional[date] = None, end_date: Optional[date] = None) -> dict:
        if not start_date:
            start_date = date.today() - timedelta(days=30)
        if not end_date:
            end_date = date.today()

        # Total revenue & quantity
        result = await self.db.execute(
            select(func.sum(Sale.revenue), func.sum(Sale.quantity))
            .where(Sale.sale_date.between(start_date, end_date))
        )
        total_revenue, total_quantity = result.one()

        days = (end_date - start_date).days or 1
        avg_daily = (total_revenue or 0) / days

        return {
            "total_revenue": round(total_revenue or 0, 2),
            "total_quantity": total_quantity or 0,
            "avg_daily_revenue": round(avg_daily, 2),
            "period_days": days,
        }

    async def revenue_by_region(self, start_date: date, end_date: date) -> list:
        result = await self.db.execute(
            select(Sale.region, func.sum(Sale.revenue).label("revenue"))
            .where(Sale.sale_date.between(start_date, end_date))
            .group_by(Sale.region)
            .order_by(func.sum(Sale.revenue).desc())
        )
        return [{"region": r, "revenue": round(rev, 2)} for r, rev in result.all()]

    async def monthly_trend(self, year: int) -> list:
        result = await self.db.execute(
            select(
                extract("month", Sale.sale_date).label("month"),
                func.sum(Sale.revenue).label("revenue"),
                func.sum(Sale.quantity).label("quantity"),
            )
            .where(extract("year", Sale.sale_date) == year)
            .group_by("month")
            .order_by("month")
        )
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return [
            {"month": months[int(m) - 1], "revenue": round(rev, 2), "quantity": qty}
            for m, rev, qty in result.all()
        ]
