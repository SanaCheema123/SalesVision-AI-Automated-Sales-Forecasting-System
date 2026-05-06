import { AlertTriangle, CheckCircle, Info, XCircle, Bell } from 'lucide-react';

const mockAlerts = [
  { id: 1, title: 'Sales drop detected in Electronics category', message: 'Sales decreased by 18% compared to last week.', severity: 'high', is_read: false, alert_type: 'anomaly', time: '2h ago' },
  { id: 2, title: 'High demand predicted for Smartwatch', message: 'Expected sales increase of 25% in next 7 days.', severity: 'medium', is_read: false, alert_type: 'forecast', time: '5h ago' },
  { id: 3, title: 'Model training completed successfully', message: 'XGBoost model trained with 92.4% accuracy.', severity: 'low', is_read: true, alert_type: 'system', time: '1d ago' },
  { id: 4, title: 'Forecast Accuracy Warning', message: 'LSTM model MAPE exceeded 10% threshold for Region East.', severity: 'medium', is_read: false, alert_type: 'threshold', time: '2d ago' },
  { id: 5, title: 'Monthly Target Achieved', message: 'Q2 revenue target of $1.5M achieved ahead of schedule.', severity: 'low', is_read: true, alert_type: 'threshold', time: '3d ago' },
];

const severityConfig: Record<string, { icon: any; color: string; bg: string; badge: string }> = {
  high:   { icon: AlertTriangle, color: '#ef4444', bg: '#ef444420', badge: 'High' },
  medium: { icon: Info,          color: '#f59e0b', bg: '#f59e0b20', badge: 'Medium' },
  low:    { icon: CheckCircle,   color: '#10b981', bg: '#10b98120', badge: 'Low' },
  critical:{ icon: XCircle,     color: '#ef4444', bg: '#ef444420', badge: 'Critical' },
};

export default function AlertsPage() {
  return (
    <div className="p-6 space-y-6" style={{ background: '#0f1117', minHeight: '100%' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts & Notifications</h1>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Anomalies, thresholds, and system notifications</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: '#1a1d27', border: '1px solid #2a2d3e', color: '#9ca3af' }}>
          <Bell size={15} />
          <span>{mockAlerts.filter(a => !a.is_read).length} unread</span>
        </div>
      </div>

      <div className="space-y-3">
        {mockAlerts.map((alert) => {
          const cfg = severityConfig[alert.severity] ?? severityConfig.low;
          const Icon = cfg.icon;
          return (
            <div key={alert.id} className="flex gap-4 p-5 rounded-2xl" style={{ background: '#1a1d27', border: '1px solid #2a2d3e', opacity: alert.is_read ? 0.65 : 1 }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                <Icon size={18} style={{ color: cfg.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{alert.title}</p>
                  <span className="text-xs flex-shrink-0" style={{ color: '#6b7280' }}>{alert.time}</span>
                </div>
                <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{alert.message}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.badge}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full capitalize" style={{ background: '#2a2d3e', color: '#9ca3af' }}>{alert.alert_type}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}