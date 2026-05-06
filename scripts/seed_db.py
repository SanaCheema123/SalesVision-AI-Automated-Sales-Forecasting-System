"""
Seed the database with demo data for development.
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.services.user_service import UserService
from app.schemas.user import UserCreate
from loguru import logger
import sys
sys.path.insert(0, "backend")


async def seed():
    async with AsyncSessionLocal() as db:
        service = UserService(db)

        # Admin user
        existing = await service.get_by_email("admin@example.com")
        if not existing:
            await service.create(UserCreate(
                email="admin@example.com",
                full_name="Admin User",
                password="password",
                role="admin",
            ))
            logger.info("✅ Admin user created: admin@example.com / password")

        # Analyst user
        existing = await service.get_by_email("analyst@example.com")
        if not existing:
            await service.create(UserCreate(
                email="analyst@example.com",
                full_name="Jane Analyst",
                password="password",
                role="analyst",
            ))
            logger.info("✅ Analyst user created: analyst@example.com / password")

        await db.commit()
        logger.info("🎉 Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
