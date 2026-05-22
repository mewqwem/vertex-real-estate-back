import { Router } from 'express';
import {
  createApartment,
  deleteApartment,
  getAparmtentById,
  getAparmtents,
  getHotOffers,
  updateApartment,
} from '../controllers/apartmentsController.js';
import { celebrate } from 'celebrate';
import {
  apartmentParamSchema,
  createApartmentSchema,
  getApartmentsSchema,
  updateApartmentSchema,
} from '../validations/apartmentValidation.js';

const router = Router();

router.get('/apartments', celebrate(getApartmentsSchema), getAparmtents);

router.get('/apartments/test/hotoffers', getHotOffers);

router.get(
  '/apartments/:id',
  celebrate(apartmentParamSchema),
  getAparmtentById,
);

router.post('/apartments', celebrate(createApartmentSchema), createApartment);

router.delete(
  '/apartments/:id',
  celebrate(apartmentParamSchema),
  deleteApartment,
);

router.patch(
  '/apartments/:id',
  celebrate(updateApartmentSchema),
  updateApartment,
);

export default router;
