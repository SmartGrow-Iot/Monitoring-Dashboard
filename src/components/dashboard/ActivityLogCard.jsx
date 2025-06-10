import React from 'react';
import { Droplets, Sun, Fan, AlertCircle, ArrowRight } from 'lucide-react';

// Mock activity log data
const activityLogs = [
  { 
    id: 1, 
    type: 'watering', 
    plant: 'Red Chili', 
    message: 'Automatic watering activated', 
    timestamp: '10:23 AM', 
    automatic: true 
  },
  { 
    id: 2, 
    type: 'lights', 
    plant: 'All Plants', 
    message: 'Grow lights turned on', 
    timestamp: '08:00 AM', 
    automatic: true 
  },
  { 
    id: 3, 
    type: 'alert', 
    plant: 'Eggplant', 
    message: 'Low moisture detected', 
    timestamp: '07:45 AM', 
    automatic: false 
  },
  { 
    id: 4, 
    type: 'fans', 
    plant: 'All Plants', 
    message: 'Fans activated due to high humidity', 
    timestamp: 'Yesterday', 
    automatic: true 
  },
];

const ActivityLogCard = () => {
  // Get icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'watering':
        return <Droplets size={16} className="text-accent" />;
      case 'lights':
        return <Sun size={16} className="text-warning" />;
      case 'fans':
        return <Fan size={16} className="text-secondary" />;
      case 'alert':
        return <AlertCircle size={16} className="text-error" />;
      default:
        return <ArrowRight size={16} className="text-neutral-500" />;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Activity</h3>
        <button className="text-sm text-primary hover:text-primary-dark font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {activityLogs.map(log => (
          <div key={log.id} className="flex items-start gap-3 py-2 border-b border-neutral-100 last:border-b-0">
            <div className="mt-0.5">
              {getActivityIcon(log.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{log.plant}</span>
                {log.automatic && (
                  <span className="text-xs px-1.5 py-0.5 bg-neutral-100 rounded-full">Auto</span>
                )}
              </div>
              <p className="text-sm text-neutral-700">{log.message}</p>
            </div>
            <div className="text-xs text-neutral-500 whitespace-nowrap">
              {log.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogCard;
