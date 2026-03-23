import express from 'express';
import {
  getAllFarmers,
  getAllCollectors,
  getAllMilkRecords,
  getRecordsByFarmer,
  confirmMilkRecord,
  getDashboardStats,
  getMonthlyReport,
  getWeeklyReport,
  getYearlyReport,
  getCustomDateRangeReport,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getSettings,
  updateSettings,
  getPaginatedMilkRecords,
  removeDuplicates,
  exportData
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Settings routes - allow both admin and collector to get/update settings
router.get('/settings', getSettings);
router.put('/settings', (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'collector') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
}, updateSettings);

// Update user (allowed for admin and collector with controller-level checks)
router.put('/users/:id', (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'collector') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
}, updateUser);

// Delete user (allowed for admin and collector with controller-level checks)
router.delete('/users/:id', (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'collector') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
}, deleteUser);

// All other routes require admin role
router.use(requireRole('admin'));

// Get all farmers
router.get('/farmers', getAllFarmers);

// Get all collectors
router.get('/collectors', getAllCollectors);

// Get all milk records
router.get('/milk-records', getAllMilkRecords);

// Get records by farmer
router.get('/milk-records/farmer/:farmerId', getRecordsByFarmer);

// Get paginated records
router.get('/milk-records/paginated', getPaginatedMilkRecords);

// Confirm/reject milk record
router.put('/milk-records/:recordId/confirm', confirmMilkRecord);

// Get dashboard statistics
router.get('/dashboard-stats', getDashboardStats);

// Get monthly report
router.get('/reports/monthly/:month/:year', getMonthlyReport);

// Get weekly report
router.get('/reports/weekly/:startDate/:endDate', getWeeklyReport);

// Get yearly report
router.get('/reports/yearly/:year', getYearlyReport);

// Get custom date range report
router.post('/reports/custom', getCustomDateRangeReport);

// Get all users
router.get('/users', getAllUsers);

// Create new user (admin only)
router.post('/users', createUser);

// Remove duplicates
router.post('/remove-duplicates', removeDuplicates);

// Export data
router.get('/export', exportData);

export default router;
