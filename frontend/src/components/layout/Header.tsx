import { Bell, Search, Moon, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function Header() {
  const { user } = useAuthStore();
  return (
    <header className="px-6 py-4 flex items-center justify-between" style={{ background: '#13151f', borderBottom: '1px solid #2a2d3e' }}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={15} style={{ color: '#6b7280' }} />
        <input
          className="pl-9 pr-4 py-2 text-sm rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-violet-500"
          style={{ background: '#1a1d27', border: '1px solid #2a2d3e', color: '#e2e8f0' }}
          placeholder="Search..."
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-xl transition-colors" style={{ color: '#9ca3af' }}>
          <Moon size={18} />
        </button>
        <button className="relative p-2 rounded-xl transition-colors" style={{ color: '#9ca3af' }}>
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">3</span>
        </button>
        <div className="flex items-center gap-2 pl-3" style={{ borderLeft: '1px solid #2a2d3e' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            {user?.full_name?.[0] ?? 'A'}
          </div>
          <div className="text-sm">
            <div className="font-semibold text-white">{user?.full_name ?? 'Admin User'}</div>
            <div className="text-xs capitalize" style={{ color: '#6b7280' }}>{user?.role ?? 'Administrator'}</div>
          </div>
          <ChevronDown size={14} style={{ color: '#6b7280' }} />
        </div>
      </div>
    </header>
  );
}