import express from 'express';
import { loginUser, registerUser, getProfile } from './controller/authController.mjs';
import { requireAuth } from './middleware/authMiddleware.mjs';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/profile', requireAuth, getProfile);

export default router;
