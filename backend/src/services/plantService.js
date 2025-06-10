import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const api = axios.create({
  baseURL: process.env.EXTERNAL_API,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const forwardPlantCreation = async (data) => {
  const response = await api.post('/plants', data);
  console.log('Forwarded plant creation:', response.data);
  return response.data;
};

export const getPlantById = async (plantId) => {
  const response = await api.get(`/plants/${plantId}`);
  console.log('Forwarded get plant by id:', response.data);
  return response.data;
};
