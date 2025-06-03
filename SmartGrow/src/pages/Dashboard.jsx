import React from 'react';
import PlantCard from '../components/plants/PlantCard';
import SystemStatusCard from '../components/dashboard/SystemStatusCard';
import WeatherCard from '../components/dashboard/WeatherCard';
import ActivityLogCard from '../components/dashboard/ActivityLogCard';

// Mock data for the dashboard
const plants = [
  {
    id: 'red-chili',
    name: 'Red Chili',
    image: 'https://images.pexels.com/photos/4505161/pexels-photo-4505161.jpeg',
    moisture: 42,
    temperature: 25.4,
    lightLevel: 75,
    lastWatered: '2 hours ago',
    status: 'healthy',
    thresholds: {
      moisture: { min: 30, max: 60 },
      temperature: { min: 20, max: 29 },
      light: { min: 60, max: 90 },
    }
  },
  {
    id: 'eggplant',
    name: 'Eggplant',
    image: 'https://images.pexels.com/photos/8060364/pexels-photo-8060364.jpeg',
    moisture: 28,
    temperature: 24.8,
    lightLevel: 68,
    lastWatered: '5 hours ago',
    status: 'needsWater',
    thresholds: {
      moisture: { min: 35, max: 65 },
      temperature: { min: 22, max: 28 },
      light: { min: 65, max: 85 },
    }
  }
];

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main plant monitoring section - takes 2/3 of the screen on large displays */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Plant Monitoring</h2>

        {/* Plant cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>

        {/* Recent activity log */}
        <ActivityLogCard />
      </div>

      {/* Right sidebar with additional widgets */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900">System Status</h2>

        {/* System status card */}
        <SystemStatusCard />

        {/* Weather card */}
        <WeatherCard />
      </div>
    </div>
  );
};

export default Dashboard;
