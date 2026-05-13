import { Schema } from 'mongoose';
import { model } from 'mongoose';

const apartmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    rooms: {
      type: Number,
      required: true,
      min: 1,
    },
    area: {
      type: Number,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    totalFloors: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: ['Активна', 'Продано', 'Архів'],
      default: 'Активна',
    },
  },
  {
    timestamps: true,
  },
);

export const Apartment = model('Apartment', apartmentSchema);
