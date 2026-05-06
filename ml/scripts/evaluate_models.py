"""
Model Evaluation & Comparison Report
"""
import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error, r2_score
from loguru import logger


MODELS_DIR = Path("ml/models/saved")
PROCESSED_DIR = Path("ml/data/processed")


def evaluate_all_models():
    df = pd.read_parquet(PROCESSED_DIR / "sales_features.parquet")
    results = []

    for model_file in MODELS_DIR.glob("xgboost_*.joblib"):
        product_id = int(model_file.stem.split("_")[-1])
        product_df = df[df["product_id"] == product_id].copy().dropna()

        features = ["year", "month", "day_of_week", "quarter", "week_of_year",
                    "is_weekend", "is_month_start", "is_month_end",
                    "rolling_revenue_7d", "rolling_revenue_14d", "rolling_revenue_30d",
                    "revenue_lag_7", "revenue_lag_30"]

        X = product_df[features].values
        y = product_df["revenue"].values
        split = int(len(X) * 0.8)
        X_test, y_test = X[split:], y[split:]

        model = joblib.load(model_file)
        preds = model.predict(X_test)
        results.append({
            "product_id": product_id,
            "model": "xgboost",
            "mape": round(mean_absolute_percentage_error(y_test, preds) * 100, 3),
            "rmse": round(np.sqrt(mean_squared_error(y_test, preds)), 2),
            "r2": round(r2_score(y_test, preds), 4),
        })

    results_df = pd.DataFrame(results)
    logger.info(f"\n{results_df.to_string()}")
    results_df.to_csv("ml/model_evaluation_report.csv", index=False)
    return results_df


if __name__ == "__main__":
    evaluate_all_models()
