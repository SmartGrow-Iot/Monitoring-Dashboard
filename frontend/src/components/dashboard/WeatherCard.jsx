import React from 'react';
import { Cloud, Droplets, ThermometerSun, Wind } from 'lucide-react';

// Mock weather data
const weatherData = {
  temperature: 24,
  humidity: 68,
  conditions: 'Partly Cloudy',
  windSpeed: 12,
  forecast: [
    { day: 'Today', temp: 24, conditions: 'Partly Cloudy' },
    { day: 'Tomorrow', temp: 26, conditions: 'Sunny' },
    { day: 'Wed', temp: 22, conditions: 'Rain' },
  ]
};

const WeatherCard = () => {
  return (
    <div className="card">
      <h3 className="text-lg font-medium mb-4">Local Weather</h3>
      
      {/* Current weather */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Cloud size={36} className="text-accent" />
          <div>
            <p className="text-2xl font-semibold">{weatherData.temperature}°C</p>
            <p className="text-sm text-neutral-500">{weatherData.conditions}</p>
          </div>
        </div>
      </div>
      
      {/* Weather details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Droplets size={16} className="text-accent" />
          <span className="text-sm">Humidity: {weatherData.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind size={16} className="text-neutral-500" />
          <span className="text-sm">Wind: {weatherData.windSpeed} km/h</span>
        </div>
      </div>
      
      {/* Forecast */}
      <div className="border-t border-neutral-100 pt-3">
        <h4 className="text-sm font-medium mb-2">3-Day Forecast</h4>
        <div className="grid grid-cols-3 gap-2">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs font-medium">{day.day}</p>
              <p className="text-sm">{day.temp}°C</p>
              <p className="text-xs text-neutral-500">{day.conditions}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;