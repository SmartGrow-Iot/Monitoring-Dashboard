import React from 'react';
import ZoneCard from '../components/zones/ZoneCard';
import SystemStatusCard from '../components/dashboard/SystemStatusCard';
import WeatherCard from '../components/dashboard/WeatherCard';
import ActivityLogCard from '../components/dashboard/ActivityLogCard';
import { Droplets, Sun, Fan } from 'lucide-react'; // âœ… added fan icon

const zones = [
  {
    id: 'zone-1',
    name: 'Zone 1',
    plants: [
      {
        id: 'red-chili-1',
        name: 'Red Chili #1',
        image: 'https://images.pexels.com/photos/4505161/pexels-photo-4505161.jpeg',
        moisture: 3000,
        temperature: 35.4,
        lightLevel: 1750,
        humidity: 58,
        air_quality: 50,
        lastWatered: '2 hours ago',
        status: 'healthy',
        thresholds: {
          moisture: { min: 2000, max: 4095 },
          temperature: { min: 30, max: 40 },
          light: { min: 1700, max: 4095 },
          air_quality: { min: 30, max: 180 }
        }
      },
      {
        id: 'eggplant-1',
        name: 'Eggplant #1',
        image: 'https://images.pexels.com/photos/8060364/pexels-photo-8060364.jpeg',
        moisture: 2800,
        temperature: 34.8,
        lightLevel: 4000,
        humidity: 49,
        air_quality: 67,
        lastWatered: '5 hours ago',
        status: 'needsWater',
        thresholds: {
          moisture: { min: 2000, max: 4095 },
          temperature: { min: 30, max: 40 },
          light: { min: 1700, max: 4095 },
          air_quality: { min: 30, max: 180 }
        }
      },
      {
        id: 'tomato-1',
        name: 'Tomato #1',
        image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
        moisture: 4000,
        temperature: 36.2,
        lightLevel: 2800,
        humidity: 63,
        air_quality: 79,
        lastWatered: '1 hour ago',
        status: 'healthy',
        thresholds: {
          moisture: { min: 2000, max: 4095 },
          temperature: { min: 30, max: 40 },
          light: { min: 1700, max: 4095 },
          air_quality: { min: 30, max: 180 }
        }
      },
      {
        id: 'basil-1',
        name: 'Basil #1',
        image: 'https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg',
        moisture: 2500,
        temperature: 33.8,
        lightLevel: 1700,
        humidity: 60,
        air_quality: 88,
        lastWatered: '3 hours ago',
        status: 'healthy',
        thresholds: {
          moisture: { min: 2000, max: 4095 },
          temperature: { min: 20, max: 27 },
          light: { min: 1700, max: 4095 },
          air_quality: { min: 30, max: 180 }
        }
      }
    ]
  },
  {
    id: 'zone-2',
    name: 'Zone 2',
    plants: [
      {
        id: 'lettuce-1',
        name: 'Lettuce #1',
        image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg',
        moisture: 3800,
        temperature: 32.1,
        lightLevel: 3570,
        humidity: 67,
        air_quality: 128,
        lastWatered: '4 hours ago',
        status: 'lowLight',
        thresholds: {
          moisture: { min: 2000, max: 4095 },
          temperature: { min: 30, max: 40 },
          light: { min: 1700, max: 4095 },
          air_quality: { min: 30, max: 180 }
        }
      },
      {
        id: 'spinach-1',
        name: 'Spinach #1',
        image: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
        moisture: 4100,
        temperature: 31.5,
        lightLevel: 2600,
        humidity: 64,
        air_quality: 54,
        lastWatered: '2 hours ago',
        status: 'healthy',
        thresholds: {
          moisture: { min: 2000, max: 4095 },
          temperature: { min: 30, max: 40 },
          light: { min: 1700, max: 4095 },
          air_quality: { min: 30, max: 180 }
        }
      },
      {
        id: 'cucumber-1',
        name: 'Cucumber #1',
        image: 'https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg',
        moisture: 3300,
        temperature: 37.8,
        lightLevel: 1800,
        humidity: 55,
        air_quality: 176,
        lastWatered: '6 hours ago',
        status: 'tooHot',
        thresholds: {
          moisture: { min: 2000, max: 4095 },
          temperature: { min: 30, max: 40 },
          light: { min: 1700, max: 4095 },
          air_quality: { min: 30, max: 180 }
        }
      },
      {
        id: 'pepper-1',
        name: 'Bell Pepper #1',
        image: 'https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg',
        moisture: 2700,
        temperature: 35.9,
        lightLevel: 3700,
        humidity: 59,
        air_quality: 88,
        lastWatered: '1 hour ago',
        status: 'healthy',
        thresholds: {
          moisture: { min: 2000, max: 4095 },
          temperature: { min: 30, max: 40 },
          light: { min: 1700, max: 4095 },
          air_quality: { min: 30, max: 180 }
        }
      }
    ]
  }
];

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-900">Zone Monitoring</h2>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span className="h-2 w-2 rounded-full bg-success"></span>
            <span>{zones.reduce((total, zone) => total + zone.plants.length, 0)} plants across {zones.length} zones</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {zones.map(zone => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>

        <ActivityLogCard />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900">System Status</h2>
        <SystemStatusCard />
        <WeatherCard />
      </div>
    </div>
  );
};

export default Dashboard;


