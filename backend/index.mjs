import dotenv from 'dotenv';
dotenv.config();

console.log("---- FORENSIC DEBUG INITIALIZATION ----");
console.log("AWS KEY (AWS_ACCESS_KEY_ID):", process.env.AWS_ACCESS_KEY_ID ? `MASKED (${process.env.AWS_ACCESS_KEY_ID.substring(0, 4)}...)` : "undefined");
console.log("AWS KEY (ACCESS_KEY):", process.env.ACCESS_KEY ? `MASKED (${process.env.ACCESS_KEY.substring(0, 4)}...)` : "undefined");
console.log("AWS SECRET:", process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY ? "EXISTS" : "MISSING");
console.log("AWS REGION:", process.env.AWS_REGION || process.env.REGION);
console.log("---------------------------------------");

import express from 'express';
import cors from 'cors';
import config from './config.mjs';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './src/routes.mjs';
import profileRoutes from './src/controller/profileController.mjs';
import weightRoutes from './src/controller/weightController.mjs';
import dietRoutes from './src/controller/dietController.mjs';
import adminRoutes from './src/controller/adminController.mjs';

import Trainer from './src/models/trainerModel.mjs';
import Pricing from './src/models/pricingModel.mjs';
import Transformation from './src/models/transformationModel.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/test', (req, res) => {
  res.json({ message: "Backend is alive!" });
});

// --- Upload Route with Disk Storage ---
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    import('fs').then(fs => {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Remove spaces and special characters from filename
    const safeName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    cb(null, uniqueSuffix + '-' + safeName);
  }
});

const uploadDisk = multer({ storage: diskStorage });

app.post('/api/upload', uploadDisk.single('image'), (req, res) => {
  console.log("=== /api/upload hit ===");
  console.log("req.file:", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "No file received" });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  console.log("File uploaded successfully:", fileUrl);
  res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

// === MOUNT ALL ROUTES ===
app.use('/api', routes);                  // Public routes
app.use('/api/admin', adminRoutes);       // All admin CRUD routes
app.use('/api/diet', dietRoutes);         // Diet routes
app.use('/api/weight', weightRoutes);     // Weight tracking routes
app.use('/api', profileRoutes);           // Profile routes

mongoose.connect(config.mongoUri)
  .then(async () => {
    console.log('Connected to MongoDB successfully!');

    const tCount = await Trainer.countDocuments();
    if (tCount === 0) {
      await Trainer.insertMany([
        { name: 'Rahul Sharma', role: 'Strength & Conditioning', experience: '8 years exp', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200' },
        { name: 'Ankit Verma', role: 'Personal Trainer', experience: '10 years exp', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200' },
        { name: 'Priya Singh', role: 'Yoga & Mobility', experience: '6 years exp', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=200' }
      ]);
      console.log('Seeded Trainers');
    }

    const pCount = await Pricing.countDocuments();
    if (pCount === 0) {
      await Pricing.insertMany([
        { title: 'Monthly Plan', price: '$49', duration: '/month', features: ['Access to all equipment', 'Locker access', 'Free WiFi', '1 Class/month'], isPopular: false },
        { title: 'Quarterly Plan', price: '$129', duration: '/3 months', features: ['All equipment', 'Locker access', 'Unlimited Classes', '1 Personal Training'], isPopular: true },
        { title: 'Personal Training', price: '$199', duration: '/month', features: ['1-on-1 Coach', 'Diet Plan', 'Priority Support', 'Full Access'], isPopular: false }
      ]);
      console.log('Seeded Pricing');
    }

    const trCount = await Transformation.countDocuments();
    if (trCount === 0) {
      await Transformation.insertMany([
        { name: 'Manish Paul', story: 'Lost 12kg in 3 months!', beforeImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=300', afterImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=300' },
        { name: 'Prashant Singh', story: 'Huge muscle gain transformation.', beforeImage: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=300', afterImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=300' },
      ]);
      console.log('Seeded Transformations');
    }
  })
  .catch((err) => console.error('Failed to connect to MongoDB', err));

import { CognitoIdentityProviderClient, AdminConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretAccessKey,
  }
});

app.listen(config.port, async () => {
  console.log(`Backend server running on port ${config.port}`);
  console.log('Authentication configs reloaded successfully.');
  try {
    const command = new AdminConfirmSignUpCommand({
      UserPoolId: config.userPoolId,
      Username: 'admin@gmail.com',
    });
    await cognitoClient.send(command);
    console.log('Successfully auto-confirmed admin@gmail.com!');
  } catch (err) {
    console.log('Auto-confirm skipped or failed:', err.message);
  }
});
