import React, { useState } from 'react';
import { Droplets, ThermometerSun, Sun, Fan, AlertTriangle, ChevronDown, ChevronRight, Filter } from 'lucide-react';

// Mock alerts data with zones
const alerts = [
  {
    id: 1,
    type: 'moisture',
    zone: 'Zone A',
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
    zone: 'Zone 1',
    plant: 'Temperature is High',
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
    zone: 'Zone 2',
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
    zone: 'Zone B',
    plant: 'Red Chili',
    message: 'Low moisture level detected',
    value: '30%',
    threshold: '35%',
    timestamp: '1 hour ago',
    resolved: false,
    severity: 'warning'
  },
];

const Alerts = () => {
  const [expandedZones, setExpandedZones] = useState({});
  const [selectedZone, setSelectedZone] = useState('all');

  const toggleZone = (zone) => {
    setExpandedZones(prev => ({
      ...prev,
      [zone]: !prev[zone]
    }));
  };

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

  const zones = [...new Set(alerts.map(a => a.zone))];
  const filteredZones = selectedZone === 'all' ? zones : [selectedZone];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-neutral-900">Alerts</h2>
          <div className="px-2 py-1 text-sm bg-error/10 text-error rounded-full">
            {alerts.filter(a => !a.resolved).length} Active
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <span className="pl-3 pr-2">
              <Filter size={16} className="text-neutral-500" />
            </span>
            <select
              className="py-2 pl-0 pr-8 bg-transparent border-0 focus:ring-0 text-sm"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
            >
              <option value="all">All Zones</option>
              {zones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card divide-y divide-neutral-100">
        {filteredZones.map(zone => {
          const zoneOtherAlerts = alerts.filter(a => a.zone === zone && a.type !== 'moisture');
          const moistureAlerts = alerts.filter(a => a.zone === zone && a.type === 'moisture' && !a.resolved);

          return (
            <div key={zone} className="py-3 space-y-2">
              <div className="font-medium text-neutral-700">{zone}</div>

              {/* Other alerts always visible */}
              {zoneOtherAlerts.map(alert => (
                <div key={alert.id} className={`flex items-start gap-3 ${alert.resolved ? 'opacity-70' : ''}`}>
                  <div className="mt-1">{getAlertIcon(alert.type)}</div>
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
                </div>
              ))}

              {/* Moisture alerts under expandable */}
              {moistureAlerts.length > 0 && (
                <div>
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleZone(zone)}>
                    <div className="flex items-center gap-2">
                      {expandedZones[zone] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <span className="text-sm text-neutral-600">Show low soil moisture plants</span>
                    </div>
                  </div>

                  {expandedZones[zone] && (
                    <div className="ml-5 mt-2 space-y-2">
                      {moistureAlerts.map(alert => (
                        <div key={alert.id} className="flex items-center gap-2">
                          {getAlertIcon(alert.type)}
                          <span className="text-sm">{alert.plant} — {alert.value} (threshold: {alert.threshold})</span>
                          {getSeverityBadge(alert.severity, alert.resolved)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Alerts;