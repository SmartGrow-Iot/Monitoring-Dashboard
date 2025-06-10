import { forwardPlantCreation, getPlantById } from '../services/plantService.js';

export const createPlant = async (req, res) => {
  try {
    const result = await forwardPlantCreation(req.body);
    res.status(201).json(result);
    console.log('Plant created successfully:', result);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || error.message;
    res.status(status).json({ error: message });
    console.error('Error creating plant:', message);
  }
};

export const fetchPlantById = async (req, res) => {
  try {
    const plantId = req.params.plantId;
    const result = await getPlantById(plantId);
    res.status(200).json(result);
    console.log('Fetched plant by id:', result);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || error.message;
    res.status(status).json({ error: message });
    console.error('Error fetching plant by id:', message);
  }
};
