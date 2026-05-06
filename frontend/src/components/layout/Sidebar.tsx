import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Package, BarChart3, Bell, Settings, LogOut, Brain, Users } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import clsx from 'clsx';

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/forecasts', icon: TrendingUp, label: 'Forecast' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { logout, user } = useAuthStore();

  return (
    <aside className="w-64 flex flex-col" style={{ background: '#13151f', borderRight: '1px solid #2a2d3e' }}>
      <div className="p-6" style={{ borderBottom: '1px solid #2a2d3e' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-white">SalesVision AI</div>
            <div className="text-xs" style={{ color: '#6b7280' }}>Sales Forecasting System</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive ? 'text-white' : 'hover:text-white'
              )
            }
            style={({ isActive }) => isActive
              ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white' }
              : { color: '#6b7280' }
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mx-4 mb-4 p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #1e1b4b, #2e1065)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-white text-sm font-semibold">Pro Plan</span>
        </div>
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>Valid till 30 Dec 2024</p>
        <button className="w-full text-xs font-semibold py-1.5 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
          Upgrade Plan
        </button>
      </div>

      <div className="p-4" style={{ borderTop: '1px solid #2a2d3e' }}>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm w-full px-3 py-2 rounded-xl transition-colors hover:text-white"
          style={{ color: '#6b7280' }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}