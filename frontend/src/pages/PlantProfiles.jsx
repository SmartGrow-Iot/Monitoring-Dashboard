import React, { useState, useEffect, useContext } from 'react';
import { Plane as Plant, Plus, Save } from 'lucide-react';
import Modal from '../components/ui/Modal';
import api from '../api/api'; // Make sure this is your axios instance
import { AuthContext } from '../context/AuthContext';

const zoneIds = ['zone1', 'zone2', 'zone3', 'zone4']; // Updated zone list
const esp32List = ['esp32-1', 'esp32-2', 'esp32-3']; // Placeholder ESP32 devices
const pinList = [34, 35, 36, 39]; // Updated pin list

const PlantProfiles = () => {
  const { user } = useContext(AuthContext);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [editedPlant, setEditedPlant] = useState(null);
  const [newPlant, setNewPlant] = useState({
    name: '',
    image: '',
    zone: '',
    moisturePin: '',
    thresholds: {
      moisture: { min: 0, max: 0 }
    },
    careNotes: ''
  });
  const [plantProfiles, setPlantProfiles] = useState([]);

  // 1. Define fetchAllPlantProfiles at the top level of your component
  const fetchAllPlantProfiles = async () => {
    let allPlantIds = [];
    for (const zoneId of zoneIds) {
      try {
        const res = await api.get(`/zones/${zoneId}/plants`);
        if (res.data && Array.isArray(res.data.plants)) {
          allPlantIds = [...allPlantIds, ...res.data.plants.map(p => p.plantId)];
        }
      } catch (err) {
        console.error(`Error fetching plants for zone ${zoneId}:`, err);
      }
    }
    const profiles = [];
    for (const plantId of allPlantIds) {
      try {
        const res = await api.get(`/plants/${plantId}`);
        profiles.push(res.data);
      } catch (err) {
        console.error(`Error fetching plant profile for ${plantId}:`, err);
      }
    }
    setPlantProfiles(profiles);
  };

  // Fetch all plant profiles by zone
  useEffect(() => {
    fetchAllPlantProfiles();
  }, []);

  const handleViewDetails = (plant) => {
    setSelectedPlant(plant);
    setIsViewModalOpen(true);
  };

  const handleEditProfile = (plant) => {
    setEditedPlant({ ...plant });
    setIsEditModalOpen(true);
  };

  // Edit handler: only allow editing moisture thresholds
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/plants/${editedPlant.plantId}/thresholds`,
        { moisture: editedPlant.thresholds.moisture }
      );
      setIsEditModalOpen(false);
      fetchAllPlantProfiles();
    } catch (err) {
      console.error("Failed to update thresholds", err);
    }
  };

  // Add Plant Modal handler with validation
  const handleAddPlant = async (e) => {
    e.preventDefault();

    if (!newPlant.zone || !newPlant.moisturePin) {
      alert('Please select a zone and pin.');
      return;
    }

    try {
      const requestBody = {
        name: newPlant.name,
        userId: user?.uid || user?.email || 'unknown',
        zone: newPlant.zone,
        moisturePin: Number(newPlant.moisturePin),
        thresholds: {
          moisture: { ...newPlant.thresholds.moisture }
        },
        type: 'vegetable',
        description: newPlant.careNotes,
        image: newPlant.image,
        growthTime: 30
      };

      const response = await api.post('/plants', requestBody);
      const createdPlant = response.data;
      setIsAddModalOpen(false);
      setNewPlant({
        name: '',
        image: '',
        zone: '',
        moisturePin: '',
        thresholds: {
          moisture: { min: 0, max: 0 }
        },
        careNotes: ''
      });
      setPlantProfiles(prev => [...prev, createdPlant]);
    } catch (err) {
      alert('Error adding plant: ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-neutral-900">Plant Profiles</h2>
        <button 
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} />
          <span>Add Plant</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Plant profile cards */}
        {plantProfiles.map(plant => (
          <div key={plant.plantId} className="card hover:shadow-lg transition-shadow">
            {/* Plant image */}
            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
              <img 
                src={plant.image} 
                alt={plant.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-semibold text-white">{plant.name}</h3>
              </div>
            </div>
            
            {/* Thresholds */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-neutral-700 mb-2">Threshold Settings</h4>
              <div className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-neutral-500">Moisture:</p>
                  <p>{plant.thresholds?.moisture?.min}% - {plant.thresholds?.moisture?.max}%</p>
                </div>
              </div>
            </div>
            
            {/* Care notes */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-neutral-700 mb-1">Care Notes</h4>
              <p className="text-sm text-neutral-600">{plant.description || plant.careNotes}</p>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <button 
                className="btn btn-outline text-sm"
                onClick={() => {
                  setSelectedPlant(plant);
                  setIsViewModalOpen(true);
                }}
              >
                View Details
              </button>
              <button 
                className="btn btn-primary text-sm"
                onClick={() => {
                  setEditedPlant(plant);
                  setIsEditModalOpen(true);
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        ))}
        
        {/* Add new plant card */}
        <div 
          className="card hover:shadow-lg transition-shadow flex flex-col items-center justify-center py-8 border-2 border-dashed border-neutral-200 cursor-pointer"
          onClick={() => setIsAddModalOpen(true)}
        >
          <div className="bg-primary-light/10 p-4 rounded-full mb-3">
            <Plant size={24} className="text-primary" />
          </div>
          <h3 className="text-lg font-medium text-neutral-800 mb-1">Add New Plant</h3>
          <p className="text-sm text-neutral-500 text-center mb-4 max-w-xs">
            Create a new plant profile to monitor and customize care settings
          </p>
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} />
            <span>Add Plant</span>
          </button>
        </div>
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedPlant?.name || 'Plant Details'}
      >
        {selectedPlant && (
          <div className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img 
                src={selectedPlant.image} 
                alt={selectedPlant.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Plant Info Section */}
            <div className="grid grid-cols-1 gap-2 p-4 bg-neutral-50 rounded-lg">
              <div>
                <span className="text-sm text-neutral-500">Plant ID:</span>
                <span className="ml-2 font-mono text-neutral-800">{selectedPlant.plantId}</span>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Moisture Pin:</span>
                <span className="ml-2 font-mono text-neutral-800">{selectedPlant.moisturePin}</span>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Zone:</span>
                <span className="ml-2 font-mono text-neutral-800">{selectedPlant.zone}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-neutral-900 mb-2">Threshold Settings</h4>
              <div className="grid grid-cols-1 gap-4 p-4 bg-neutral-50 rounded-lg">
                <div>
                  <p className="text-sm text-neutral-500">Moisture Range</p>
                  <p className="font-medium">
                    {selectedPlant?.thresholds?.moisture
                      ? `${selectedPlant.thresholds.moisture.min}% - ${selectedPlant.thresholds.moisture.max}%`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-neutral-900 mb-2">Care Instructions</h4>
              <p className="text-neutral-600">{selectedPlant.careNotes}</p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditProfile(selectedPlant);
                }}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${editedPlant?.name || 'Plant'} Profile`}
      >
        {editedPlant && (
          <form onSubmit={handleSaveEdit} className="space-y-4">

            <div className="space-y-3">
              <h4 className="font-medium text-neutral-900">Thresholds</h4>
              
              <div className="grid grid-cols-1 gap-4">
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
                      className="w-20 rounded-md border border-neutral-300 px-2 py-1 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
                      className="w-20 rounded-md border border-neutral-300 px-2 py-1 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
              <button type="submit" className="btn btn-primary flex items-center gap-2">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Plant Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Plant"
      >
        <form onSubmit={handleAddPlant} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Plant Name
            </label>
            <input
              type="text"
              required
              value={newPlant.name}
              onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
              className="block w-full rounded-md border border-neutral-300 px-3 py-2"
              placeholder="Enter plant name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              required
              value={newPlant.image}
              onChange={(e) => setNewPlant({ ...newPlant, image: e.target.value })}
              className="block w-full rounded-md border border-neutral-300 px-3 py-2"
              placeholder="Enter image URL"
            />
          </div>

          {/* Zone */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Zone
            </label>
            <select
              value={newPlant.zone}
              onChange={e => setNewPlant({ ...newPlant, zone: e.target.value })}
              className="block w-full rounded-md border border-neutral-300 px-3 py-2"
              required
            >
              <option value="">Select Zone</option>
              {zoneIds.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>

          {/* Pin */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Moisture Pin
            </label>
            <select
              value={newPlant.moisturePin}
              onChange={e => setNewPlant({ ...newPlant, moisturePin: e.target.value })}
              className="block w-full rounded-md border border-neutral-300 px-3 py-2"
              required
            >
              <option value="">Select Pin</option>
              {pinList.map(pin => (
                <option key={pin} value={pin}>{pin}</option>
              ))}
            </select>
          </div>

          {/* Care Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Care Notes
            </label>
            <textarea
              required
              value={newPlant.careNotes}
              onChange={(e) => setNewPlant({ ...newPlant, careNotes: e.target.value })}
              className="block w-full rounded-md border border-neutral-300 px-3 py-2"
              rows={3}
              placeholder="Enter care instructions"
            />
          </div>

          {/* Thresholds (moisture only) */}
          <div className="space-y-3">
            <h4 className="font-medium text-neutral-900">Thresholds</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-neutral-700 mb-1">
                  Moisture Range (%)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newPlant.thresholds.moisture.min}
                    onChange={(e) => setNewPlant({
                      ...newPlant,
                      thresholds: {
                        ...newPlant.thresholds,
                        moisture: { ...newPlant.thresholds.moisture, min: Number(e.target.value) }
                      }
                    })}
                    className="w-20 rounded-md border border-neutral-300 px-2 py-1 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="text-neutral-500">to</span>
                  <input
                    type="number"
                    value={newPlant.thresholds.moisture.max}
                    onChange={(e) => setNewPlant({
                      ...newPlant,
                      thresholds: {
                        ...newPlant.thresholds,
                        moisture: { ...newPlant.thresholds.moisture, max: Number(e.target.value) }
                      }
                    })}
                    className="w-20 rounded-md border border-neutral-300 px-2 py-1 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Plant
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlantProfiles;