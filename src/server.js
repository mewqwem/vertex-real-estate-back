import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import { connectMongoDB } from '../db/connectMongoDB.js';
import { Apartment } from './models/apartments.js';

const app = express();
await connectMongoDB();

//? middlewares
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

app.use(express.json());
app.use(cors());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

//! handlers
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

//! Apartments endpoints
app.get('/apartments', async (req, res) => {
  const apartments = await Apartment.find();
  res.status(200).json({
    success: true,
    data: apartments,
    count: apartments.length,
  });
});

app.get(`/apartments/:apartmentId`, async (req, res) => {
  try {
    const { apartmentId } = req.params;
    console.log('Searching for ID:', apartmentId); // Перевір, що приходить

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found in DB' });
    }

    res.status(200).json(apartment);
  } catch (error) {
    console.error('Backend Error:', error.message);
    res.status(400).json({ message: 'Invalid ID format or Server Error' });
  }
});
// app.get('/api/apartments/:id', 3(req, res) => {
//   const { id } = req.params;
//   const apartment = apartments.find((apt) => apt.id === parseInt(id));

//   if (!apartment) {
//     return res.status(404).json({
//       success: false,
//       message: `Квартира з ID ${id} не знайдена`,
//     });
//   }

//   res.status(200).json({
//     success: true,
//     data: apartment,
//   });
// });

//! 404
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found on method: ${req.method} 😭😭😭`,
  });
});

//! error
app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
});

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
