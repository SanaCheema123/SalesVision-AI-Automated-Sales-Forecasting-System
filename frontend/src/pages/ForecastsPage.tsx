import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { forecastsApi } from '@/services/forecasts';
import { Forecast } from '@/types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import toast from 'react-hot-toast';

const statusIcon: Record<string, JSX.Element> = {
  completed: <CheckCircle size={13} style={{ color: '#10b981' }} />,
  pending:   <Clock size={13} style={{ color: '#f59e0b' }} />,
  failed:    <XCircle size={13} style={{ color: '#ef4444' }} />,
  running:   <Clock size={13} style={{ color: '#7c3aed' }} />,
};

export default function ForecastsPage() {
  const [selected, setSelected] = useState<Forecast | null>(null);
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: forecasts = [] } = useQuery({
    queryKey: ['forecasts'],
    queryFn: () => forecastsApi.list().then(r => r.data),
  });

  const create = useMutation({
    mutationFn: forecastsApi.create,
    onSuccess: (res) => { qc.invalidateQueries({ queryKey: ['forecasts'] }); setSelected(res.data); setShowForm(false); toast.success('Forecast generated!'); },
    onError: () => toast.error('Failed to create forecast'),
  });

  const mockForecast = Array.from({ length: 90 }, (_, i) => ({
    date: new Date(Date.now() + i * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    predicted: 50000 + Math.random() * 10000 + i * 200,
    lower_bound: 42000 + Math.random() * 5000 + i * 150,
    upper_bound: 58000 + Math.random() * 10000 + i * 250,
  })).filter((_, i) => i % 3 === 0);

  const displayForecasts = forecasts.length === 0 ? [{
    id: 1, product_id: 1, model_name: 'ensemble', granularity: 'monthly',
    horizon_days: 90, status: 'completed', mape: 4.2, rmse: 1850,
    start_date: '2024-01-01', end_date: '2024-04-01', created_at: new Date().toISOString()
  } as Forecast] : forecasts;

  return (
    <div className="p-6 space-y-6" style={{ background: '#0f1117', minHeight: '100%' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Forecasts</h1>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>AI-powered sales predictions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
        >
          <Plus size={16} /> New Forecast
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-2xl" style={{ background: '#1a1d27', border: '1px solid #7c3aed' }}>
          <h3 className="font-semibold mb-4 text-white">Create New Forecast</h3>
          <div className="grid grid-cols-2 gap-4">
            {[{ label: 'Product ID', name: 'product_id', type: 'number', placeholder: '1' }, { label: 'Horizon (days)', name: 'horizon_days', type: 'number', placeholder: '90' }].map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#e2e8f0' }}>{f.label}</label>
                <input id={f.name} type={f.type} defaultValue={f.placeholder} className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" style={{ background: '#0f1117', border: '1px solid #2a2d3e', color: '#e2e8f0' }} />
              </div>
            ))}
            {[{ label: 'Model', id: 'model', opts: ['ensemble', 'prophet', 'xgboost', 'lstm'] }, { label: 'Granularity', id: 'granularity', opts: ['monthly', 'weekly', 'daily'] }].map(s => (
              <div key={s.id}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#e2e8f0' }}>{s.label}</label>
                <select id={s.id} className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" style={{ background: '#0f1117', border: '1px solid #2a2d3e', color: '#e2e8f0' }}>
                  {s.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }} onClick={() => create.mutate({ product_id: 1, model_name: 'ensemble', granularity: 'monthly', horizon_days: 90 })} disabled={create.isPending}>
              {create.isPending ? 'Generating...' : 'Generate Forecast'}
            </button>
            <button className="px-5 py-2 rounded-xl text-sm font-semibold" style={{ background: '#2a2d3e', color: '#e2e8f0' }} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="space-y-3">
          {displayForecasts.map((f) => (
            <div key={f.id} onClick={() => setSelected(f)} className="p-4 rounded-2xl cursor-pointer transition-all" style={{ background: '#1a1d27', border: `1px solid ${selected?.id === f.id ? '#7c3aed' : '#2a2d3e'}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-white">Forecast #{f.id}</span>
                <div className="flex items-center gap-1">{statusIcon[f.status]}<span className="text-xs capitalize" style={{ color: '#9ca3af' }}>{f.status}</span></div>
              </div>
              <div className="text-xs space-y-1" style={{ color: '#9ca3af' }}>
                <div>Model: <span className="font-medium text-white capitalize">{f.model_name}</span></div>
                <div>Horizon: <span className="font-medium text-white">{f.horizon_days}d</span></div>
                {f.mape && <div>MAPE: <span className="font-medium text-emerald-400">{f.mape}%</span></div>}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 p-6 rounded-2xl" style={{ background: '#1a1d27', border: '1px solid #2a2d3e' }}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} style={{ color: '#7c3aed' }} />
            <h2 className="text-base font-semibold text-white">Forecast Visualization</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockForecast}>
              <defs>
                <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d3e', borderRadius: 12, color: '#e2e8f0' }} formatter={(v: number) => [`$${(v/1000).toFixed(1)}K`]} />
              <Area type="monotone" dataKey="upper_bound" stroke="none" fill="#7c3aed" fillOpacity={0.07} />
              <Area type="monotone" dataKey="predicted" stroke="#7c3aed" strokeWidth={2.5} fill="url(#fg)" />
              <ReferenceLine x={mockForecast[0]?.date} stroke="#6b7280" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4 text-xs" style={{ color: '#9ca3af' }}>
            <div className="flex items-center gap-2"><div className="w-4 h-0.5 rounded" style={{ background: '#7c3aed' }} />Predicted</div>
            <div className="flex items-center gap-2"><div className="w-4 h-3 rounded" style={{ background: '#7c3aed', opacity: 0.2 }} />Confidence Interval</div>
          </div>
        </div>
      </div>
    </div>
  );
}