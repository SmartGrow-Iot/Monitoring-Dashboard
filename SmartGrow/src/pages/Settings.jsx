import React, { useState } from 'react';
import { Wifi, Server, Bell, User, Save } from 'lucide-react';
import Toggle from '../components/ui/Toggle';

const Settings = () => {
  // Mock settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      moisture: true,
      temperature: true,
      light: false,
      system: true
    },
    system: {
      autoWatering: true,
      autoLights: true,
      autoFans: true,
      dataSync: true,
      dataHistory: 30
    },
    account: {
      name: 'Admin User',
      email: 'admin@smartgrow.example',
    }
  });

  // Handle toggle changes
  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-2xl font-semibold text-neutral-900">Settings</h2>
      
      {/* Notification Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={20} className="text-primary" />
          <h3 className="text-lg font-medium">Notification Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-neutral-500">Receive alerts via email</p>
              </div>
              <Toggle 
                checked={settings.notifications.email} 
                onChange={() => handleToggle('notifications', 'email')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-neutral-500">Receive alerts on your device</p>
              </div>
              <Toggle 
                checked={settings.notifications.push} 
                onChange={() => handleToggle('notifications', 'push')}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-neutral-100">
            <p className="font-medium mb-3">Alert Types</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <p className="text-neutral-700">Moisture Alerts</p>
                <Toggle 
                  checked={settings.notifications.moisture} 
                  onChange={() => handleToggle('notifications', 'moisture')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-neutral-700">Temperature Alerts</p>
                <Toggle 
                  checked={settings.notifications.temperature} 
                  onChange={() => handleToggle('notifications', 'temperature')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-neutral-700">Light Level Alerts</p>
                <Toggle 
                  checked={settings.notifications.light} 
                  onChange={() => handleToggle('notifications', 'light')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-neutral-700">System Alerts</p>
                <Toggle 
                  checked={settings.notifications.system} 
                  onChange={() => handleToggle('notifications', 'system')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* System Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Server size={20} className="text-primary" />
          <h3 className="text-lg font-medium">System Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Automatic Watering</p>
                <p className="text-sm text-neutral-500">Trigger watering when moisture is low</p>
              </div>
              <Toggle 
                checked={settings.system.autoWatering} 
                onChange={() => handleToggle('system', 'autoWatering')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Automatic Lighting</p>
                <p className="text-sm text-neutral-500">Control grow lights based on schedule</p>
              </div>
              <Toggle 
                checked={settings.system.autoLights} 
                onChange={() => handleToggle('system', 'autoLights')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Automatic Fans</p>
                <p className="text-sm text-neutral-500">Activate fans based on humidity/temperature</p>
              </div>
              <Toggle 
                checked={settings.system.autoFans} 
                onChange={() => handleToggle('system', 'autoFans')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cloud Data Sync</p>
                <p className="text-sm text-neutral-500">Sync data to cloud every 30 seconds</p>
              </div>
              <Toggle 
                checked={settings.system.dataSync} 
                onChange={() => handleToggle('system', 'dataSync')}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data History Duration</p>
                <p className="text-sm text-neutral-500">How long to keep historical data</p>
              </div>
              <select 
                className="bg-white border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={settings.system.dataHistory}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  system: {
                    ...prev.system,
                    dataHistory: Number(e.target.value)
                  }
                }))}
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={365}>1 year</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Connection Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Wifi size={20} className="text-primary" />
          <h3 className="text-lg font-medium">Connection Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <p className="font-medium">LoRaWAN Connection</p>
            </div>
            <button className="text-sm text-primary hover:text-primary-dark font-medium">
              Configure
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <p className="font-medium">Cloud Server Connection</p>
            </div>
            <button className="text-sm text-primary hover:text-primary-dark font-medium">
              Configure
            </button>
          </div>
        </div>
      </div>
      
      {/* Account Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <User size={20} className="text-primary" />
          <h3 className="text-lg font-medium">Account Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Display Name
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={settings.account.name}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  account: {
                    ...prev.account,
                    name: e.target.value
                  }
                }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={settings.account.email}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  account: {
                    ...prev.account,
                    email: e.target.value
                  }
                }))}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-neutral-100">
            <button className="btn btn-outline text-sm">
              Change Password
            </button>
          </div>
        </div>
      </div>
      
      {/* Save settings button */}
      <div className="flex justify-end">
        <button className="btn btn-primary flex items-center gap-2">
          <Save size={18} />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
