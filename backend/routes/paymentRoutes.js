import express from 'express';
import { listPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod, setUserPayment } from '../controllers/paymentController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public: list active methods
router.get('/methods', listPaymentMethods);

// Admin: manage methods
router.post('/methods', authenticateToken, requireRole('admin'), createPaymentMethod);
router.put('/methods/:id', authenticateToken, requireRole('admin'), updatePaymentMethod);
router.delete('/methods/:id', authenticateToken, requireRole('admin'), deletePaymentMethod);

// User: set own payment preference
router.post('/me', authenticateToken, setUserPayment);

export default router;
