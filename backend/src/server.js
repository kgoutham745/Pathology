import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import reportRoutes from './routes/reportRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import labRoutes from './routes/labRoutes.js';
import testRoutes from './routes/testRoutes.js';

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy blocked origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database Connection
const connectDatabase = async () => {
  mongoose.set('strictQuery', false);

  const localUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pathology_db';

  try {
    await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected at ${localUri}`);
    return;
  } catch (err) {
    console.warn(`MongoDB connection failed at ${localUri}: ${err.message}`);
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Unable to connect to MongoDB in production mode. Please configure MONGODB_URI.');
  }

  const memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri();

  await mongoose.connect(memoryUri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(`MongoDB memory server started at ${memoryUri}`);
};

const startApp = async () => {
  await connectDatabase();

  // Routes
  app.use('/api/reports', reportRoutes);
  app.use('/api/patients', patientRoutes);
  app.use('/api/lab', labRoutes);
  app.use('/api/tests', testRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Pathology Report Generator API is running' });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
      status: err.status || 500,
    });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startApp().catch((err) => {
  console.error('Failed to start app:', err);
  process.exit(1);
});
