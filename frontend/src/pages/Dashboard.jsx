import React, { useEffect, useState } from 'react';
import PlantCard from '../components/plants/PlantCard';
import SystemStatusCard from '../components/dashboard/SystemStatusCard';
import WeatherCard from '../components/dashboard/WeatherCard';
import ActivityLogCard from '../components/dashboard/ActivityLogCard';
import Modal from '../components/ui/Modal';
import api from '../api/api';
import ZoneSection from '../components/zones/ZoneSection';
import SystemThresholdCard from '../components/dashboard/SystemThresholdCard'; // <-- Add this import

const zoneIds = ['zone1', 'zone2', 'zone3', 'zone4'];
const sensorTypes = ['soilMoisture', 'temperature', 'light', 'humidity'];

const Dashboard = () => {
  const [plants, setPlants] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedPlant, setEditedPlant] = useState(null);

  // Fetch all plant profiles and their latest sensor readings
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

    // 2. Fetch latest zone sensor logs for each zone
    const zoneSensorData = {};
    await Promise.all(zoneIds.map(async (zoneId) => {
      try {
        const res = await api.get(`/logs/sensors?zoneId=${zoneId}&limit=1`);
        // If response is an array, get the latest record
        const latest = Array.isArray(res.data) ? res.data[0] : res.data;
        if (latest) zoneSensorData[zoneId] = latest;
      } catch (err) {
        zoneSensorData[zoneId] = null;
      }
    }));

    // 3. For each plant, map the correct sensor readings
    const profiles = [];
    for (const plant of allPlants) {
      try {
        const res = await api.get(`/plants/${plant.plantId}`);
        const plantProfile = res.data;
        const zoneData = zoneSensorData[plant.zone];

        // Default values
        let soilMoisture = null, temperature = null, lightLevel = null, humidity = null, airQuality = null;

        if (zoneData) {
          // Map soil moisture by pin
          if (Array.isArray(zoneData.soilMoistureByPin)) {
            const pinData = zoneData.soilMoistureByPin.find(
              s => String(s.pin) === String(plant.moisturePin)
            );
            soilMoisture = pinData ? pinData.soilMoisture : null;
          }
          // Map other sensors
          temperature = zoneData.zoneSensors?.temp ?? null;
          lightLevel = zoneData.zoneSensors?.light ?? null;
          humidity = zoneData.zoneSensors?.humidity ?? null;
          airQuality = zoneData.zoneSensors?.airQuality ?? null;
        }

        profiles.push({
          ...plantProfile,
          soilMoisture,
          temperature,
          lightLevel,
          humidity,
          airQuality,
        });
      } catch (err) {
        console.error(`Error fetching plant profile for ${plant.plantId}:`, err);
      }
    }
    setPlants(profiles);
  };

  useEffect(() => {
    fetchAllPlantsAndSensors();
  }, []);

  // Edit threshold handlers
  const handleEditThreshold = (plant) => {
    console.log('Editing plant:', plant); // Add this line
    setEditedPlant({ ...plant });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editedPlant?.plantId) {
      alert('No plant selected or plant ID missing!');
      return;
    }
    try {
      // Only send moisture thresholds in the request body
      await api.put(
        `/plants/${editedPlant.plantId}/thresholds`,
        { moisture: editedPlant.thresholds.moisture }
      );
      await fetchAllPlantsAndSensors(); // Call your fetch function to update the UI
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update thresholds", err);
    }
  };

  // Group plants by zone
  const plantsByZone = zoneIds.reduce((acc, zoneId) => {
    acc[zoneId] = plants.filter(p => p.zone === zoneId);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main plant monitoring section */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Plant Monitoring</h2>
        {zoneIds.map(zoneId => (
          plantsByZone[zoneId] && plantsByZone[zoneId].length > 0 && (
            <ZoneSection
              key={zoneId}
              zoneId={zoneId}
              zoneName={zoneId.replace(/^zone/, 'Zone ')}
              plants={plantsByZone[zoneId]}
              onEditThreshold={handleEditThreshold}
              // Optionally pass onEditPlant, onDeletePlant if you want those features
            />
          )
        ))}
        {/* <ActivityLogCard /> */}
      </div>
      {/* Right sidebar */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900">System Status</h2>
        {/* <SystemStatusCard /> */}
        <SystemThresholdCard /> {/* <-- Add this line to show the system thresholds card */}
        {/* <WeatherCard /> */}
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
              <div className="grid grid-cols-1 gap-4">
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

