import express from 'express';
import { exportPDF, exportExcel, getReportData } from '../controllers/reportController.js';
import { generateAndSendMonthlyReports } from '../controllers/automatedReportController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// JSON data endpoint — fetch records for on-screen display
router.get('/data', authenticateToken, getReportData);

// Export routes — support both /pdf and /export/pdf (frontend uses /export/pdf)
router.get('/pdf', authenticateToken, exportPDF);
router.get('/export/pdf', authenticateToken, exportPDF);
router.get('/excel', authenticateToken, exportExcel);
router.get('/export/excel', authenticateToken, exportExcel);

// Manual trigger for testing (Admin only)
router.post('/trigger-automated', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        await generateAndSendMonthlyReports();
        res.json({ message: 'Automated reports triggered successfully' });
    } catch (error) {
        console.error('Trigger Error:', error);
        res.status(500).json({ message: 'Error triggering reports' });
    }
});

export default router;
