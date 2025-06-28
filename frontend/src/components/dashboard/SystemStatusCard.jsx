import React from 'react';
import { 
  Wifi, 
  Server, 
  Droplets, 
  Sun, 
  Fan,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';

// Mock system status data
const systemStatus = {
  loraWan: 'connected',
  server: 'connected',
  waterPump: 'connected',
  growLights: 'connected',
  fans: 'warning',
  lastSync: '2 minutes ago'
};

const SystemStatusCard = () => {
  // Status indicators
  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 size={16} className="text-success" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-warning" />;
      case 'error':
        return <XCircle size={16} className="text-error" />;
      default:
        return <CheckCircle2 size={16} className="text-success" />;
    }
  };

  // Components for each status item
  const StatusItem = ({ icon, label, status }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {getStatusIcon(status)}
    </div>
  );

  return (
    <div className="card">
      <h3 className="text-lg font-medium mb-4">System Status</h3>
      
      <div className="space-y-1 divide-y divide-neutral-100">
        <StatusItem 
          icon={<Wifi size={18} className="text-accent" />} 
          label="LoRaWAN Connection" 
          status={systemStatus.loraWan} 
        />
        
        <StatusItem 
          icon={<Server size={18} className="text-primary" />} 
          label="Cloud Server" 
          status={systemStatus.server} 
        />
        
        <StatusItem 
          icon={<Droplets size={18} className="text-accent" />} 
          label="Water Pump" 
          status={systemStatus.waterPump} 
        />
        
        <StatusItem 
          icon={<Sun size={18} className="text-warning" />} 
          label="Grow Lights" 
          status={systemStatus.growLights} 
        />
        
        <StatusItem 
          icon={<Fan size={18} className="text-secondary" />} 
          label="Fans" 
          status={systemStatus.fans} 
        />
      </div>
      
      <div className="mt-4 pt-2 text-xs text-neutral-500 border-t border-neutral-100">
        Last system sync: {systemStatus.lastSync}
      </div>
    </div>
  );
};

export default SystemStatusCard;
