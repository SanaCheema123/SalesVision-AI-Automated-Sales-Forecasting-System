import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_register_and_login():
    async with AsyncClient(app=app, base_url="http://test") as client:
        reg = await client.post("/api/v1/auth/register", json={
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "SecurePass123",
        })
        assert reg.status_code == 201

        login = await client.post("/api/v1/auth/login", json={
            "email": "test@example.com",
            "password": "SecurePass123",
        })
        assert login.status_code == 200
        assert "access_token" in login.json()
