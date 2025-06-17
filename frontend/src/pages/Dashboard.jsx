import React, { useEffect, useState } from 'react';
import PlantCard from '../components/plants/PlantCard';
import SystemStatusCard from '../components/dashboard/SystemStatusCard';
import WeatherCard from '../components/dashboard/WeatherCard';
import ActivityLogCard from '../components/dashboard/ActivityLogCard';
import Modal from '../components/ui/Modal';
import api from '../api/api';

const zoneIds = ['zone1', 'zone2', 'zone3', 'zone4'];
const sensorTypes = ['soilMoisture', 'temperature', 'light', 'humidity'];

const Dashboard = () => {
  const [plants, setPlants] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedPlant, setEditedPlant] = useState(null);

  // Fetch all plant profiles and their latest sensor readings
  useEffect(() => {
    const fetchAllPlantsAndSensors = async () => {
      let allPlants = [];
      // 1. Fetch all plants for each zone
      for (const zoneId of zoneIds) {
        try {
          const res = await api.get(`/zones/${zoneId}/plants`);
          if (res.data && Array.isArray(res.data.plants)) {
            allPlants = [...allPlants, ...res.data.plants];
          }
        } catch (err) {
          console.error(`Error fetching plants for zone ${zoneId}:`, err);
        }
      }

      // 2. For each plant, fetch profile and latest sensor readings
      const profiles = [];
      for (const plant of allPlants) {
        try {
          const res = await api.get(`/plants/${plant.plantId}`);
          const plantProfile = res.data;

          // Fetch latest sensor readings for this plant
          const sensorData = {};
          await Promise.all(sensorTypes.map(async (type) => {
            try {
              const response = await api.get(
                `/sensors?plantId=${plant.plantId}&sensorType=${type}&limit=1`
              );
              sensorData[type] = response.data && response.data.length > 0
                ? response.data[0].value
                : null;
            } catch (err) {
              sensorData[type] = null;
            }
          }));

          profiles.push({
            ...plantProfile,
            soilMoisture: sensorData.soilMoisture,
            temperature: sensorData.temperature,
            lightLevel: sensorData.light,
            humidity: sensorData.humidity,
          });
        } catch (err) {
          console.error(`Error fetching plant profile for ${plant.plantId}:`, err);
        }
      }
      setPlants(profiles);
    };
    fetchAllPlantsAndSensors();
  }, []);

  // Edit threshold handlers
  const handleEditThreshold = (plant) => {
    setEditedPlant({ ...plant });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/plants/${editedPlant.plantId}/thresholds`,
        editedPlant.thresholds
      );
      setIsEditModalOpen(false);
      // Refresh plants with latest sensor data and thresholds
      window.location.reload(); // Or call fetchAllPlantsAndSensors() if you move it to top-level
    } catch (err) {
      console.error("Failed to update thresholds", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main plant monitoring section */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Plant Monitoring</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plants.map(plant => (
            <PlantCard
              key={plant.plantId}
              plant={{
                ...plant,
                id: plant.plantId,
                lightLevel: plant.lightLevel,
              }}
              onEditThreshold={() => handleEditThreshold(plant)}
            />
          ))}
        </div>
        <ActivityLogCard />
      </div>
      {/* Right sidebar */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900">System Status</h2>
        <SystemStatusCard />
        <WeatherCard />
      </div>
      {/* Edit Threshold Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${editedPlant?.name || 'Plant'} Thresholds`}
      >
        {editedPlant && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Thresholds</h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Moisture */}
                <div>
                  <label className="block text-sm text-neutral-700 mb-1">
                    Moisture Range (%)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editedPlant?.thresholds?.moisture?.min ?? ''}
                      onChange={e =>
                        setEditedPlant({
                          ...editedPlant,
                          thresholds: {
                            ...editedPlant.thresholds,
                            moisture: {
                              ...editedPlant.thresholds?.moisture,
                              min: Number(e.target.value)
                            }
                          }
                        })
                      }
                      className="w-20 rounded-md border border-neutral-300 px-2 py-1"
                    />
                    <span className="text-neutral-500">to</span>
                    <input
                      type="number"
                      value={editedPlant?.thresholds?.moisture?.max ?? ''}
                      onChange={e =>
                        setEditedPlant({
                          ...editedPlant,
                          thresholds: {
                            ...editedPlant.thresholds,
                            moisture: {
                              ...editedPlant.thresholds?.moisture,
                              max: Number(e.target.value)
                            }
                          }
                        })
                      }
                      className="w-20 rounded-md border border-neutral-300 px-2 py-1"
                    />
                  </div>
                </div>
                {/* Temperature */}
                <div>
                  <label className="block text-sm text-neutral-700 mb-1">
                    Temperature Range (°C)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editedPlant?.thresholds?.temperature?.min ?? ''}
                      onChange={e =>
                        setEditedPlant({
                          ...editedPlant,
                          thresholds: {
                            ...editedPlant.thresholds,
                            temperature: {
                              ...editedPlant.thresholds?.temperature,
                              min: Number(e.target.value)
                            }
                          }
                        })
                      }
                      className="w-20 rounded-md border border-neutral-300 px-2 py-1"
                    />
                    <span className="text-neutral-500">to</span>
                    <input
                      type="number"
                      value={editedPlant?.thresholds?.temperature?.max ?? ''}
                      onChange={e =>
                        setEditedPlant({
                          ...editedPlant,
                          thresholds: {
                            ...editedPlant.thresholds,
                            temperature: {
                              ...editedPlant.thresholds?.temperature,
                              max: Number(e.target.value)
                            }
                          }
                        })
                      }
                      className="w-20 rounded-md border border-neutral-300 px-2 py-1"
                    />
                  </div>
                </div>
                {/* Light */}
                <div>
                  <label className="block text-sm text-neutral-700 mb-1">
                    Light Intensity (Lux)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editedPlant?.thresholds?.light?.min ?? ''}
                      onChange={e =>
                        setEditedPlant({
                          ...editedPlant,
                          thresholds: {
                            ...editedPlant.thresholds,
                            light: {
                              ...editedPlant.thresholds?.light,
                              min: Number(e.target.value)
                            }
                          }
                        })
                      }
                      className="w-20 rounded-md border border-neutral-300 px-2 py-1"
                    />
                    <span className="text-neutral-500">to</span>
                    <input
                      type="number"
                      value={editedPlant?.thresholds?.light?.max ?? ''}
                      onChange={e =>
                        setEditedPlant({
                          ...editedPlant,
                          thresholds: {
                            ...editedPlant.thresholds,
                            light: {
                              ...editedPlant.thresholds?.light,
                              max: Number(e.target.value)
                            }
                          }
                        })
                      }
                      className="w-20 rounded-md border border-neutral-300 px-2 py-1"
                    />
                  </div>
                </div>
                {/* Humidity */}
                <div>
                  <label className="block text-sm text-neutral-700 mb-1">
                    Humidity Range (%)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editedPlant?.thresholds?.humidity?.min ?? ''}
                      onChange={e =>
                        setEditedPlant({
                          ...editedPlant,
                          thresholds: {
                            ...editedPlant.thresholds,
                            humidity: {
                              ...editedPlant.thresholds?.humidity,
                              min: Number(e.target.value)
                            }
                          }
                        })
                      }
                      className="w-20 rounded-md border border-neutral-300 px-2 py-1"
                    />
                    <span className="text-neutral-500">to</span>
                    <input
                      type="number"
                      value={editedPlant?.thresholds?.humidity?.max ?? ''}
                      onChange={e =>
                        setEditedPlant({
                          ...editedPlant,
                          thresholds: {
                            ...editedPlant.thresholds,
                            humidity: {
                              ...editedPlant.thresholds?.humidity,
                              max: Number(e.target.value)
                            }
                          }
                        })
                      }
                      className="w-20 rounded-md border border-neutral-300 px-2 py-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;

