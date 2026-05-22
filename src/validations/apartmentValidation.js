import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const apartmentTypeValues = [
  'apartment',
  'house',
  'cottage',
  'villa',
  'townhouse',
  'duplex',
  'commercial',
];

export const getApartmentsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(20).default(10),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    salePrice: Joi.number().optional(),
    rooms: Joi.number().integer().positive().max(99).optional(),
    area: Joi.number().positive().optional(),
    location: Joi.string().trim().min(1).optional(),
    dealType: Joi.string().valid('buy', 'rent').optional(),
    apartmentType: Joi.string()
      .valid(...apartmentTypeValues)
      .optional(),
  }).custom((value, helpers) => {
    const { minPrice, maxPrice } = value;
    if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
      return helpers.message('Min price cannot be greater than max price');
    }
    return value;
  }),
};

const apartmentIdValidation = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid ID format') : value;
};

export const apartmentParamSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(apartmentIdValidation).required(),
  }),
};

export const updateApartmentSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(apartmentIdValidation).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().optional(),
    location: Joi.object({
      address: Joi.string().optional(),
      lat: Joi.number().min(-90).max(90).optional(),
      lng: Joi.number().min(-180).max(180).optional(),
    }).optional(),
    price: Joi.number().optional(),
    currency: Joi.string().optional(),
    rooms: Joi.number().integer().optional(),
    area: Joi.number().optional(),
    floor: Joi.number().integer().optional(),
    totalFloors: Joi.number().integer().optional(),
    description: Joi.string().min(10).max(1000).optional(),
    images: Joi.array()
      .items(Joi.string().uri({ scheme: ['http', 'https'] }))
      .min(1)
      .max(10)
      .optional(),
    features: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().optional(),
    salePrice: Joi.number().allow(null).optional().messages({
      'number.base': 'Sale price must be a number value',
    }),
  }),
};

export const createApartmentSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().required().messages({
      'string.base': 'Title must be a text value',
      'string.empty': 'Title cannot be empty',
      'any.required': 'Title is required',
    }),
    location: Joi.object({
      address: Joi.string().required().messages({
        'string.base': 'Address must be a text value',
        'string.empty': 'Address cannot be empty',
        'any.required': 'Address is required',
      }),
      lat: Joi.number().min(-90).max(90).required().messages({
        'number.base': 'Latitude must be a number',
        'number.min': 'Latitude must be between -90 and 90',
        'number.max': 'Latitude must be between -90 and 90',
        'any.required': 'Latitude is required',
      }),
      lng: Joi.number().min(-180).max(180).required().messages({
        'number.base': 'Longitude must be a number',
        'number.min': 'Longitude must be between -180 and 180',
        'number.max': 'Longitude must be between -180 and 180',
        'any.required': 'Longitude is required',
      }),
    })
      .required()
      .messages({
        'object.base': 'Location must include address and coordinates',
        'any.required': 'Location is required',
      }),
    price: Joi.number().required().messages({
      'number.base': 'Price must be a number',
      'any.required': 'Price is required',
    }),
    currency: Joi.string().default('USD').messages({
      'string.base': 'Currency must be a text value',
      'string.empty': 'Currency cannot be empty',
      'any.required': 'Currency is required',
    }),
    rooms: Joi.number()
      .required()
      .messages({
        'number.base': 'Number of rooms must be a number',
        'any.required': 'Number of rooms is required',
      })
      .integer(),
    area: Joi.number().required().messages({
      'number.base': 'Area must be a number',
      'any.required': 'Area is required',
    }),
    floor: Joi.number()
      .required()
      .messages({
        'number.base': 'Floor must be a number',
        'any.required': 'Floor is required',
      })
      .integer(),
    totalFloors: Joi.number()
      .required()
      .messages({
        'number.base': 'Total floors must be a number',
        'any.required': 'Total floors is required',
      })
      .integer(),
    description: Joi.string().required().min(10).max(1000).messages({
      'string.base': 'Description must be a text value',
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description must be at least {#limit} characters',
      'string.max': 'Description cannot exceed {#limit} characters',
      'any.required': 'Description is required',
    }),
    images: Joi.array()
      .items(
        Joi.string()
          .uri({ scheme: ['http', 'https'] })
          .required()
          .messages({
            'string.base': 'Each photo must be a text URL',
            'string.uri': 'Each photo must be a valid URL link (http or https)',
            'any.required': 'Each photo URL is required',
          }),
      )
      .min(1)
      .max(10)
      .required()
      .messages({
        'array.base': 'Photos must be provided as an array',
        'array.min': 'An apartment must have at least {#limit} photo',
        'array.max': 'You cannot upload more than {#limit} photos',
        'any.required': 'At least one photo is required',
      }),
    features: Joi.array().items(Joi.string()).required().messages({
      'array.base': 'Features must be provided as an array',
      'any.required': 'Features are required',
    }),
    status: Joi.string().required().messages({
      'string.base': 'Status must be a text value',
      'string.empty': 'Status cannot be empty',
      'any.required': 'Status is required',
    }),
    salePrice: Joi.number().allow(null).optional().messages({
      'number.base': 'Sale price must be a number value',
    }),
  }),
};
