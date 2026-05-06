export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'analyst';
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  region: string;
  unit_price: number;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Sale {
  id: number;
  product_id: number;
  sale_date: string;
  quantity: number;
  revenue: number;
  region: string;
  channel: string;
}

export interface ForecastDataPoint {
  date: string;
  predicted: number;
  lower_bound: number;
  upper_bound: number;
}

export interface Forecast {
  id: number;
  product_id: number;
  model_name: string;
  granularity: string;
  horizon_days: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  start_date?: string;
  end_date?: string;
  mape?: number;
  rmse?: number;
  forecast_data?: ForecastDataPoint[];
  mlflow_run_id?: string;
  created_at: string;
}

export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  alert_type: string;
  created_at: string;
}

export interface AnalyticsSummary {
  total_revenue: number;
  total_quantity: number;
  avg_daily_revenue: number;
  growth_rate: number;
  period_days: number;
}
