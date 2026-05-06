import api from './api';
import { Forecast } from '@/types';

export const forecastsApi = {
  list: (productId?: number) =>
    api.get<Forecast[]>('/forecasts/', { params: productId ? { product_id: productId } : {} }),

  create: (data: { product_id: number; model_name: string; granularity: string; horizon_days: number }) =>
    api.post<Forecast>('/forecasts/', data),

  get: (id: number) => api.get<Forecast>(`/forecasts/${id}`),
};
