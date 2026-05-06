"""
Data Pipeline — Load, clean, and feature-engineer sales data.
"""
import pandas as pd
import numpy as np
from pathlib import Path
from loguru import logger


RAW_DIR = Path("ml/data/raw")
PROCESSED_DIR = Path("ml/data/processed")
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


def load_raw_data(filepath: str) -> pd.DataFrame:
    logger.info(f"Loading data from {filepath}")
    df = pd.read_csv(filepath, parse_dates=["sale_date"])
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    logger.info("Cleaning data...")
    df = df.dropna(subset=["sale_date", "revenue"])
    df = df[df["revenue"] >= 0]
    df = df[df["quantity"] >= 0]
    df = df.sort_values("sale_date").reset_index(drop=True)
    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    logger.info("Engineering features...")
    df["year"] = df["sale_date"].dt.year
    df["month"] = df["sale_date"].dt.month
    df["day_of_week"] = df["sale_date"].dt.dayofweek
    df["quarter"] = df["sale_date"].dt.quarter
    df["week_of_year"] = df["sale_date"].dt.isocalendar().week.astype(int)
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)
    df["is_month_start"] = df["sale_date"].dt.is_month_start.astype(int)
    df["is_month_end"] = df["sale_date"].dt.is_month_end.astype(int)

    # Rolling features per product
    df = df.sort_values(["product_id", "sale_date"])
    for window in [7, 14, 30]:
        df[f"rolling_revenue_{window}d"] = (
            df.groupby("product_id")["revenue"]
            .transform(lambda x: x.rolling(window, min_periods=1).mean())
        )
    df["revenue_lag_7"] = df.groupby("product_id")["revenue"].shift(7)
    df["revenue_lag_30"] = df.groupby("product_id")["revenue"].shift(30)

    return df


def generate_mock_data(n_products: int = 10, n_days: int = 730) -> pd.DataFrame:
    """Generate synthetic sales data for development."""
    logger.info(f"Generating mock data: {n_products} products, {n_days} days")
    np.random.seed(42)
    dates = pd.date_range(end=pd.Timestamp.today(), periods=n_days, freq="D")
    records = []
    regions = ["North", "South", "East", "West"]
    channels = ["direct", "online", "partner"]

    for prod_id in range(1, n_products + 1):
        base = np.random.uniform(5000, 50000)
        trend = np.random.uniform(0.001, 0.005)
        for i, date in enumerate(dates):
            seasonality = 1 + 0.2 * np.sin(2 * np.pi * i / 365)
            noise = np.random.normal(1, 0.1)
            revenue = base * (1 + trend * i) * seasonality * noise
            records.append({
                "product_id": prod_id,
                "sale_date": date,
                "revenue": round(max(0, revenue), 2),
                "quantity": max(1, int(revenue / np.random.uniform(50, 500))),
                "region": np.random.choice(regions),
                "channel": np.random.choice(channels),
            })

    return pd.DataFrame(records)


if __name__ == "__main__":
    df = generate_mock_data()
    df.to_csv(RAW_DIR / "sales_data.csv", index=False)
    logger.info(f"Raw data saved: {len(df)} rows")

    df = clean_data(df)
    df = engineer_features(df)
    df.to_parquet(PROCESSED_DIR / "sales_features.parquet", index=False)
    logger.info(f"Processed data saved: {len(df)} rows, {len(df.columns)} features")
