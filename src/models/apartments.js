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
      address: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
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
    images: {
      type: Schema.Types.Mixed,
      default: [],
    },
    features: {
      type: Schema.Types.Mixed,
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Archive'],
      default: 'Active',
    },
    dealType: {
      type: String,
      enum: ['buy', 'rent'],
    },
    apartmentType: {
      type: String,
      enum: [
        'apartment',
        'house',
        'cottage',
        'villa',
        'townhouse',
        'duplex',
        'commercial',
      ],
    },
  },
  {
    timestamps: true,
  },
);

apartmentSchema.pre('save', async function () {
  if (
    this.features &&
    typeof this.features === 'object' &&
    !Array.isArray(this.features)
  ) {
    this.features = Object.values(this.features);
  }

  if (
    this.images &&
    typeof this.images === 'object' &&
    !Array.isArray(this.images)
  ) {
    this.images = Object.values(this.images);
  }
});

// Хук для редагування існуючої квартири
apartmentSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();

  if (update.$set) {
    if (
      update.$set.features &&
      typeof update.$set.features === 'object' &&
      !Array.isArray(update.$set.features)
    ) {
      update.$set.features = Object.values(update.$set.features);
    }

    if (
      update.$set.images &&
      typeof update.$set.images === 'object' &&
      !Array.isArray(update.$set.images)
    ) {
      update.$set.images = Object.values(update.$set.images);
    }
  }
});

export const Apartment = model('Apartment', apartmentSchema);
