import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import Layout from '@/components/layout/Layout';
import DashboardPage from '@/pages/DashboardPage';
import ForecastsPage from '@/pages/ForecastsPage';
import ProductsPage from '@/pages/ProductsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import AlertsPage from '@/pages/AlertsPage';
import LoginPage from '@/pages/LoginPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="forecasts" element={<ForecastsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
      </Route>
    </Routes>
  );
}
