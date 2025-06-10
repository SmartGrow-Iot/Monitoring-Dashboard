import React from 'react';
import { Bell, Filter, Droplets, ThermometerSun, Sun, Fan, AlertTriangle } from 'lucide-react';

// Mock alerts data
const alerts = [
  {
    id: 1,
    type: 'moisture',
    plant: 'Eggplant',
    message: 'Low moisture level detected',
    value: '28%',
    threshold: '35%',
    timestamp: '2 hours ago',
    resolved: false,
    severity: 'warning'
  },
  {
    id: 2,
    type: 'temperature',
    plant: 'Red Chili',
    message: 'Temperature exceeded threshold',
    value: '31°C',
    threshold: '29°C',
    timestamp: '5 hours ago',
    resolved: false,
    severity: 'critical'
  },
  {
    id: 3,
    type: 'sensor',
    plant: 'System',
    message: 'Fan sensor not responding',
    value: 'Error',
    threshold: 'N/A',
    timestamp: 'Yesterday',
    resolved: true,
    severity: 'critical'
  },
  {
    id: 4,
    type: 'moisture',
    plant: 'Red Chili',
    message: 'Moisture level normalized',
    value: '45%',
    threshold: '30-60%',
    timestamp: '2 days ago',
    resolved: true,
    severity: 'info'
  },
];

const Alerts = () => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'moisture':
        return <Droplets size={18} className="text-accent" />;
      case 'temperature':
        return <ThermometerSun size={18} className="text-warning" />;
      case 'light':
        return <Sun size={18} className="text-warning" />;
      case 'fan':
        return <Fan size={18} className="text-secondary" />;
      case 'sensor':
      default:
        return <AlertTriangle size={18} className="text-error" />;
    }
  };

  const getSeverityBadge = (severity, resolved) => {
    if (resolved) {
      return <span className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">Resolved</span>;
    }

    switch (severity) {
      case 'critical':
        return <span className="px-2 py-1 text-xs font-medium bg-error/10 text-error rounded-full">Critical</span>;
      case 'warning':
        return <span className="px-2 py-1 text-xs font-medium bg-warning/10 text-warning-dark rounded-full">Warning</span>;
      case 'info':
        return <span className="px-2 py-1 text-xs font-medium bg-accent/10 text-accent-dark rounded-full">Info</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">Info</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-neutral-900">Alerts</h2>
          <div className="px-2 py-1 text-sm bg-error/10 text-error rounded-full">
            2 Active
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <span className="pl-3 pr-2">
              <Filter size={16} className="text-neutral-500" />
            </span>
            <select className="py-2 pl-0 pr-8 bg-transparent border-0 focus:ring-0 text-sm">
              <option value="all">All Alerts</option>
              <option value="active">Active Only</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts list */}
      <div className="card divide-y divide-neutral-100">
        {alerts.map(alert => (
          <div 
            key={alert.id} 
            className={`py-4 ${alert.resolved ? 'opacity-70' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-medium">{alert.plant}</span>
                  {getSeverityBadge(alert.severity, alert.resolved)}
                </div>
                <p className="text-neutral-800 mb-1">{alert.message}</p>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <span>Value: <strong className={alert.severity === 'critical' ? 'text-error' : ''}>{alert.value}</strong></span>
                  <span>Threshold: {alert.threshold}</span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-sm text-neutral-500">{alert.timestamp}</span>
                {!alert.resolved && (
                  <button className="mt-2 text-sm text-primary hover:text-primary-dark font-medium">
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification settings teaser */}
      <div className="card bg-primary-light/5 border border-primary-light/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary-light/10 rounded-full">
            <Bell size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Notification Settings</h3>
            <p className="text-neutral-700 mb-3">
              Configure how and when you receive alerts about your plants.
            </p>
            <button className="btn btn-primary">
              Configure Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
