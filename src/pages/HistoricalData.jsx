import React, { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock data with more variation
const historicalData = {
  'red-chili': [
    { time: '00:00', moisture: 38, temperature: 20, light: 0, humidity: 72 },
    { time: '04:00', moisture: 35, temperature: 19, light: 0, humidity: 65 },
    { time: '08:00', moisture: 33, temperature: 22, light: 35, humidity: 58 },
    { time: '12:00', moisture: 30, temperature: 28, light: 95, humidity: 42 },
    { time: '16:00', moisture: 28, temperature: 31, light: 85, humidity: 38 },
    { time: '20:00', moisture: 32, temperature: 26, light: 15, humidity: 61 },
    { time: '00:00', moisture: 36, temperature: 23, light: 0, humidity: 69 }
  ],
  'eggplant-1': [
    { time: '00:00', moisture: 50, temperature: 18, light: 0, humidity: 80 },
    { time: '04:00', moisture: 47, temperature: 19, light: 0, humidity: 77 },
    { time: '08:00', moisture: 44, temperature: 23, light: 25, humidity: 60 },
    { time: '12:00', moisture: 39, temperature: 29, light: 90, humidity: 48 },
    { time: '16:00', moisture: 37, temperature: 30, light: 78, humidity: 41 },
    { time: '20:00', moisture: 41, temperature: 27, light: 20, humidity: 53 },
    { time: '00:00', moisture: 45, temperature: 24, light: 0, humidity: 64 }
  ],
  'eggplant-2': [
    { time: '00:00', moisture: 60, temperature: 17, light: 0, humidity: 75 },
    { time: '04:00', moisture: 57, temperature: 18, light: 0, humidity: 70 },
    { time: '08:00', moisture: 53, temperature: 21, light: 40, humidity: 62 },
    { time: '12:00', moisture: 48, temperature: 27, light: 88, humidity: 45 },
    { time: '16:00', moisture: 44, temperature: 29, light: 73, humidity: 39 },
    { time: '20:00', moisture: 46, temperature: 26, light: 10, humidity: 52 },
    { time: '00:00', moisture: 51, temperature: 22, light: 0, humidity: 60 }
  ]
};

const plantOptions = [
  { id: 'all', name: 'All Plants' },
  { id: 'red-chili', name: 'Red Chili: P-001' },
  { id: 'eggplant-1', name: 'Eggplant: P-002' },
  { id: 'eggplant-2', name: 'Eggplant: P-003' }
];

const timeRangeOptions = [
  { id: 'day', name: '24 Hours' },
  { id: 'week', name: '7 Days' },
  { id: 'month', name: '30 Days' }
];

const metricColors = {
  moisture: '#1976D2',    // blue
  temperature: '#FBC02D', // yellow
  light: '#FF9800',       // orange
  humidity: '#F44336'     // red
};


const HistoricalData = () => {
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('day');

  const plantColors = ['#1976D2', '#8BC34A', '#FF5722'];

  const chartData = selectedPlant === 'all'
    ? Object.values(historicalData)[0].map((_, i) => {
        const time = historicalData['red-chili'][i].time;
        const row = { time };

        Object.keys(historicalData).forEach((plantId) => {
          const dataPoint = historicalData[plantId][i];
          row[`${plantId}-moisture`] = dataPoint.moisture;
          row[`${plantId}-temperature`] = dataPoint.temperature;
          row[`${plantId}-light`] = dataPoint.light;
          row[`${plantId}-humidity`] = dataPoint.humidity;
        });

        return row;
      })
    : historicalData[selectedPlant] || [];

  const exportToCSV = () => {
    const csvRows = [];
    const keys = Object.keys(chartData[0]);
    csvRows.push(keys.join(','));

    chartData.forEach(row => {
      csvRows.push(keys.map(k => row[k]).join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `historical-data-${selectedPlant}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = async () => {
    const chartsContainer = document.getElementById('charts-export-area');
    if (!chartsContainer) return;

    const canvas = await html2canvas(chartsContainer, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('portrait', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    const fileLabel = selectedPlant === 'all' ? 'all-plants' : selectedPlant;
    pdf.save(`historical-data-${fileLabel}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-neutral-900">Historical Data</h2>
        <div className="flex flex-wrap items-center gap-3">
          {/* Plant Selector */}
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
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
          {/* Time Selector */}
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
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div id="charts-export-area" className="space-y-6">
        {['moisture', 'temperature', 'light', 'humidity'].map((key, chartIndex) => (
          <div key={key} className="card">
            <h3 className="text-lg font-medium mb-4 capitalize">
              {key === 'light' ? 'Light Intensity' : key.charAt(0).toUpperCase() + key.slice(1)}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis
                    domain={key === 'temperature' ? [15, 35] : [0, 100]}
                    tickFormatter={(value) => key === 'temperature' ? `${value}°C` : `${value}%`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}${key === 'temperature' ? '°C' : '%'}`, key]}
                  />
                  <Legend />
                  {selectedPlant === 'all'
  ? Object.keys(historicalData).map((plantId, index) => (
      <Line
        key={`${plantId}-${key}`}
        type="monotone"
        dataKey={`${plantId}-${key}`}
        name={`${key.charAt(0).toUpperCase() + key.slice(1)} (${plantId})`}
        stroke={plantColors[index % plantColors.length]} // ← This stays as-is
        strokeWidth={2}
        dot={{ r: 3 }}
      />
    ))
  : <Line
      type="monotone"
      dataKey={key}
      name={key.charAt(0).toUpperCase() + key.slice(1)}
      stroke={metricColors[key]} // ✅ REPLACE with this line
      strokeWidth={2}
      dot={{ r: 3 }}
    />
}

                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end gap-3">
        <button className="btn btn-outline" onClick={exportToCSV}>Export CSV</button>
        <button className="btn btn-outline" onClick={exportToPDF}>Export PDF</button>
      </div>
    </div>
  );
};

export default HistoricalData;
