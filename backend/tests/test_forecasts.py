import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_create_forecast_unauthorized():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/v1/forecasts/", json={
            "product_id": 1,
            "model_name": "prophet",
            "horizon_days": 30,
        })
    assert response.status_code == 401
