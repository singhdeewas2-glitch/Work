import express from 'express';
import { loginUser, registerUser, getProfile } from './controller/authController.mjs';
import { requireAuth } from './middleware/authMiddleware.mjs';
import { getTransformations, getTrainers, getPlans, getSiteConfig, resolveMapUrl } from './controller/publicController.mjs';
import adminRouter from './controller/adminController.mjs';

const router = express.Router();

console.log("ROUTES LOADED");

// Public routes
router.get("/", (req, res) => { res.send("Hello World!") });
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/profile', requireAuth, getProfile);
router.get('/transformations', getTransformations);
router.get('/trainers', getTrainers);
router.get('/plans', getPlans);
router.get('/config', getSiteConfig);
router.get('/resolve-maps', resolveMapUrl);

// Admin routes (index.mjs mounts this router at /api, so these become /api/admin/*)
router.use('/admin', adminRouter);

export default router;
