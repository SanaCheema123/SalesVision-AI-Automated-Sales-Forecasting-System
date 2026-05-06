"""
Model Training Pipeline
Trains Prophet, XGBoost, and LSTM models with MLflow tracking.
"""
import pandas as pd
import numpy as np
import mlflow
import mlflow.sklearn
import joblib
from pathlib import Path
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error
from sklearn.model_selection import TimeSeriesSplit
from xgboost import XGBRegressor
from loguru import logger
import warnings
warnings.filterwarnings("ignore")

PROCESSED_DIR = Path("ml/data/processed")
MODELS_DIR = Path("ml/models/saved")
MODELS_DIR.mkdir(parents=True, exist_ok=True)


def load_data():
    df = pd.read_parquet(PROCESSED_DIR / "sales_features.parquet")
    return df


def train_xgboost(df: pd.DataFrame, product_id: int = 1):
    logger.info(f"Training XGBoost for product {product_id}")
    product_df = df[df["product_id"] == product_id].copy().dropna()

    features = ["year", "month", "day_of_week", "quarter", "week_of_year",
                "is_weekend", "is_month_start", "is_month_end",
                "rolling_revenue_7d", "rolling_revenue_14d", "rolling_revenue_30d",
                "revenue_lag_7", "revenue_lag_30"]

    X = product_df[features].values
    y = product_df["revenue"].values

    split = int(len(X) * 0.8)
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    with mlflow.start_run(run_name=f"xgboost_product_{product_id}"):
        params = {
            "n_estimators": 200,
            "max_depth": 6,
            "learning_rate": 0.05,
            "subsample": 0.8,
            "colsample_bytree": 0.8,
        }
        model = XGBRegressor(**params, random_state=42)
        model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

        preds = model.predict(X_test)
        mape = mean_absolute_percentage_error(y_test, preds) * 100
        rmse = np.sqrt(mean_squared_error(y_test, preds))

        mlflow.log_params(params)
        mlflow.log_metrics({"mape": mape, "rmse": rmse})
        mlflow.sklearn.log_model(model, "model")

        model_path = MODELS_DIR / f"xgboost_product_{product_id}.joblib"
        joblib.dump(model, model_path)
        logger.info(f"XGBoost — MAPE: {mape:.2f}%, RMSE: {rmse:.2f}")

    return model, mape, rmse


def train_prophet(df: pd.DataFrame, product_id: int = 1):
    try:
        from prophet import Prophet
    except ImportError:
        logger.warning("Prophet not installed, skipping")
        return None, None, None

    logger.info(f"Training Prophet for product {product_id}")
    product_df = df[df["product_id"] == product_id][["sale_date", "revenue"]].copy()
    product_df.columns = ["ds", "y"]
    product_df = product_df.sort_values("ds")

    split = int(len(product_df) * 0.8)
    train, test = product_df.iloc[:split], product_df.iloc[split:]

    with mlflow.start_run(run_name=f"prophet_product_{product_id}"):
        model = Prophet(yearly_seasonality=True, weekly_seasonality=True, daily_seasonality=False)
        model.fit(train)

        future = model.make_future_dataframe(periods=len(test))
        forecast = model.predict(future)
        preds = forecast["yhat"].values[-len(test):]

        mape = mean_absolute_percentage_error(test["y"].values, preds) * 100
        rmse = np.sqrt(mean_squared_error(test["y"].values, preds))

        mlflow.log_metrics({"mape": mape, "rmse": rmse})
        model_path = MODELS_DIR / f"prophet_product_{product_id}.pkl"
        import pickle
        with open(model_path, "wb") as f:
            pickle.dump(model, f)

        logger.info(f"Prophet — MAPE: {mape:.2f}%, RMSE: {rmse:.2f}")

    return model, mape, rmse


if __name__ == "__main__":
    mlflow.set_tracking_uri("http://localhost:5000")
    mlflow.set_experiment("sales_forecasting")

    df = load_data()
    logger.info(f"Loaded {len(df)} rows")

    for product_id in df["product_id"].unique()[:3]:
        train_xgboost(df, int(product_id))
        train_prophet(df, int(product_id))

    logger.info("Training complete!")
