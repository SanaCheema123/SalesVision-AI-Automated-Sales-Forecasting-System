import { useQuery } from '@tanstack/react-query';
import { TrendingUp, DollarSign, ShoppingCart, Target, ArrowUpRight, ArrowRight } from 'lucide-react';
import { analyticsApi } from '@/services/analytics';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function StatCard({ title, value, icon: Icon, gradient, change, sub }: any) {
  return (
    <div className="card flex items-start justify-between">
      <div>
        <p className="text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {change && (
          <p className="text-xs mt-1 flex items-center gap-1 text-emerald-400">
            <ArrowUpRight size={12} /> {change}
          </p>
        )}
      </div>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: gradient }}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  );
}

const COLORS = ['#7c3aed', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

const pieData = [
  { name: 'Electronics', value: 38.8, amount: '$98,540' },
  { name: 'Clothing', value: 26.5, amount: '$67,230' },
  { name: 'Home & Living', value: 18.0, amount: '$45,780' },
  { name: 'Beauty', value: 10.0, amount: '$25,340' },
  { name: 'Others', value: 6.7, amount: '$17,980' },
];

const topProducts = [
  { name: 'Smartphone X', category: 'Electronics', actual: '$28,540', forecast: '$35,620', growth: 24.8 },
  { name: 'Laptop Pro', category: 'Electronics', actual: '$22,350', forecast: '$27,890', growth: 24.8 },
  { name: 'Wireless Headphones', category: 'Electronics', actual: '$15,620', forecast: '$18,540', growth: 18.7 },
  { name: 'Running Shoes', category: 'Clothing', actual: '$12,340', forecast: '$15,230', growth: 23.4 },
  { name: 'Smart Watch', category: 'Electronics', actual: '$10,230', forecast: '$12,640', growth: 23.5 },
];

const alerts = [
  { icon: '↓', color: '#ef4444', bg: '#ef444420', title: 'Sales drop detected in Electronics category', desc: 'Sales decreased by 18% compared to last week.', time: '2h ago', badge: 'High', badgeColor: '#ef4444' },
  { icon: '↑', color: '#f59e0b', bg: '#f59e0b20', title: 'High demand predicted for Smartwatch', desc: 'Expected sales increase of 25% in next 7 days.', time: '5h ago', badge: 'Medium', badgeColor: '#f59e0b' },
  { icon: '✓', color: '#10b981', bg: '#10b98120', title: 'Model training completed successfully', desc: 'XGBoost model trained with 92.4% accuracy.', time: '1d ago', badge: 'Low', badgeColor: '#10b981' },
];

export default function DashboardPage() {
  const { data: summary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => analyticsApi.summary().then(r => r.data),
  });
  const { data: trend } = useQuery({
    queryKey: ['monthly-trend'],
    queryFn: () => analyticsApi.monthlyTrend(new Date().getFullYear()).then(r => r.data),
  });

  const stats = [
    { title: 'Total Sales', value: '$253,870', icon: ShoppingCart, gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)', change: '12.5% vs last month' },
    { title: 'Forecast Accuracy', value: '92.4%', icon: Target, gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', change: '4.3% vs last month' },
    { title: 'Total Revenue', value: '$178,540', icon: DollarSign, gradient: 'linear-gradient(135deg, #10b981, #059669)', change: '8.7% vs last month' },
    { title: 'Growth Rate', value: '18.2%', icon: TrendingUp, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', change: '3.1% vs last month' },
  ];

  const chartData = [
    { date: 'May 10', actual: 28000, predicted: 22000 },
    { date: 'May 15', actual: 35000, predicted: 30000 },
    { date: 'May 20', actual: 32000, predicted: 28000 },
    { date: 'May 25', actual: 45000, predicted: 40000 },
    { date: 'May 30', actual: 38000, predicted: 35000 },
    { date: 'Jun 05', actual: 52000, predicted: 48000 },
    { date: 'Jun 10', actual: 58000, predicted: 54000 },
  ];

  return (
    <div className="space-y-6 p-6" style={{ background: '#0f1117', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Welcome back, Admin! Here's your sales overview.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: '#1a1d27', border: '1px solid #2a2d3e', color: '#e2e8f0' }}>
          <span style={{ color: '#6b7280' }}>📅</span> May 10, 2024 - Jun 10, 2024
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Line Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Actual vs Predicted Sales</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
                <span className="w-6 h-0.5 inline-block" style={{ background: '#7c3aed' }} /> Actual Sales
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
                <span className="w-6 h-0.5 inline-block border-t-2 border-dashed" style={{ borderColor: '#06b6d4' }} /> Predicted Sales
              </div>
              <span className="text-xs px-3 py-1 rounded-lg font-medium" style={{ background: '#2a2d3e', color: '#e2e8f0' }}>30 Days ▾</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d3e', borderRadius: 12, color: '#e2e8f0' }}
                formatter={(v: number) => [`$${(v/1000).toFixed(1)}K`]}
              />
              <Line type="monotone" dataKey="actual" stroke="#7c3aed" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="predicted" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">Sales by Category</h2>
          <div className="flex justify-center mb-3">
            <div className="relative">
              <PieChart width={160} height={160}>
                <Pie data={pieData} cx={75} cy={75} innerRadius={50} outerRadius={75} dataKey="value" stroke="none">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-white">$253,870</span>
                <span className="text-xs" style={{ color: '#6b7280' }}>Total</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {pieData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: COLORS[i] }} />
                  <span style={{ color: '#9ca3af' }}>{item.name}</span>
                </div>
                <span className="font-semibold text-white">{item.amount} <span style={{ color: '#6b7280' }}>({item.value}%)</span></span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-xs w-full text-center flex items-center justify-center gap-1" style={{ color: '#7c3aed' }}>
            View Full Report <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Products Table */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Top Products Forecast</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: '#6b7280' }}>
                <th className="text-left pb-3 font-medium">Product</th>
                <th className="text-left pb-3 font-medium">Category</th>
                <th className="text-right pb-3 font-medium">Actual Sales</th>
                <th className="text-right pb-3 font-medium">Forecast (30 Days)</th>
                <th className="text-right pb-3 font-medium">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#2a2d3e' }}>
              {topProducts.map(p => (
                <tr key={p.name}>
                  <td className="py-3 font-medium text-white">{p.name}</td>
                  <td className="py-3" style={{ color: '#9ca3af' }}>{p.category}</td>
                  <td className="py-3 text-right text-white">{p.actual}</td>
                  <td className="py-3 text-right text-white">{p.forecast}</td>
                  <td className="py-3 text-right font-semibold text-emerald-400">↑ {p.growth}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-4 text-xs flex items-center gap-1" style={{ color: '#7c3aed' }}>
            View All Products <ArrowRight size={12} />
          </button>
        </div>

        {/* Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Alerts & Notifications</h2>
            <button className="text-xs font-medium" style={{ color: '#7c3aed' }}>View All</button>
          </div>
          <div className="space-y-4">
            {alerts.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0" style={{ background: a.bg, color: a.color }}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-white leading-snug">{a.title}</p>
                    <span className="text-xs flex-shrink-0" style={{ color: '#6b7280' }}>{a.time}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{a.desc}</p>
                  <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded mt-1" style={{ background: a.badgeColor + '20', color: a.badgeColor }}>
                    {a.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}