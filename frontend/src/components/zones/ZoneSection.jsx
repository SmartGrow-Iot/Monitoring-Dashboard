import React, { useState, useEffect, useContext } from 'react';
import {
  Droplets,
  ThermometerSun,
  Sun,
  ChevronDown,
  ChevronUp,
  Wind,
  Plus
} from 'lucide-react';
import PlantCard from '../plants/PlantCard';
import SensorReading from '../ui/SensorReading';
import Toggle from '../ui/Toggle';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

const getZoneStatus = (plants) => {
  const statuses = plants.map(p => p.status);
  if (statuses.includes('needsWater') || statuses.includes('tooHot') || statuses.includes('tooCold') || statuses.includes('lowLight')) {
    return 'warning';
  }
  return 'healthy';
};

const ZoneSection = ({
  zoneId, zoneName, plants, onEditThreshold, onEditPlant, onDeletePlant, onAddPlant,
  refreshKey, onZoneRefresh
}) => {
  const { user } = useContext(AuthContext);
  const zoneStatus = getZoneStatus(plants);

  const [expanded, setExpanded] = useState(true);
  const [zoneControls, setZoneControls] = useState({
    waterPump: false,
    growLights: false,
    fans: false
  });

  // State for zone2 sensor logs (for temp, light, humidity, air quality)
  const [zone2Sensors, setZone2Sensors] = useState({
    temperature: null,
    light: null,
    humidity: null,
    airQuality: null,
  });

  // Fetch latest action logs for actuators
  useEffect(() => {
    const fetchZoneActions = async () => {
      // Water pump: use actual zoneId
      // Grow lights & fans: use zone2
      try {
        // Water pump
        const resWater = await api.get(`/logs/action/zone/${zoneId}?sortBy=latest`);
        const logsWater = Array.isArray(resWater.data) ? resWater.data : [];
        const getLatestState = (logs, onAction, offAction) => {
          const log = logs.find(l => l.action === onAction || l.action === offAction);
          return log ? log.action === onAction : false;
        };
        // Grow lights & fans
        const resOther = await api.get(`/logs/action/zone/zone2?sortBy=latest`);
        const logsOther = Array.isArray(resOther.data) ? resOther.data : [];
        setZoneControls({
          waterPump: getLatestState(logsWater, 'water_on', 'water_off'),
          growLights: getLatestState(logsOther, 'light_on', 'light_off'),
          fans: getLatestState(logsOther, 'fan_on', 'fan_off'),
        });
        console.log('Zone action logs fetched:', {
          waterPump: getLatestState(logsWater, 'water_on', 'water_off'),
          growLights: getLatestState(logsOther, 'light_on', 'light_off'),
          fans: getLatestState(logsOther, 'fan_on', 'fan_off'),
        });
      } catch (err) {
        console.error('Failed to fetch zone action logs:', err);
      }
    };
    fetchZoneActions();
  }, [zoneId, refreshKey]);

  // Fetch latest sensor logs for zone2 for avg temp, light, humidity, air quality
  useEffect(() => {
    const fetchZone2Sensors = async () => {
      try {
        const res = await api.get(`/logs/sensors?zoneId=zone2&limit=10`);
        const logs = Array.isArray(res.data) ? res.data : [res.data];
        // Calculate averages from the last 10 logs
        let tempSum = 0, lightSum = 0, humiditySum = 0, airQualitySum = 0, count = 0;
        logs.forEach(log => {
          if (log.zoneSensors) {
            tempSum += Number(log.zoneSensors.temp ?? 0);
            lightSum += Number(log.zoneSensors.light ?? 0);
            humiditySum += Number(log.zoneSensors.humidity ?? 0);
            airQualitySum += Number(log.zoneSensors.airQuality ?? 0);
            count++;
          }
        });
        setZone2Sensors({
          temperature: count ? Math.round((tempSum / count) * 10) / 10 : null,
          light: count ? Math.round(lightSum / count) : null,
          humidity: count ? Math.round(humiditySum / count) : null,
          airQuality: count ? Math.round(airQualitySum / count) : null,
        });
      } catch (err) {
        console.error('Failed to fetch zone2 sensor logs:', err);
      }
    };
    fetchZone2Sensors();
  }, [refreshKey]);

  // Soil moisture average is still based on plants in this zone
  const getSoilMoistureAvg = (plants) => {
    const total = plants.length;
    if (total === 0) return 0;
    const sum = plants.reduce((acc, p) => acc + (p.soilMoisture ?? 0), 0);
    return Math.round(sum / total);
  };

  const averages = {
    soilMoisture: getSoilMoistureAvg(plants),
    temperature: zone2Sensors.temperature ?? 0,
    lightLevel: zone2Sensors.light ?? 0,
    humidity: zone2Sensors.humidity ?? 0,
    airQuality: zone2Sensors.airQuality ?? 0,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      default: return 'bg-neutral-400';
    }
  };

  // Toggle handler with API call
  const handleControlToggle = async (control) => {
    const newState = !zoneControls[control];
    setZoneControls(prev => ({
      ...prev,
      [control]: newState
    }));

    // Map control to action, actuator type, and endpoint
    let action, actuatorType, endpoint, actuatorZoneId, payloadZoneId;
    if (control === 'waterPump') {
      action = newState ? 'water_on' : 'water_off';
      actuatorType = 'watering';
      endpoint = '/logs/action/water';
      actuatorZoneId = zoneId;      // Use actual zoneId for actuator fetch
      payloadZoneId = zoneId;       // Use actual zoneId in payload
    } else if (control === 'growLights') {
      action = newState ? 'light_on' : 'light_off';
      actuatorType = 'light';
      endpoint = '/logs/action/light';
      actuatorZoneId = 'zone2';     // Always use zone2 for actuator fetch
      payloadZoneId = 'zone2';      // Always use zone2 in payload
    } else if (control === 'fans') {
      action = newState ? 'fan_on' : 'fan_off';
      actuatorType = 'fan';
      endpoint = '/logs/action/fan';
      actuatorZoneId = 'zone2';     // Always use zone2 for actuator fetch
      payloadZoneId = 'zone2';      // Always use zone2 in payload
    }

    // Fetch actuatorId for this actuatorZoneId and type
    let actuatorId = null;
    try {
      const res = await api.get(`/actuators/zone/${actuatorZoneId}`);
      const actuators = res.data?.actuators || [];
      const actuator = actuators.find(a => a.type === actuatorType);
      actuatorId = actuator?.actuatorId;
    } catch (err) {
      console.error('Failed to fetch actuators for zone:', actuatorZoneId, err);
    }

    // Post action log with correct payloadZoneId
    try {
      function getLocalTimeAsUtcFormat() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0'); // local time
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = '00'; // fixed seconds

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
      }

      const payload = {
        action,
        actuatorId,
        trigger: 'manual',
        triggerBy: user?.email || user?.name || 'unknown',
        timestamp: getLocalTimeAsUtcFormat(),
        zone: payloadZoneId,
      };

      const response = await api.post(endpoint, payload);
      console.log('Zone action log response:', response.data);
      if (onZoneRefresh) onZoneRefresh();
    } catch (err) {
      console.error('Failed to log zone action:', err);
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow mb-8">
      {/* Zone Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-neutral-900">{zoneName || zoneId}</h3>
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${getStatusColor(zoneStatus)} animate-pulse-slow`}></span>
            <span className="text-sm text-neutral-600">{plants.length} plants</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onAddPlant && (
            <button
              onClick={() => onAddPlant(zoneId)}
              className="p-2 rounded-lg hover:bg-primary-light/10 text-primary transition-colors"
              title="Add Plant to Zone"
            >
              <Plus size={18} />
            </button>
          )}
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Zone Average Readings */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <SensorReading 
          icon={<Droplets className="text-accent" size={20} />}
          label="Avg Moisture"
          value={`${averages.soilMoisture}`}
          status={averages.soilMoisture < 2500 ? 'low' : averages.soilMoisture > 3700 ? 'high' : 'normal'}
        />
        <SensorReading 
          icon={<ThermometerSun className="text-warning" size={20} />}
          label="Avg Temp"
          value={`${averages.temperature}°C`}
          status={averages.temperature < 32 ? 'low' : averages.temperature > 38 ? 'high' : 'normal'}
        />
        <SensorReading 
          icon={<Sun className="text-warning" size={20} />}
          label="Avg Light"
          value={`${averages.lightLevel}`}
          status={averages.lightLevel < 1900 ? 'low' : averages.lightLevel > 3800 ? 'high' : 'normal'}
        />
        <SensorReading 
          icon={<Wind className="text-info" size={20} />}
          label="Avg Humidity"
          value={`${averages.humidity}%`}
          status={averages.humidity < 40 ? 'low' : averages.humidity > 75 ? 'high' : 'normal'}
        />
        <SensorReading 
          icon={<Wind className="text-purple-500" size={20} />}
          label="Avg Air Quality"
          value={`${averages.airQuality}ppm`}
          status={averages.airQuality < 30 ? 'low' : averages.airQuality > 180 ? 'high' : 'normal'}
        />
      </div>

      {/* Zone Controls */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-accent" />
            <span className="text-sm font-medium">Zone Water Pump</span>
          </div>
          <Toggle 
            checked={zoneControls.waterPump} 
            onChange={() => handleControlToggle('waterPump')}
            activeColor="bg-accent"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun size={18} className="text-warning" />
            <span className="text-sm font-medium">Zone Grow Lights</span>
          </div>
          <Toggle 
            checked={zoneControls.growLights} 
            onChange={() => handleControlToggle('growLights')}
            activeColor="bg-warning"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind size={18} className="text-black" />
            <span className="text-sm font-medium">Zone Fans</span>
          </div>
          <Toggle 
            checked={zoneControls.fans} 
            onChange={() => handleControlToggle('fans')}
            activeColor="bg-purple-500"
          />
        </div>
      </div>

      {/* Plant Grid - Expanded View */}
      {expanded && (
        <div className="pt-4 border-t border-neutral-100">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">Plants in this zone</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plants.map(plant => (
              <PlantCard
                key={plant.plantId || plant.id}
                plant={plant}
                onEditThreshold={onEditThreshold}
                onEditPlant={onEditPlant}
                onDeletePlant={onDeletePlant}
              />
            ))}
          </div>
        </div>
      )}
      {/* Zone Info */}
      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-sm text-neutral-500">
        <span>Last updated: 2 minutes ago</span>
        {/* <button className="text-primary hover:text-primary-dark font-medium">
          Manage Zone
        </button> */}
      </div>
    </div>
  );
};

export default ZoneSection;