import dotenv from 'dotenv';
dotenv.config();

console.log("---- FORENSIC DEBUG INITIALIZATION ----");
console.log("AWS KEY (AWS_ACCESS_KEY_ID):", process.env.AWS_ACCESS_KEY_ID ? `MASKED (${process.env.AWS_ACCESS_KEY_ID.substring(0, 4)}...)` : "undefined");
console.log("AWS KEY (ACCESS_KEY):", process.env.ACCESS_KEY ? `MASKED (${process.env.ACCESS_KEY.substring(0, 4)}...)` : "undefined");
console.log("AWS SECRET:", process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY ? "EXISTS" : "MISSING");
console.log("AWS REGION:", process.env.AWS_REGION || process.env.REGION);

import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
const debugS3Client = new S3Client({
  region: process.env.AWS_REGION || process.env.REGION,
  credentials: {
    // using the resolved configs to simulate actual connection
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY,
  }
});

debugS3Client.send(new ListBucketsCommand({}))
  .then((data) => {
    console.log("S3 TEST SUCCESS: Successfully fetched bucket list.", data.Buckets?.map(b => b.Name));
  })
  .catch((err) => {
    console.error("S3 TEST FAILED:");
    console.error(err);
  });
console.log("---------------------------------------");

import express from 'express';
import cors from 'cors';
import config from './config.mjs';
import mongoose from 'mongoose';
import routes from './src/routes.mjs';
import profileRoutes from './src/controller/profileController.mjs';
import weightRoutes from './src/controller/weightController.mjs';
import dietRoutes from './src/controller/dietController.mjs';

const app = express();

app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true 
}));
// Express 5+ does not allow '*' wildcards. Global OPTIONS requests are natively handled by app.use(cors()).
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: "Backend is alive on port 5000!" });
});

app.use('/api', routes);
app.use('/api', profileRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/diet', dietRoutes);

import adminRoutes from './src/controller/adminController.mjs';
app.use('/api/admin', adminRoutes);

import Trainer from './src/models/trainerModel.mjs';
import Pricing from './src/models/pricingModel.mjs';
import Transformation from './src/models/transformationModel.mjs';

mongoose.connect(config.mongoUri)
  .then(async () => {
    console.log('Connected to MongoDB successfully!');
    
    // Seed trainers if empty
    const tCount = await Trainer.countDocuments();
    if (tCount === 0) {
      await Trainer.insertMany([
        { name: 'Rahul Sharma', role: 'Strength & Conditioning', experience: '8 years exp', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200' },
        { name: 'Ankit Verma', role: 'Personal Trainer', experience: '10 years exp', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200' },
        { name: 'Priya Singh', role: 'Yoga & Mobility', experience: '6 years exp', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=200' }
      ]);
      console.log('Seeded Trainers');
    }

    // Seed prices if empty
    const pCount = await Pricing.countDocuments();
    if (pCount === 0) {
      await Pricing.insertMany([
        { title: 'Monthly Plan', price: '$49', duration: '/month', features: ['Access to all equipment', 'Locker access', 'Free WiFi', '1 Class/month'], isPopular: false },
        { title: 'Quarterly Plan', price: '$129', duration: '/3 months', features: ['All equipment', 'Locker access', 'Unlimited Classes', '1 Personal Training'], isPopular: true },
        { title: 'Personal Training', price: '$199', duration: '/month', features: ['1-on-1 Coach', 'Diet Plan', 'Priority Support', 'Full Access'], isPopular: false }
      ]);
      console.log('Seeded Pricing');
    }

    // Seed transformations if empty
    const trCount = await Transformation.countDocuments();
    if (trCount === 0) {
      await Transformation.insertMany([
        { name: 'Manish Paul', story: 'Lost 12kg in 3 months and built lean muscle!', beforeImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=300', afterImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=300' },
        { name: 'Prashant Singh', story: 'Huge muscle gain transformation. Completely transformed my energy levels.', beforeImage: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=300', afterImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=300' },
        { name: 'Ankit Verma', story: 'Huge muscle gain transformation in just 6 months of heavy lifting.', beforeImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=300', afterImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=300' }
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