import React, { useState, useContext, useEffect } from 'react';
import { Droplets, ThermometerSun, Sun, Fan, CloudDrizzle } from 'lucide-react';
import SensorReading from '../ui/SensorReading';
import Toggle from '../ui/Toggle';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

const PlantCard = ({ plant, onEditThreshold }) => {
  const { user } = useContext(AuthContext);
  const [pumpActive, setPumpActive] = useState(false);
  const [lightsActive, setLightsActive] = useState(false);
  const [fanActive, setFanActive] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchActionLogs = async () => {
      try {
        const res = await api.get(`/logs/action/plant/${plant.plantId}?sortBy=latest`);
        const logs = res.data;

        // Find the latest action for each actuator type
        // You may need to know the actuatorId/type mapping for this plant
        // For demo, we'll use action string matching

        // Water Pump
        const latestWater = logs.find(log =>
          log.action === 'water_on' || log.action === 'water_off'
        );
        if (latestWater) setPumpActive(latestWater.action === 'water_on');

        // Grow Lights
        const latestLight = logs.find(log =>
          log.action === 'light_on' || log.action === 'light_off'
        );
        if (latestLight) setLightsActive(latestLight.action === 'light_on');

        // Fan
        const latestFan = logs.find(log =>
          log.action === 'fan_on' || log.action === 'fan_off'
        );
        if (latestFan) setFanActive(latestFan.action === 'fan_on');
      } catch (err) {
        console.error('Failed to fetch action logs:', err);
      }
    };

    fetchActionLogs();
    // eslint-disable-next-line
  }, [plant.plantId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-success';
      case 'needsWater': return 'bg-warning';
      case 'tooHot':
      case 'tooCold':
      case 'lowLight': return 'bg-error';
      default: return 'bg-neutral-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy': return 'Healthy';
      case 'needsWater': return 'Needs Water';
      case 'tooHot': return 'Too Hot';
      case 'tooCold': return 'Too Cold';
      case 'lowLight': return 'Low Light';
      default: return 'Unknown';
    }
  };

  const handlePumpToggle = async () => {
    setPumpActive(!pumpActive);
    try {
      const actuatorsRes = await api.get(`/actuators/zone/${plant.zone}`);
      const actuators = actuatorsRes.data?.actuators || [];
      const pumpActuator = actuators.find(a => a.type === 'watering' && a.actuatorId);

      if (!pumpActuator) {
        alert('No pump actuator found for this zone.');
        return;
      }

      const actionPayload = {
        action: pumpActive ? 'water_off' : 'water_on',
        actuatorId: pumpActuator.actuatorId,
        plantId: plant.plantId,
        trigger: 'manual',
        triggerBy: user?.email || user?.name || 'unknown',
        timestamp: new Date().toISOString(),
      };

      await api.post('/logs/action/water', actionPayload);
      console.log('Water action logged:', actionPayload);
    } catch (err) {
      console.error('Error toggling pump:', err);
      alert('Failed to toggle pump.');
    }
  };

  const handleLightsToggle = async () => {
    setLightsActive(!lightsActive);
    try {
      const actuatorsRes = await api.get(`/actuators/zone/${plant.zone}`);
      const actuators = actuatorsRes.data?.actuators || [];
      const lightActuator = actuators.find(a => a.type === 'light' && a.actuatorId);

      if (!lightActuator) {
        alert('No light actuator found for this zone.');
        return;
      }

      const actionPayload = {
        action: lightsActive ? 'light_off' : 'light_on',
        actuatorId: lightActuator.actuatorId,
        plantId: plant.plantId,
        trigger: 'manual',
        triggerBy: user?.email || user?.name || 'unknown',
        timestamp: new Date().toISOString(),
      };

      await api.post('/logs/action/light', actionPayload);
      console.log('Light action logged:', actionPayload);
    } catch (err) {
      console.error('Error toggling lights:', err);
      alert('Failed to toggle lights.');
    }
  };

  const handleFanToggle = async () => {
    setFanActive(!fanActive);
    try {
      const actuatorsRes = await api.get(`/actuators/zone/${plant.zone}`);
      const actuators = actuatorsRes.data?.actuators || [];
      const fanActuator = actuators.find(a => a.type === 'fan' && a.actuatorId);

      if (!fanActuator) {
        alert('No fan actuator found for this zone.');
        return;
      }

      const actionPayload = {
        action: fanActive ? 'fan_off' : 'fan_on',
        actuatorId: fanActuator.actuatorId,
        plantId: plant.plantId,
        trigger: 'manual',
        triggerBy: user?.email || user?.name || 'unknown',
        timestamp: new Date().toISOString(),
      };

      await api.post('/logs/action/fan', actionPayload);
      console.log('Fan action logged:', actionPayload);
    } catch (err) {
      console.error('Error toggling fan:', err);
      alert('Failed to toggle fan.');
    }
  };

  // Safe extraction of threshold values
  const moistureMin = plant?.thresholds?.moisture?.min;
  const moistureMax = plant?.thresholds?.moisture?.max;
  const temperatureMin = plant?.thresholds?.temperature?.min;
  const temperatureMax = plant?.thresholds?.temperature?.max;
  const lightMin = plant?.thresholds?.light?.min;
  const lightMax = plant?.thresholds?.light?.max;
  const humidityMin = plant?.thresholds?.humidity?.min;
  const humidityMax = plant?.thresholds?.humidity?.max;

  // Status checks
  const isMoistureLow = moistureMin !== undefined && plant.moisture < moistureMin;
  const isMoistureHigh = moistureMax !== undefined && plant.moisture > moistureMax;
  const isTemperatureLow = temperatureMin !== undefined && plant.temperature < temperatureMin;
  const isTemperatureHigh = temperatureMax !== undefined && plant.temperature > temperatureMax;
  const isLightLow = lightMin !== undefined && plant.lightLevel < lightMin;
  const isLightHigh = lightMax !== undefined && plant.lightLevel > lightMax;
  const isHumidityLow = humidityMin !== undefined && plant.humidity < humidityMin;
  const isHumidityHigh = humidityMax !== undefined && plant.humidity > humidityMax;

  return (
    <div className="card hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-48 -mx-6 -mt-6 mb-4">
        <img 
          src={plant.image} 
          alt={plant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
  <div className="flex items-center justify-between">
    {/* Group plant name and ID vertically */}
    <div className="flex flex-col">
      <h3 className="text-xl font-semibold">{plant.name}</h3>
      <p className="text-sm text-white/80">{plant.id}</p>
    </div>

    {/* Status indicator stays to the right */}
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${getStatusColor(plant.status)} animate-pulse-slow`}></span>
      <span className="text-sm">{getStatusText(plant.status)}</span>
    </div>
  </div>
</div>

      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <SensorReading 
          icon={<Droplets className="text-accent" size={20} />}
          label="Moisture"
          value={plant.soilMoisture !== undefined && plant.soilMoisture !== null ? `${plant.soilMoisture}%` : 'N/A'}
          status={isMoistureLow ? 'low' : isMoistureHigh ? 'high' : 'normal'}
        />
        <SensorReading 
          icon={<ThermometerSun className="text-warning" size={20} />}
          label="Temp"
          value={plant.temperature !== undefined && plant.temperature !== null ? `${plant.temperature}°C` : 'N/A'}
          status={isTemperatureLow ? 'low' : isTemperatureHigh ? 'high' : 'normal'}
        />
        <SensorReading 
          icon={<Sun className="text-warning" size={20} />}
          label="Light"
          value={plant.lightLevel !== undefined && plant.lightLevel !== null ? `${plant.lightLevel}%` : 'N/A'}
          status={isLightLow ? 'low' : isLightHigh ? 'high' : 'normal'}
        />
        <SensorReading 
          icon={<CloudDrizzle className="text-green-500" size={20} />}
          label="Humidity"
          value={plant.humidity !== undefined && plant.humidity !== null ? `${plant.humidity}%` : 'N/A'}
          status={isHumidityLow ? 'low' : isHumidityHigh ? 'high' : 'normal'}
        />
        <SensorReading 
          icon={<Fan className="text-green-500" size={20} />}
          label="Air Quality"
          value={plant.airQuality !== undefined && plant.airQuality !== null ? `${plant.airQuality}` : 'N/A'}
          status="normal"
        />
      </div>

      <div className="flex flex-col gap-3">
        {/* Water Pump as toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-accent" />
            <span className="text-sm font-medium">Water Pump</span>
          </div>
          <Toggle
            checked={pumpActive}
            onChange={handlePumpToggle}
            activeColor="bg-accent"
          />
        </div>

        {/* Grow Lights toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun size={18} className="text-warning" />
            <span className="text-sm font-medium">Grow Lights</span>
          </div>
          <Toggle
            checked={lightsActive}
            onChange={handleLightsToggle}
            activeColor="bg-warning"
          />
        </div>

        {/* Fan toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fan size={18} className="text-accent" />
            <span className="text-sm font-medium">Fan</span>
          </div>
          <Toggle
            checked={fanActive}
            onChange={handleFanToggle}
            activeColor="bg-blue-400"
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-sm text-neutral-500">
        <span>Last watered: {plant.lastWatered}</span>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-primary hover:text-primary-dark font-medium"
        >
          {expanded ? 'Less details' : 'More details'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-neutral-100 grid gap-3 text-sm">
          <h4 className="font-medium text-neutral-900">Threshold Settings</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-neutral-500">Moisture Range:</p>
              <p>{moistureMin}% - {moistureMax}%</p>
            </div>
            <div>
              <p className="text-neutral-500">Temperature Range:</p>
              <p>{temperatureMin}°C - {temperatureMax}°C</p>
            </div>
            <div>
              <p className="text-neutral-500">Light Range:</p>
              <p>{lightMin}% - {lightMax}%</p>
            </div>
          </div>
          
          <button
            className="mt-2 text-primary hover:text-primary-dark font-medium"
            onClick={onEditThreshold}
          >
            Edit thresholds
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantCard;


