import React, { useState } from 'react';
import {
  Droplets,
  ThermometerSun,
  Sun,
  Power,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Plus,
  Wind
} from 'lucide-react'; // <-- added Wind icon
import SensorReading from '../ui/SensorReading';
import Toggle from '../ui/Toggle';

const ZoneCard = ({ zone, onEditPlant, onDeletePlant, onAddPlant }) => {
  const [expanded, setExpanded] = useState(false);
  const [zoneControls, setZoneControls] = useState({
    waterPump: false,
    growLights: false,
    fans: false
  });

  const getZoneAverages = () => {
    const totalPlants = zone.plants.length;
    if (totalPlants === 0) return { moisture: 0, temperature: 0, lightLevel: 0, humidity: 0 };

    const totals = zone.plants.reduce((acc, plant) => ({
      moisture: acc.moisture + plant.moisture,
      temperature: acc.temperature + plant.temperature,
      lightLevel: acc.lightLevel + plant.lightLevel,
      humidity: acc.humidity + (plant.humidity || 50),
      air_quality: acc.air_quality + (plant.air_quality || 0)
    }), { moisture: 0, temperature: 0, lightLevel: 0, humidity: 0, air_quality: 0 });

    return {
      moisture: Math.round(totals.moisture / totalPlants),
      temperature: Math.round((totals.temperature / totalPlants) * 10) / 10,
      lightLevel: Math.round(totals.lightLevel / totalPlants),
      humidity: Math.round(totals.humidity / totalPlants),
      air_quality: Math.round(totals.air_quality / totalPlants)
    };
  };

  const getZoneStatus = () => {
    const statuses = zone.plants.map(plant => plant.status);
    if (statuses.includes('needsWater') || statuses.includes('tooHot') || statuses.includes('tooCold') || statuses.includes('lowLight')) {
      return 'warning';
    }
    return 'healthy';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      default: return 'bg-neutral-400';
    }
  };

  const handleControlToggle = (control) => {
    setZoneControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }));
  };

  const averages = getZoneAverages();
  const zoneStatus = getZoneStatus();

  return (
    <div className="card hover:shadow-lg transition-shadow">
      {/* Zone Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-neutral-900">{zone.name}</h3>
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${getStatusColor(zoneStatus)} animate-pulse-slow`}></span>
            <span className="text-sm text-neutral-600">{zone.plants.length} plants</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddPlant(zone.id)}
            className="p-2 rounded-lg hover:bg-primary-light/10 text-primary transition-colors"
            title="Add Plant to Zone"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
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
          value={`${averages.moisture}`}
          status={averages.moisture < 2500 ? 'low' : averages.moisture > 3700 ? 'high' : 'normal'}
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
          value={`${averages.air_quality}ppm`}
          status={averages.air_quality < 30 ? 'low' : averages.air_quality > 180 ? 'high' : 'normal'}
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
            activeColor="bg-secondary"
          />
        </div>
      </div>

      {/* Plant Grid - Expanded View */}
      {expanded && (
        <div className="pt-4 border-t border-neutral-100">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">Plants in this zone</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zone.plants.map(plant => (
              <div key={plant.id} className="p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <img 
                    src={plant.image} 
                    alt={plant.name} 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{plant.name}</p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditPlant(plant)}
                          className="p-1 rounded hover:bg-white text-primary"
                          title="Edit Plant"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onDeletePlant(plant.id, zone.id)}
                          className="p-1 rounded hover:bg-white text-error"
                          title="Delete Plant"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(plant.status)}`}></span>
                      <span className="text-xs text-neutral-500 capitalize">{plant.status.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Plant Details */}
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-5 gap-2">
  <div className="text-center">
    <p className="text-neutral-500">Moisture</p>
    <p className="font-medium">{plant.moisture}</p>
  </div>
  <div className="text-center">
    <p className="text-neutral-500">Temp</p>
    <p className="font-medium">{plant.temperature}°C</p>
  </div>
  <div className="text-center">
    <p className="text-neutral-500">Light</p>
    <p className="font-medium">{plant.lightLevel}</p>
  </div>
  <div className="text-center">
    <p className="text-neutral-500">Humidity</p>
    <p className="font-medium">{plant.humidity}%</p>
  </div>
  <div className="text-center">
    <p className="text-neutral-500">Air Quality</p>
    <p className="font-medium">{plant.air_quality}ppm</p>
  </div>
</div>
                  
                  <div className="pt-2 border-t border-neutral-200">
                    <p className="text-neutral-500 mb-1">Care Notes:</p>
                    <p className="text-neutral-700">{plant.careNotes}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200">
                    <div>
                      <p className="text-neutral-500">Planted:</p>
                      <p className="font-medium">{plant.plantedDate}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Last Watered:</p>
                      <p className="font-medium">{plant.lastWatered}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-neutral-200">
                    <p className="text-neutral-500 mb-1">Growth Stage:</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${plant.growthProgress}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{plant.growthStage}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone Info */}
      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-sm text-neutral-500">
        <span>Last updated: 2 minutes ago</span>
        <button className="text-primary hover:text-primary-dark font-medium">
          Manage Zone
        </button>
      </div>
    </div>
  );
};

export default ZoneCard;