import createHttpError from 'http-errors';
import { Apartment } from '../models/apartments.js';

export const getAparmtents = async (req, res) => {
  const { page = 1, perPage = 10, minPrice, maxPrice, rooms, area } = req.query;

  const skip = (page - 1) * perPage;

  const apartmentsQuery = Apartment.find();

  if (minPrice != null) apartmentsQuery.where('price').gte(minPrice);
  if (maxPrice != null) apartmentsQuery.where('price').lte(maxPrice);
  if (rooms) {
    apartmentsQuery.where('rooms').equals(rooms);
  }
  if (area) {
    apartmentsQuery.where('area').equals(area);
  }

  const [totalItems, apartments] = await Promise.all([
    apartmentsQuery.clone().countDocuments(),
    apartmentsQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage) || 0;

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    apartments,
  });
};

export const getAparmtentById = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    console.log('Searching for ID:', apartmentId);

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      throw createHttpError(404, 'Apartment not found');
    }

    res.status(200).json(apartment);
  } catch (error) {
    console.error('Backend Error:', error.message);
    res.status(400).json({ message: 'Invalid ID format or Server Error' });
  }
};

export const createApartment = async (req, res) => {
  const apartment = await Apartment.create(req.body);
  res.status(201).json(apartment);
};

export const deleteApartment = async (req, res) => {
  const apartment = await Apartment.findByIdAndDelete(req.params.id);
  res.status(200).json(apartment);
};

export const updateApartment = async (req, res) => {
  const { id } = req.params;

  const apartment = await Apartment.findByIdAndUpdate(id, req.body, {
    returnDocument: 'after',
  });

  if (!apartment) {
    throw createHttpError(404, 'Apartment not found');
  }

  res.status(200).json(apartment);
};
