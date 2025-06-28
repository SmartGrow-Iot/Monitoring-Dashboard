import React, { useEffect, useState } from 'react';
import { ThermometerSun, Sun, Wind, Save } from 'lucide-react';
import api from '../../api/api';

const defaultThresholds = {
  temperature: { min: 0, max: 0 },
  light: { min: 0, max: 0 },
  airQuality: { min: 0, max: 0 }
};

const SystemThresholdCard = () => {
  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch system thresholds on mount (no initialize, just fetch)
  useEffect(() => {
    const fetchThresholds = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/system/thresholds');
        let data = res.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            data = {};
          }
        }
        // Use data.thresholds if present
        const thresholdsData = data.thresholds || data;
        setThresholds({
          temperature: { ...defaultThresholds.temperature, ...(thresholdsData.temperature || {}) },
          light: { ...defaultThresholds.light, ...(thresholdsData.light || {}) },
          airQuality: { ...defaultThresholds.airQuality, ...(thresholdsData.airQuality || {}) }
        });
      } catch (err) {
        setError('Failed to fetch system thresholds.');
      }
      setLoading(false);
    };
    fetchThresholds();
  }, []);

  // Handle input change
  const handleChange = (type, field, value) => {
    setThresholds(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: Number(value)
      }
    }));
  };

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put('/system/thresholds', thresholds);
      setEditMode(false);
    } catch (err) {
      setError('Failed to update system thresholds.');
    }
    setSaving(false);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-medium mb-4">System Thresholds</h3>
      {loading ? (
        <div className="text-sm text-neutral-500">Loading...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-3">
            {/* Temperature */}
            <div className="flex items-center gap-2 text-sm">
              <ThermometerSun size={18} className="text-warning" />
              <span className="font-medium text-neutral-800 flex-1">Temperature (°C)</span>
              {editMode ? (
                <>
                  <input
                    type="number"
                    value={thresholds.temperature?.min ?? ''}
                    onChange={e => handleChange('temperature', 'min', e.target.value)}
                    className="w-14 rounded-md border border-neutral-300 px-2 py-1 text-xs"
                  />
                  <span className="mx-1 text-neutral-500">to</span>
                  <input
                    type="number"
                    value={thresholds.temperature.max}
                    onChange={e => handleChange('temperature', 'max', e.target.value)}
                    className="w-14 rounded-md border border-neutral-300 px-2 py-1 text-xs"
                  />
                </>
              ) : (
                <span className="text-neutral-700 min-w-[90px] text-right">{thresholds.temperature.min}°C - {thresholds.temperature.max}°C</span>
              )}
            </div>
            {/* Light */}
            <div className="flex items-center gap-2 text-sm">
              <Sun size={18} className="text-accent" />
              <span className="font-medium text-neutral-800 flex-1">Light (Lux)</span>
              {editMode ? (
                <>
                  <input
                    type="number"
                    value={thresholds.light.min}
                    onChange={e => handleChange('light', 'min', e.target.value)}
                    className="w-14 rounded-md border border-neutral-300 px-2 py-1 text-xs"
                  />
                  <span className="mx-1 text-neutral-500">to</span>
                  <input
                    type="number"
                    value={thresholds.light.max}
                    onChange={e => handleChange('light', 'max', e.target.value)}
                    className="w-14 rounded-md border border-neutral-300 px-2 py-1 text-xs"
                  />
                </>
              ) : (
                <span className="text-neutral-700 min-w-[90px] text-right">{thresholds.light.min} - {thresholds.light.max} Lux</span>
              )}
            </div>
            {/* Air Quality */}
            <div className="flex items-center gap-2 text-sm">
              <Wind size={18} className="text-secondary" color="#4B5563" />
              <span className="font-medium text-neutral-800 flex-1">Air Quality (ppm)</span>
              {editMode ? (
                <>
                  <input
                    type="number"
                    value={thresholds.airQuality.min}
                    onChange={e => handleChange('airQuality', 'min', e.target.value)}
                    className="w-14 rounded-md border border-neutral-300 px-2 py-1 text-xs"
                  />
                  <span className="mx-1 text-neutral-500">to</span>
                  <input
                    type="number"
                    value={thresholds.airQuality.max}
                    onChange={e => handleChange('airQuality', 'max', e.target.value)}
                    className="w-14 rounded-md border border-neutral-300 px-2 py-1 text-xs"
                  />
                </>
              ) : (
                <span className="text-neutral-700 min-w-[90px] text-right">
                  {thresholds.airQuality.min} - {thresholds.airQuality.max} ppm
                </span>
              )}
            </div>
          </div>
          {error && <div className="text-error text-xs">{error}</div>}
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 mt-2">
            {editMode ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline text-sm"
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2 text-sm"
                  disabled={saving}
                >
                  <Save size={14} color="#fff" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-primary text-sm"
                onClick={() => setEditMode(true)}
              >
                Edit Thresholds
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default SystemThresholdCard;