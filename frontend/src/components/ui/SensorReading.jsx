import React from 'react';

const SensorReading = ({ 
  icon, 
  label, 
  value, 
  status 
}) => {
  // Determine status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'low': return 'text-warning';
      case 'normal': return 'text-success';
      case 'high': return 'text-error';
      default: return 'text-neutral-500';
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-1">{icon}</div>
      <p className="text-xs text-neutral-500 mb-1">{label}</p>
      <p className={`text-sm font-semibold ${getStatusColor(status)}`}>{value}</p>
    </div>
  );
};

export default SensorReading;
