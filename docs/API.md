# SalesForecastAI API Documentation

Base URL: `http://localhost:8000/api/v1`

## Authentication

### POST /auth/login
Login with email and password.

**Request:**
```json
{ "email": "user@example.com", "password": "yourpassword" }
```

**Response:**
```json
{ "access_token": "eyJ...", "token_type": "bearer", "user": { ... } }
```

All protected routes require: `Authorization: Bearer <token>`

---

## Forecasts

### POST /forecasts/
Create and run a new forecast.

**Request:**
```json
{
  "product_id": 1,
  "model_name": "ensemble",
  "granularity": "monthly",
  "horizon_days": 90
}
```

**Models:** `prophet` | `xgboost` | `lstm` | `ensemble`

### GET /forecasts/
List all forecasts. Optional: `?product_id=1`

### GET /forecasts/{id}
Get forecast details and predicted data points.

---

## Analytics

### GET /analytics/summary
Returns total revenue, quantity, avg daily revenue.

### GET /analytics/revenue-by-region
Revenue breakdown by geographic region.

### GET /analytics/monthly-trend
Monthly revenue trend for a given year (`?year=2024`).

---

## Products

### GET /products/ — List all products
### POST /products/ — Create product
### GET /products/{id} — Get product
### PUT /products/{id} — Update product
### DELETE /products/{id} — Deactivate product

---

## Sales

### GET /sales/ — List sales (filterable by date, region, product)
### POST /sales/ — Record a sale
### POST /sales/bulk — Bulk import sales
### GET /sales/export — Download CSV

---

## Alerts

### GET /alerts/ — List alerts (filterable by severity, is_read)
### PATCH /alerts/{id}/read — Mark as read
### DELETE /alerts/{id} — Dismiss alert
