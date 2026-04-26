import express from 'express';
import { exportPDF, exportExcel } from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public reporting routes

// Export routes
router.get('/export/pdf', authenticateToken, exportPDF);
router.get('/export/excel', authenticateToken, exportExcel);

export default router;
