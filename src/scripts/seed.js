import 'dotenv/config';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { Apartment } from '../src/models/apartments.js';

const SEED_COUNT = 50;

const amenitiesList = [
  'Wi-Fi',
  'Smart TV',
  'Air Conditioning',
  'Parking',
  'Balcony',
  'Heating',
  'Washing Machine',
  'Dishwasher',
  'Gym',
  'Pool',
  'Security',
  'Elevator',
];

const apartmentTypes = [
  'apartment',
  'house',
  'cottage',
  'villa',
  'townhouse',
  'duplex',
  'commercial',
];

const cities = [
  { name: 'Kyiv', lat: [50.35, 50.55], lng: [30.4, 30.75] },
  { name: 'Lviv', lat: [49.78, 49.88], lng: [23.9, 24.1] },
  { name: 'Odesa', lat: [46.4, 46.55], lng: [30.6, 30.8] },
  { name: 'Kharkiv', lat: [49.92, 50.1], lng: [36.15, 36.35] },
  { name: 'Dnipro', lat: [48.4, 48.55], lng: [34.95, 35.15] },
];

function randomInRange([min, max]) {
  return faker.number.float({ min, max, fractionDigits: 4 });
}

function buildMockApartment(index) {
  const dealType = faker.helpers.arrayElement(['buy', 'rent']);
  const apartmentType = faker.helpers.arrayElement(apartmentTypes);
  const city = faker.helpers.arrayElement(cities);
  const rooms = faker.number.int({ min: 1, max: 6 });
  const area =
    rooms * faker.number.int({ min: 15, max: 30 }) +
    faker.number.int({ min: 5, max: 20 });

  const price =
    dealType === 'rent'
      ? faker.number.int({ min: 300, max: 3000 })
      : faker.number.int({ min: 35000, max: 500000 });

  const isHouse = ['house', 'cottage', 'villa', 'townhouse'].includes(
    apartmentType,
  );
  const totalFloors = isHouse
    ? faker.number.int({ min: 1, max: 3 })
    : faker.number.int({ min: 5, max: 30 });
  const floor = isHouse ? 1 : faker.number.int({ min: 1, max: totalFloors });

  const street = faker.location.streetAddress();

  return {
    title: `${rooms}-room ${apartmentType} in ${city.name}`,
    location: {
      address: `${city.name}, ${street}`,
      lat: randomInRange(city.lat),
      lng: randomInRange(city.lng),
    },
    price,
    currency: 'USD',
    rooms,
    area,
    floor,
    totalFloors,
    description: faker.lorem.paragraphs({ min: 2, max: 3 }),
    image: `https://picsum.photos/seed/apartment-${index}/800/600`,
    features: faker.helpers.arrayElements(amenitiesList, { min: 2, max: 7 }),
    status: faker.helpers.weightedArrayElement([
      { value: 'Активна', weight: 8 },
      { value: 'Продано', weight: 1 },
      { value: 'Архів', weight: 1 },
    ]),
    dealType,
    apartmentType,
  };
}

async function seedDatabase() {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    console.error('MONGO_URL is not set. Add it to your .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');

    await Apartment.deleteMany({});
    console.log('Cleared old apartments');

    const mockApartments = Array.from({ length: SEED_COUNT }, (_, index) =>
      buildMockApartment(index),
    );

    const result = await Apartment.insertMany(mockApartments);
    console.log(`Inserted ${result.length} apartments`);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

seedDatabase();
