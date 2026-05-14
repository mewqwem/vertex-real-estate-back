import { Router } from 'express';
import {
  getAparmtentById,
  getAparmtents,
} from '../controllers/apartmentsController.js';

const router = Router();

router.get('/apartments', getAparmtents);

router.get(`/apartments/:apartmentId`, getAparmtentById);

export default router;
