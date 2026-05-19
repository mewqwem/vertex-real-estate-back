# RealVertexEstate Backend API 🏘️

Vertex Real Estate Backend is a robust Node.js API that powers the modern real estate search platform. It provides comprehensive endpoints for managing properties, handling data validation, and serving the frontend application.

## Demo

Live: https://vertex-real-estate-back.onrender.com/

Frontend repository: https://github.com/mewqwem/vertex-real-estate

## Tech Stack

### Core Technologies

- **Node.js** — JavaScript runtime environment
- **Express.js 5.2.1** — Fast and minimal web framework
- **MongoDB** — NoSQL database for flexible data storage
- **Mongoose 9.6.2** — Object Data Modeling (ODM) library for MongoDB

### Admin Management

- **adminjs** — Automatic admin panel generator
- **@adminjs/express** — AdminJS integration with Express
- **@adminjs/mongoose** — AdminJS integration with Mongoose for MongoDB models

### Validation & Security

- **celebrate** — Data validation and sanitization middleware
- **cors** — Cross-Origin Resource Sharing (CORS) middleware
- **http-errors** — HTTP error utilities
- **express-session** — Session management middleware

### Logging

- **pino** — Fast JSON logger
- **pino-http** — HTTP logging middleware for Pino
- **pino-pretty** — Pretty-printing for Pino logs

### Configuration

- **dotenv** — Environment variable management

### Development Tools

- **nodemon** — Automatic server restart on file changes
- **@faker-js/faker** — Fake data generation for seeding
- **ESLint** — Code quality and linting

---

## 🛠️ Installation & Setup

Follow these steps to run the backend locally:

### 1. Clone the Repository

```bash
git clone https://github.com/mewqwem/vertex-real-estate-back
cd vertex-real-estate-back
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env` file in the root directory of the backend project and add your configuration:

```bash
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Run the Development Server

Start the local development server:

```bash
npm run dev
```

The server will be running at `http://localhost:5000`

---

## 📍 Address Autocomplete Feature

### Local Development

The backend includes a powerful **Address Autocomplete** feature for the Admin Manager when running locally:

- **Enabled on localhost** — Full address auto-completion with suggestions
- **Real-time address lookup** — Integrated with Google Maps API
- **Seamless property management** — Managers can quickly add and update property addresses

### Production Limitation

Unfortunately, the Address Autocomplete feature is **not available on the deployed version** due to:

- Free tier deployment restrictions on external API calls
- Limited resources on the hosting platform
- Google Maps API rate limiting on free tier

To use the full address autocomplete functionality, run the application locally or upgrade to a paid hosting plan with unrestricted API access.

---

## 🔌 API Endpoints

### Properties

- `GET /api/apartments` — Fetch all properties with optional filters
- `GET /api/apartments/:id` — Get a specific property by ID
- `POST /api/apartments` — Create a new property (admin only)
- `PUT /api/apartments/:id` — Update a property (admin only)
- `DELETE /api/apartments/:id` — Delete a property (admin only)

### Admin Panel

- `/admin` — Access the AdminJS dashboard
- Full CRUD operations available through the admin interface

---

## Build & Deployment

To prepare for production deployment:

```bash
npm run build
npm start
```

The server will be running and ready to handle requests.

---

## 🏗️ Project Structure

```
vertex-real-estate-back/
├── src/
│   ├── server.js              — Express app initialization
│   ├── controllers/           — Request handlers
│   ├── models/                — Mongoose schemas
│   ├── routes/                — API routes
│   ├── validations/           — Data validation schemas
│   ├── middleware/            — Custom middleware
│   └── admin/                 — AdminJS configuration
├── db/
│   └── connectMongoDB.js      — MongoDB connection
├── scripts/
│   ├── seed.js                — Database seeding script
│   └── build.admin.js         — Admin build script
├── data/
│   └── apartments.json        — Sample property data
└── .env                       — Environment variables
```

---

## Author

Oleh

Student & Full-stack Developer.

- [@mewqwem](https://github.com/mewqwem)
