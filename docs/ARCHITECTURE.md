# System Architecture

## Overview

```
┌─────────────┐     HTTPS      ┌──────────────────────┐
│   Browser   │ ◄────────────► │  Nginx (Frontend)    │
│  React SPA  │                │  Static + Reverse    │
└─────────────┘                │  Proxy               │
                               └──────────┬───────────┘
                                          │ /api
                               ┌──────────▼───────────┐
                               │  FastAPI Backend      │
                               │  (Uvicorn + Gunicorn) │
                               └──────┬───────┬────────┘
                                      │       │
                           ┌──────────▼──┐  ┌─▼────────┐
                           │ PostgreSQL  │  │  Redis   │
                           │ (Primary DB)│  │ (Cache + │
                           └─────────────┘  │  Queue)  │
                                            └─────┬────┘
                                                  │
                                    ┌─────────────▼──────┐
                                    │  Celery Workers    │
                                    │  (ML Training,     │
                                    │   Retraining,      │
                                    │   Alert Engine)    │
                                    └──────────┬─────────┘
                                               │
                                    ┌──────────▼─────────┐
                                    │  MLflow Server     │
                                    │  (Experiment       │
                                    │   Tracking)        │
                                    └────────────────────┘
```

## ML Pipeline

```
Raw Data → Data Pipeline → Feature Engineering
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
                 Prophet         XGBoost          LSTM
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                             Ensemble Model
                             (Weighted Avg)
                                    │
                             ┌──────▼──────┐
                             │  MLflow     │
                             │  Tracking   │
                             └─────────────┘
```
