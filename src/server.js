import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from '../db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import apartmentsRoutes from './routes/apartmentsRoutes.js';

const app = express();

app.use(logger);
app.use(express.json());
app.use(cors());
//? middlewares
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

//! handlers
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

app.use(apartmentsRoutes);
app.use(notFoundHandler);

app.use(errorHandler);

await connectMongoDB();

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
