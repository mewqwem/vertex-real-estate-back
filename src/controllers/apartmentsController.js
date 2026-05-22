import createHttpError from 'http-errors';
import { Apartment } from '../models/apartments.js';

export const getAparmtents = async (req, res) => {
  const {
    page: pageQuery,
    perPage: perPageQuery,
    minPrice,
    maxPrice,
    rooms,
    area,
    location,
    dealType,
    apartmentType,
  } = req.query;

  const page = Math.max(1, Number(pageQuery) || 1);
  const perPage = Math.max(1, Number(perPageQuery) || 10);
  const skip = (page - 1) * perPage;

  const apartmentsQuery = Apartment.find();

  if (minPrice != null) {
    apartmentsQuery.where('price').gte(Number(minPrice));
  }
  if (maxPrice != null) {
    apartmentsQuery.where('price').lte(Number(maxPrice));
  }
  if (rooms) {
    const roomsNum = Number(rooms);
    if (roomsNum >= 4) {
      apartmentsQuery.where('rooms').gte(4);
    } else {
      apartmentsQuery.where('rooms').equals(roomsNum);
    }
  }
  if (area) {
    apartmentsQuery.where('area').gte(Number(area));
  }
  if (location?.trim()) {
    apartmentsQuery.where('location.address', {
      $regex: location.trim(),
      $options: 'i',
    });
  }
  if (dealType) {
    apartmentsQuery.where('dealType').equals(dealType);
  }
  if (apartmentType) {
    apartmentsQuery.where('apartmentType').equals(apartmentType);
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

export const getHotOffers = async (req, res, next) => {
  try {
    const TARGET_COUNT = 5;

    let hotApartments = await Apartment.find({
      salePrice: { $ne: null },
    })
      .sort({ createdAt: -1 })
      .limit(TARGET_COUNT);

    const neededCount = TARGET_COUNT - hotApartments.length;

    if (neededCount > 0) {
      const alreadyIncludedIds = hotApartments.map((apt) => apt._id);

      const regularApartments = await Apartment.find({
        _id: { $nin: alreadyIncludedIds },
      })
        .sort({ createdAt: -1 })
        .limit(neededCount);

      hotApartments = [...hotApartments, ...regularApartments];
    }

    res.status(200).json(hotApartments);
  } catch (error) {
    next(error);
  }
};

export const getAparmtentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findById(id);

    if (!apartment) {
      throw createHttpError(404, 'Apartment not found');
    }

    res.status(200).json(apartment);
  } catch (error) {
    next(error);
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
