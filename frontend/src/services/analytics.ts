import api from './api';

export const analyticsApi = {
  summary: (startDate?: string, endDate?: string) =>
    api.get('/analytics/summary', { params: { start_date: startDate, end_date: endDate } }),

  revenueByRegion: (startDate: string, endDate: string) =>
    api.get('/analytics/revenue-by-region', { params: { start_date: startDate, end_date: endDate } }),

  monthlyTrend: (year: number) =>
    api.get('/analytics/monthly-trend', { params: { year } }),
};
