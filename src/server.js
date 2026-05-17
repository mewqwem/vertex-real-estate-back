import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from '../db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import apartmentsRoutes from './routes/apartmentsRoutes.js';
import { errors } from 'celebrate';
import AdminJSExpress from '@adminjs/express';
import { adminJs } from './admin/admin.js';

const app = express();

app.use(express.static('public'));

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      if (email === 'admin@test.com' && password === 'password123') {
        return { email: 'admin@test.com' };
      }
      return null;
    },
    cookieName: 'adminjs',
    cookiePassword: 'some-super-secret-password-used-to-encrypt-cookies',
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
    secret: 'session-secret-key',
  },
);

if (process.env.NODE_ENV !== 'production') {
  await adminJs.initialize();
}

app.use(adminJs.options.rootPath, adminRouter);

app.use(logger);
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

app.use(apartmentsRoutes);
app.use(notFoundHandler);

app.use(errors());
app.use(errorHandler);

await connectMongoDB();

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
