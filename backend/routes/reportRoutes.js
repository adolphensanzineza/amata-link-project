import express from 'express';
import { exportPDF, exportExcel } from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All reporting routes require authentication
router.use(authenticateToken);

// Export routes
router.get('/export/pdf', exportPDF);
router.get('/export/excel', exportExcel);

export default router;
