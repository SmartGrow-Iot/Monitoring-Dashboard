import React, { useState, useContext, useEffect } from 'react';
import { Droplets } from 'lucide-react';
import SensorReading from '../ui/SensorReading';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

const PlantCard = ({ plant, onEditThreshold }) => {
  const { user } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);
  const [plantDetails, setPlantDetails] = useState(null);

  // Fetch full plant details (including id, moisturePin, etc.)
  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const res = await api.get(`/plants/${plant.plantId}`);
        setPlantDetails(res.data);
      } catch (err) {
        console.error('Failed to fetch plant details:', err);
      }
    };
    fetchPlantDetails();
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

  // Safe extraction of threshold values (moisture only)
  const moistureMin = plant?.thresholds?.moisture?.min;
  const moistureMax = plant?.thresholds?.moisture?.max;

  // Status checks
  const isMoistureLow = moistureMin !== undefined && plant.moisture < moistureMin;
  const isMoistureHigh = moistureMax !== undefined && plant.moisture > moistureMax;

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
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold">{plant.name}</h3>
              {/* Show Plant ID and Moisture Pin */}
              {plantDetails && (
                <div className="text-xs text-white/80 mt-1">
                  <div>Plant ID: <span className="font-mono">{plantDetails.plantId}</span></div>
                  <div>Moisture Pin: <span className="font-mono">{plantDetails.moisturePin}</span></div>
                  <div>Zone: <span className="font-mono">{plantDetails.zone}</span></div>
                </div>
              )}
            </div>
            {/* <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${getStatusColor(plant.status)} animate-pulse-slow`}></span>
              <span className="text-sm">{getStatusText(plant.status)}</span>
            </div> */}
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
        {/* You can keep other sensor readings if you want */}
        {/* ... */}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-sm text-neutral-500">
        {/* <span>Last watered: {plant.lastWatered}</span> */}
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
          <div>
            <p className="text-neutral-500">Moisture Range:</p>
            <p>{moistureMin}% - {moistureMax}%</p>
          </div>
          <button
            className="mt-2 text-primary hover:text-primary-dark font-medium"
            onClick={() => onEditThreshold(plant)}
          >
            Edit thresholds
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantCard;


