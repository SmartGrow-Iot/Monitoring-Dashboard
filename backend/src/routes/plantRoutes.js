import express from 'express';
import { createPlant, fetchPlantById } from '../controllers/plantController.js';

const router = express.Router();

router.post('/', createPlant);
router.get('/:plantId', fetchPlantById);

export default router;
