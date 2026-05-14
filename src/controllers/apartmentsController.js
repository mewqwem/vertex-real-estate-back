import createHttpError from 'http-errors';
import { Apartment } from '../models/apartments.js';

export const getAparmtents = async (req, res) => {
  const apartments = await Apartment.find();
  res.status(200).json({
    success: true,
    data: apartments,
    count: apartments.length,
  });
};
export const getAparmtentById = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    console.log('Searching for ID:', apartmentId); // Перевір, що приходить

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      // return res.status(404).json({ message: 'Apartment not found in DB' });

      throw createHttpError(404, 'Apartment not found');
    }

    res.status(200).json(apartment);
  } catch (error) {
    console.error('Backend Error:', error.message);
    res.status(400).json({ message: 'Invalid ID format or Server Error' });
  }
};
