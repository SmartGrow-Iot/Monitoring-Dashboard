import React from 'react';
import { Droplets, ThermometerSun, Sun, Wind } from 'lucide-react';
import PlantCard from '../plants/PlantCard';
import SensorReading from '../ui/SensorReading';

const getZoneAverages = (plants) => {
  const total = plants.length;
  if (total === 0) return { soilMoisture: 0, temperature: 0, lightLevel: 0, humidity: 0, airQuality: 0 };
  const sum = plants.reduce(
    (acc, p) => ({
      soilMoisture: acc.soilMoisture + (p.soilMoisture ?? 0),
      temperature: acc.temperature + (p.temperature ?? 0),
      lightLevel: acc.lightLevel + (p.lightLevel ?? 0),
      humidity: acc.humidity + (p.humidity ?? 0),
      airQuality: acc.airQuality + (p.airQuality ?? 0),
    }),
    { soilMoisture: 0, temperature: 0, lightLevel: 0, humidity: 0, airQuality: 0 }
  );
  return {
    soilMoisture: Math.round(sum.soilMoisture / total),
    temperature: Math.round((sum.temperature / total) * 10) / 10,
    lightLevel: Math.round(sum.lightLevel / total),
    humidity: Math.round(sum.humidity / total),
    airQuality: Math.round(sum.airQuality / total),
  };
};

const getStatusColor = (status) => {
  switch (status) {
    case 'healthy': return 'bg-success';
    case 'warning': return 'bg-warning';
    case 'error': return 'bg-error';
    default: return 'bg-neutral-400';
  }
};

const getZoneStatus = (plants) => {
  const statuses = plants.map(p => p.status);
  if (statuses.includes('needsWater') || statuses.includes('tooHot') || statuses.includes('tooCold') || statuses.includes('lowLight')) {
    return 'warning';
  }
  return 'healthy';
};

const ZoneSection = ({ zoneId, zoneName, plants, onEditThreshold, onEditPlant, onDeletePlant }) => {
  const averages = getZoneAverages(plants);
  const zoneStatus = getZoneStatus(plants);

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

      {/* Plant Grid */}
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
  );
};

export default ZoneSection;