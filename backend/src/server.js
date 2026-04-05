import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoMemoryServer } from 'mongodb-memory-server';
import reportRoutes from './routes/reportRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import labRoutes from './routes/labRoutes.js';
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import { getCurrentAccount } from './controllers/accountController.js';
import { authenticate, authorize } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

const isHostedEnvironment = Boolean(
  process.env.RENDER ||
  process.env.RENDER_EXTERNAL_URL ||
  process.env.NODE_ENV === 'production'
);

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001,http://localhost:5000')
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

  const configuredUri = process.env.MONGODB_URI?.trim();

  if (configuredUri) {
    await mongoose.connect(configuredUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected using MONGODB_URI');
    return;
  }

  if (isHostedEnvironment) {
    throw new Error('MONGODB_URI is required in hosted environments. Configure a managed MongoDB database before starting the server.');
  }

  const localUri = 'mongodb://127.0.0.1:27017/pathology_db';

  try {
    await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected at ${localUri}`);
    return;
  } catch (err) {
    console.warn(`MongoDB connection failed at ${localUri}: ${err.message}`);
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

  // Authentication route
  app.use('/api/auth', authRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Pathology Report Generator API is running' });
  });

  // Account status endpoint for authenticated users
  app.get('/api/account/me', authenticate, getCurrentAccount);

  // Account management for master admin only
  app.use('/api/admin/accounts', authenticate, authorize('master'), accountRoutes);

  // Protected API routes for customers and master
  app.use('/api/reports', authenticate, reportRoutes);
  app.use('/api/patients', authenticate, patientRoutes);
  app.use('/api/lab', authenticate, labRoutes);
  app.use('/api/tests', authenticate, testRoutes);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');

  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
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
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please stop the existing process or set a different PORT environment variable.`);
    } else {
      console.error('Server failed to start:', err);
    }
    process.exit(1);
  });
};

startApp().catch((err) => {
  console.error('Failed to start app:', err);
  process.exit(1);
});
