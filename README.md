# 🚀 SalesForecastAI — Automated Sales Forecasting System
<img width="1280" height="698" alt="WhatsApp Image 2026-05-06 at 4 49 27 PM" src="https://github.com/user-attachments/assets/40f7d58a-2f11-4609-83eb-bb31ec0ca1a7" />

A full-stack, production-ready automated sales forecasting platform powered by machine learning.

## 🏗️ Architecture

```
sales-forecasting/
├── backend/          # FastAPI REST API
├── frontend/         # React + TypeScript SPA
├── ml/               # ML pipeline (Prophet, XGBoost, LSTM)
├── docker/           # Docker & docker-compose configs
├── docs/             # API & system documentation
└── scripts/          # Dev & deploy utility scripts
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### 1. Clone & Setup
```bash
git clone <repo-url>
cd sales-forecasting
cp .env.example .env
```

### 2. Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. ML Pipeline
```bash
cd ml
pip install -r requirements.txt
python scripts/train_models.py
```

### 5. Docker (All-in-one)
```bash
docker-compose up --build
```

## 📡 API Docs
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🧠 ML Models
- **Prophet**: Time-series decomposition & seasonality
- **XGBoost**: Feature-rich gradient boosting
- **LSTM**: Deep learning for sequential patterns
- **Ensemble**: Weighted combination of all models

## 🔐 Auth
JWT-based authentication with role-based access control (Admin, Manager, Analyst).

## 📊 Features
- Real-time sales forecasting (daily/weekly/monthly/quarterly)
- Multi-product, multi-region support
- Anomaly detection & alerting
- What-if scenario simulation
- Exportable reports (PDF, CSV, Excel)
- MLflow experiment tracking
- Automated model retraining pipeline
