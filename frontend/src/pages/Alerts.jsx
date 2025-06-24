import React, { useEffect, useState } from 'react';
import { Droplets, ThermometerSun, Sun, Wind, AlertTriangle } from 'lucide-react';
import api from '../api/api';

const zoneIds = ['zone1', 'zone2', 'zone3', 'zone4'];

export async function getAlertCount() {
  const zoneIds = ['zone1', 'zone2', 'zone3', 'zone4'];
  let systemThresholds = {};
  try {
    const sysRes = await api.get('/system/thresholds');
    systemThresholds = sysRes.data.thresholds || sysRes.data;
  } catch {}

  let count = 0;

  for (const zoneId of zoneIds) {
    // 1. Fetch plants in zone
    let plants = [];
    try {
      const res = await api.get(`/zones/${zoneId}/plants`);
      plants = res.data.plants || [];
    } catch {}

    // 2. Fetch latest sensor log for zone
    let zoneLog = null;
    try {
      const res = await api.get(`/logs/sensors?zoneId=${zoneId}&limit=1`);
      zoneLog = Array.isArray(res.data) ? res.data[0] : res.data;
    } catch {}

    // 3. Zone-level alerts (temperature, airQuality, light)
    if (zoneLog && zoneLog.zoneSensors) {
      ['temperature', 'airQuality', 'light'].forEach(sensorType => {
        const sensorKey = sensorType === 'temperature' ? 'temp' : sensorType;
        const value = zoneLog.zoneSensors[sensorKey];
        const threshold = systemThresholds[sensorType] || {};
        if (value !== undefined && threshold.min !== undefined && threshold.max !== undefined) {
          if (value < threshold.min || value > threshold.max) {
            count++;
          }
        }
      });
    }

    // 4. Plant-level alerts (moisture)
    if (zoneLog && Array.isArray(zoneLog.soilMoistureByPin)) {
      for (const plant of plants) {
        // Fetch plant thresholds
        let plantThreshold = {};
        try {
          const res = await api.get(`/plants/${plant.plantId}`);
          plantThreshold = res.data.thresholds?.moisture || {};
        } catch {}

        const pinData = zoneLog.soilMoistureByPin.find(s => String(s.pin) === String(plant.moisturePin));
        const value = pinData ? pinData.soilMoisture : undefined;
        if (value !== undefined && plantThreshold.min !== undefined && plantThreshold.max !== undefined) {
          if (value < plantThreshold.min || value > plantThreshold.max) {
            count++;
          }
        }
      }
    }
  }

  return count;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch thresholds and sensor data
  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      let systemThresholds = {};
      try {
        // Fetch system thresholds
        const sysRes = await api.get('/system/thresholds');
        systemThresholds = sysRes.data.thresholds || sysRes.data;
      } catch {}

      let allAlerts = [];

      for (const zoneId of zoneIds) {
        // 1. Fetch plants in zone
        let plants = [];
        try {
          const res = await api.get(`/zones/${zoneId}/plants`);
          plants = res.data.plants || [];
        } catch {}

        // 2. Fetch latest sensor log for zone
        let zoneLog = null;
        try {
          const res = await api.get(`/logs/sensors?zoneId=${zoneId}&limit=1`);
          zoneLog = Array.isArray(res.data) ? res.data[0] : res.data;
        } catch {}

        // 3. Zone-level alerts (temperature, airQuality, light)
        if (zoneLog && zoneLog.zoneSensors) {
          ['temperature', 'airQuality', 'light'].forEach(sensorType => {
            const sensorKey = sensorType === 'temperature' ? 'temp' : sensorType;
            const value = zoneLog.zoneSensors[sensorKey];
            const threshold = systemThresholds[sensorType] || {};
            if (value !== undefined && threshold.min !== undefined && threshold.max !== undefined) {
              if (value < threshold.min) {
                allAlerts.push({
                  type: sensorType,
                  zone: zoneId,
                  message: `${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} is below minimum threshold`,
                  value: value,
                  threshold: threshold.min,
                  severity: 'critical'
                });
              } else if (value > threshold.max) {
                allAlerts.push({
                  type: sensorType,
                  zone: zoneId,
                  message: `${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} exceeds maximum threshold`,
                  value: value,
                  threshold: threshold.max,
                  severity: 'warning'
                });
              }
            }
          });
        }

        // 4. Plant-level alerts (moisture)
        if (zoneLog && Array.isArray(zoneLog.soilMoistureByPin)) {
          for (const plant of plants) {
            // Fetch plant thresholds
            let plantThreshold = {};
            try {
              const res = await api.get(`/plants/${plant.plantId}`);
              plantThreshold = res.data.thresholds?.moisture || {};
            } catch {}

            const pinData = zoneLog.soilMoistureByPin.find(s => String(s.pin) === String(plant.moisturePin));
            const value = pinData ? pinData.soilMoisture : undefined;
            if (value !== undefined && plantThreshold.min !== undefined && plantThreshold.max !== undefined) {
              if (value < plantThreshold.min) {
                allAlerts.push({
                  type: 'moisture',
                  zone: zoneId,
                  plant: plant.name,
                  message: 'Low moisture level detected',
                  value: `${value}%`,
                  threshold: `${plantThreshold.min}%`,
                  severity: 'critical'
                });
              } else if (value > plantThreshold.max) {
                allAlerts.push({
                  type: 'moisture',
                  zone: zoneId,
                  plant: plant.name,
                  message: 'High moisture level detected',
                  value: `${value}%`,
                  threshold: `${plantThreshold.max}%`,
                  severity: 'warning'
                });
              }
            }
          }
        }
      }

      setAlerts(allAlerts);
      setLoading(false);
    };

    fetchAlerts();
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'moisture': return <Droplets size={18} className="text-accent" />;
      case 'temperature': return <ThermometerSun size={18} className="text-warning" />;
      case 'light': return <Sun size={18} className="text-warning" />;
      case 'airQuality': return <Wind size={18} className="text-gray-500"/>;
      default: return <AlertTriangle size={18} className="text-error" />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-1 text-xs font-medium bg-error/10 text-error rounded-full">Critical</span>;
      case 'warning':
        return <span className="px-2 py-1 text-xs font-medium bg-warning/10 text-warning-dark rounded-full">Warning</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">Info</span>;
    }
  };

  const getAlertColorClass = (type) => {
    switch (type) {
      case 'moisture': return 'border-l-4 border-accent bg-accent/5';
      case 'temperature': return 'border-l-4 border-warning bg-warning/5';
      case 'light': return 'border-l-4 border-yellow-400 bg-yellow-100/40';
      case 'airQuality': return 'border-l-4 border-secondary bg-secondary/5';
      default: return 'border-l-4 border-error bg-error/5';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold text-neutral-900">Alerts</h2>
        <div className="px-2 py-1 text-sm bg-error/10 text-error rounded-full">
          {alerts.length} Active
        </div>
      </div>
      <div className="card divide-y divide-neutral-100">
        {loading ? (
          <div className="p-4 text-neutral-500">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="p-4 text-neutral-500">No active alerts.</div>
        ) : (
          alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 py-3 rounded-md mb-2 ${getAlertColorClass(alert.type)}`}
            >
              <div className="mt-1">{getAlertIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-medium">
                    {alert.plant
                      ? <>Plant: <span className="font-semibold">{alert.plant}</span> <span className="text-xs text-neutral-400">({alert.zone})</span></>
                      : <>Zone: <span className="font-semibold">{alert.zone}</span></>
                    }
                  </span>
                  {getSeverityBadge(alert.severity)}
                </div>
                <p className="text-neutral-800 mb-1">{alert.message}</p>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <span>Value: <strong className={alert.severity === 'critical' ? 'text-error' : ''}>{alert.value}</strong></span>
                  <span>Threshold: {alert.threshold}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
