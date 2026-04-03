import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import config from './config.mjs';
import mongoose from 'mongoose';
import routes from './src/routes.mjs';
import profileRoutes from './src/controller/profileController.mjs';

const app = express();

app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5174"], 
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

mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.listen(config.port, () => {
  console.log(`Backend server running on port ${config.port}`);
  console.log('Authentication configs reloaded successfully.');
});