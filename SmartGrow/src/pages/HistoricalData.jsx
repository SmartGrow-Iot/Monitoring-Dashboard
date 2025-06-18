import React, { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock historical data
const historicalData = [
  { time: '00:00', moisture: 45, temperature: 22, light: 0 },
  { time: '04:00', moisture: 44, temperature: 21, light: 0 },
  { time: '08:00', moisture: 42, temperature: 23, light: 40 },
  { time: '12:00', moisture: 38, temperature: 26, light: 85 },
  { time: '16:00', moisture: 35, temperature: 27, light: 70 },
  { time: '20:00', moisture: 33, temperature: 25, light: 20 },
  { time: '00:00', moisture: 40, temperature: 23, light: 0 },
];

// Plant options for filtering
const plantOptions = [
  { id: 'all', name: 'All Plants' },
  { id: 'red-chili', name: 'Red Chili' },
  { id: 'eggplant', name: 'Eggplant' },
];

// Time range options
const timeRangeOptions = [
  { id: 'day', name: '24 Hours' },
  { id: 'week', name: '7 Days' },
  { id: 'month', name: '30 Days' },
];

const HistoricalData = () => {
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('day');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-neutral-900">Historical Data</h2>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <span className="pl-3 pr-2">
              <Filter size={16} className="text-neutral-500" />
            </span>
            <select 
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="py-2 pl-0 pr-8 bg-transparent border-0 focus:ring-0 text-sm"
            >
              {plantOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <span className="pl-3 pr-2">
              <Calendar size={16} className="text-neutral-500" />
            </span>
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="py-2 pl-0 pr-8 bg-transparent border-0 focus:ring-0 text-sm"
            >
              {timeRangeOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="space-y-6">
        {/* Moisture Chart */}
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Soil Moisture</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Moisture']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="moisture" 
                  name="Moisture" 
                  stroke="#1976D2" 
                  strokeWidth={2}
                  dot={{ fill: '#1976D2', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Temperature Chart */}
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Temperature</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" />
                <YAxis 
                  tickFormatter={(value) => `${value}°C`}
                  domain={[15, 35]}
                />
                <Tooltip 
                  formatter={(value) => [`${value}°C`, 'Temperature']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  name="Temperature" 
                  stroke="#FBC02D" 
                  strokeWidth={2}
                  dot={{ fill: '#FBC02D', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Light Chart */}
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Light Intensity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Light']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="light" 
                  name="Light" 
                  stroke="#FF9800" 
                  strokeWidth={2}
                  dot={{ fill: '#FF9800', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Export options */}
      <div className="flex justify-end gap-3">
        <button className="btn btn-outline">
          Export CSV
        </button>
        <button className="btn btn-outline">
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default HistoricalData;