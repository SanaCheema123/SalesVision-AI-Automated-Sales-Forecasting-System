#!/bin/bash
set -e

echo "🚀 Setting up SalesForecastAI..."

# Copy env
cp .env.example .env
echo "✅ .env created"

# Backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
echo "✅ Backend dependencies installed"

# Run migrations
alembic upgrade head
echo "✅ Database migrations applied"

cd ..

# ML data generation
cd ml
pip install -r requirements.txt
python scripts/data_pipeline.py
echo "✅ Mock data generated"

cd ..

# Frontend
cd frontend
npm install
echo "✅ Frontend dependencies installed"

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Start services:"
echo "  Backend:  cd backend && uvicorn app.main:app --reload"
echo "  Frontend: cd frontend && npm run dev"
echo "  MLflow:   mlflow ui"
echo "  Docker:   docker-compose up --build"
