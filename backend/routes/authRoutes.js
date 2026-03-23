import express from 'express';
import { register, login, verifyEmail, getCurrentUser, resendVerificationCode } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', register);

// Login
router.post('/login', login);

// Verify email
router.post('/verify-email', verifyEmail);

// Resend verification code
router.post('/resend-code', resendVerificationCode);

// Get current user
router.get('/me', authenticateToken, getCurrentUser);

export default router;
