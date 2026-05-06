import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/services/analytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#7c3aed', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

export default function AnalyticsPage() {
  const { data: trend } = useQuery({
    queryKey: ['monthly-trend'],
    queryFn: () => analyticsApi.monthlyTrend(new Date().getFullYear()).then(r => r.data),
  });

  const mockRegion = [
    { region: 'North', revenue: 420000 }, { region: 'South', revenue: 380000 },
    { region: 'East', revenue: 510000 }, { region: 'West', revenue: 330000 },
  ];

  const mockTrend = trend ?? [
    { month: 'Jan', revenue: 420000 }, { month: 'Feb', revenue: 380000 },
    { month: 'Mar', revenue: 510000 }, { month: 'Apr', revenue: 490000 },
    { month: 'May', revenue: 560000 }, { month: 'Jun', revenue: 530000 },
  ];

  const tooltipStyle = { background: '#1a1d27', border: '1px solid #2a2d3e', borderRadius: 12, color: '#e2e8f0' };

  return (
    <div className="p-6 space-y-6" style={{ background: '#0f1117', minHeight: '100%' }}>
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Sales performance and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl" style={{ background: '#1a1d27', border: '1px solid #2a2d3e' }}>
          <h2 className="text-base font-semibold text-white mb-5">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mockTrend}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${(v/1000).toFixed(1)}K`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl" style={{ background: '#1a1d27', border: '1px solid #2a2d3e' }}>
          <h2 className="text-base font-semibold text-white mb-5">Revenue by Region</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={mockRegion} dataKey="revenue" nameKey="region" cx="50%" cy="50%" outerRadius={100} innerRadius={55}
                label={({ region, percent }) => `${region} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#6b7280' }}
              >
                {mockRegion.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${(v/1000).toFixed(0)}K`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}