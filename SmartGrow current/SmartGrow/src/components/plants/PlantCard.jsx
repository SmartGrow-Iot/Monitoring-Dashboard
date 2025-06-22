import React, { useState } from 'react';
import { Droplets, ThermometerSun, Sun, CloudDrizzle } from 'lucide-react';
import SensorReading from '../ui/SensorReading';
import Toggle from '../ui/Toggle';

const PlantCard = ({ plant }) => {
  const [pumpActive, setPumpActive] = useState(false);
  const [lightsActive, setLightsActive] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

  const handlePumpToggle = () => {
    setPumpActive(!pumpActive);
    // Trigger API call in real implementation
  };

  const handleLightsToggle = () => {
    setLightsActive(!lightsActive);
    // Trigger API call in real implementation
  };

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

      <div className="grid grid-cols-5 gap-4 mb-6">
        <SensorReading 
          icon={<Droplets className="text-accent" size={20} />}
          label="Moisture"
          value={`${plant.moisture}`}
          status={
            plant.moisture < plant.thresholds.moisture.min ? 'low' :
            plant.moisture > plant.thresholds.moisture.max ? 'high' : 'normal'
          }
        />
        <SensorReading 
          icon={<ThermometerSun className="text-warning" size={20} />}
          label="Temp"
          value={`${plant.temperature}°C`}
          status={
            plant.temperature < plant.thresholds.temperature.min ? 'low' :
            plant.temperature > plant.thresholds.temperature.max ? 'high' : 'normal'
          }
        />
        <SensorReading 
          icon={<Sun className="text-warning" size={20} />}
          label="Light"
          value={`${plant.lightLevel}`}
          status={
            plant.lightLevel < plant.thresholds.light.min ? 'low' :
            plant.lightLevel > plant.thresholds.light.max ? 'high' : 'normal'
          }
        />
        <SensorReading 
          icon={<CloudDrizzle className="text-blue-400" size={20} />}
          label="Humidity"
          value={`${plant.humidity}%`}
          status={
            plant.humidity < plant.thresholds.humidity.min ? 'low' :
            plant.humidity > plant.thresholds.humidity.max ? 'high' : 'normal'
          }
        />
         <SensorReading 
          icon={<CloudDrizzle className="text-blue-400" size={20} />}
          label="Air Quality"
          value={`${plant.air_quality}ppm`}
          status={
            plant.air_quality < plant.thresholds.air_quality.min ? 'low' :
            plant.air_quality > plant.thresholds.air_quality.max ? 'high' : 'normal'
          }
        />
      </div>

      <div className="text-sm text-neutral-600 col-span-4">
  Humidity <span className="font-medium text-neutral-800">{plant.humidity}%</span>
</div>

      <div className="flex flex-col gap-3">
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
              <p>{plant.thresholds.moisture.min}% - {plant.thresholds.moisture.max}%</p>
            </div>
            <div>
              <p className="text-neutral-500">Temperature Range:</p>
              <p>{plant.thresholds.temperature.min}°C - {plant.thresholds.temperature.max}°C</p>
            </div>
            <div>
              <p className="text-neutral-500">Light Range:</p>
              <p>{plant.thresholds.light.min} - {plant.thresholds.light.max}</p>
            </div>
            <div>
              <p className="text-neutral-500">Air Quality Range:</p>
              <p>{plant.thresholds.air_quality.min} - {plant.thresholds.air_quality.max}</p>
            </div>
          </div>
          
          <button className="mt-2 text-primary hover:text-primary-dark font-medium">
            Edit thresholds
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantCard;


