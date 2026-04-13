import express from 'express';
import { loginUser, registerUser, getProfile } from './controller/authController.mjs';
import { requireAuth } from './middleware/authMiddleware.mjs';
import { getTransformations, getTrainers, getPlans } from './controller/publicController.mjs';

const router = express.Router();
router.get("/", (req, res) => {res.send("Hello World!")});
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/profile', requireAuth, getProfile);
router.get("/transformations", getTransformations);
router.get("/trainers", getTrainers);
router.get("/plans", getPlans);
export default router;
