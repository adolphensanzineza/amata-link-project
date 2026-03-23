import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import milkRoutes from './routes/milkRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

// Middleware
if (process.env.NODE_ENV === 'production') {
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
} else {
  app.use(cors({ origin: true, credentials: true }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/milk', milkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AmataLink API irakora neza' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ibyago mu byakozwe' });
});

// Start server
async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('Connected to MySQL (amatalink) successfully');
  } catch (err) {
    console.error('Unable to connect to MySQL:', err.message || err);
  }

  app.listen(PORT, () => {
    console.log(`AmataLink server running on port ${PORT}`);
  });
}

start();

export default app;
