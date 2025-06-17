import React, { useState, useEffect, useContext } from 'react';
import { Wifi, Server, Bell, User, Save } from 'lucide-react';
import Toggle from '../components/ui/Toggle';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../App';  

const Settings = () => {
  const { user } = useContext(AuthContext); 

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
      name: '',
      email: '',
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      const fetchAccountData = async () => {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setSettings(prev => ({
            ...prev,
            account: {
              name: data.name || '',
              email: data.email || '',
            }
          }));
        }
        setLoading(false);
      };
      fetchAccountData();
    }
  }, [user]);

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const saveAccountSettings = async () => {
    if (user?.uid) {
      const ref = doc(db, 'users', user.uid);
      await setDoc(ref, {
        name: settings.account.name,
        email: settings.account.email
      }, { merge: true });
      alert('Account settings saved!');
    }
  };

  if (loading) {
    return <p className="text-center">Loading settings...</p>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-2xl font-semibold text-neutral-900">Settings</h2>

      {/* (Your other settings sections unchanged... Notification, System, Connection) */}

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

      {/* Save button */}
      <div className="flex justify-end">
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={saveAccountSettings}
        >
          <Save size={18} />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;

