// tsx code wrapped in js block as requested
import AdminJS, { ValidationError } from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { Apartment } from '../models/apartments.js';
import path from 'path';
import os from 'os';

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

export const adminJs = new AdminJS({
  rootPath: '/admin',

  bundler: {
    fileCaching: false,
    dest: path.join(os.tmpdir(), '.adminjs'),
  },

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

          'location.lat': {
            isVisible: {
              list: true,
              show: true,
              edit: true,
              filter: true,
              new: true,
            },
          },
          'location.lng': {
            isVisible: {
              list: true,
              show: true,
              edit: true,
              filter: true,
              new: true,
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
