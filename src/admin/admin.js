// tsx code wrapped in js block as requested
import AdminJS, { ValidationError, ComponentLoader } from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { Apartment } from '../models/apartments.js';
import path from 'path';
import { fileURLToPath } from 'url';

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentLoader = new ComponentLoader();

const AddressAutocompleteComponent = componentLoader.add(
  'AddressAutocomplete',
  path.join(__dirname, './components/AddressAutocomplete.jsx'),
);

export const adminJs = new AdminJS({
  componentLoader,
  rootPath: '/admin',
  resources: [
    {
      resource: Apartment,
      options: {
        navigation: { name: 'Real Estate', icon: 'Home' },
        listProperties: [
          'title',
          'price',
          'dealType',
          'apartmentType',
          'status',
        ],
        filterProperties: [
          'title',
          'price',
          'dealType',
          'apartmentType',
          'status',
          'rooms',
        ],
        properties: {
          description: { type: 'richtext' },
          features: {
            type: 'string',
            isArray: true,
            availableValues: [
              { value: 'wifi', label: 'Wi-Fi' },
              { value: 'parking', label: 'Parking' },
              { value: 'ac', label: 'Air Conditioning' },
              { value: 'kitchen', label: 'Kitchen' },
              { value: 'balcony', label: 'Balcony' },
              { value: 'gym', label: 'Gym' },
              { value: 'security', label: '24/7 Security' },
            ],
          },
          images: { type: 'string', isArray: true },
          currency: {
            isVisible: {
              list: true,
              show: true,
              edit: false,
              filter: true,
              new: false,
            },
          },
          createdAt: {
            isVisible: {
              list: true,
              show: true,
              edit: false,
              filter: true,
              new: false,
            },
          },
          updatedAt: {
            isVisible: {
              list: true,
              show: true,
              edit: false,
              filter: true,
              new: false,
            },
          },
          location: {
            components: {
              edit: AddressAutocompleteComponent,
              new: AddressAutocompleteComponent,
            },
          },
          'location.lat': {
            isVisible: {
              list: false,
              show: true,
              edit: false,
              filter: false,
              new: false,
            },
          },
          'location.lng': {
            isVisible: {
              list: false,
              show: true,
              edit: false,
              filter: false,
              new: false,
            },
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if (!request.payload) return request;
              const errors = {};
              if (
                request.payload.price &&
                Number(request.payload.price) < 100
              ) {
                errors.price = { message: 'Price cannot be less than $100' };
              }
              const floor = Number(request.payload.floor);
              const totalFloors = Number(request.payload.totalFloors);
              if (!isNaN(floor) && !isNaN(totalFloors) && totalFloors < floor) {
                errors.totalFloors = {
                  message:
                    'Total floors must be greater than or equal to the apartment floor',
                };
              }
              if (Object.keys(errors).length > 0)
                throw new ValidationError(errors);
              return request;
            },
          },
          edit: {
            before: async (request) => {
              if (!request.payload) return request;
              const errors = {};
              if (
                request.payload.price &&
                Number(request.payload.price) < 100
              ) {
                errors.price = { message: 'Price cannot be less than $100' };
              }
              const floor = Number(request.payload.floor);
              const totalFloors = Number(request.payload.totalFloors);
              if (!isNaN(floor) && !isNaN(totalFloors) && totalFloors < floor) {
                errors.totalFloors = {
                  message:
                    'Total floors must be greater than or equal to the apartment floor',
                };
              }
              if (Object.keys(errors).length > 0)
                throw new ValidationError(errors);
              return request;
            },
          },
        },
      },
    },
  ],
});
