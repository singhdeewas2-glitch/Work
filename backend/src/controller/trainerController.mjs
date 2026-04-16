import express from 'express';
import { requireAdmin } from '../middleware/authMiddleware.mjs';
import Trainer from '../models/trainerModel.mjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CENTRALIZED MULTER CONFIGURATION ===
const memoryStorage = multer.memoryStorage();

const upload = multer({ storage: memoryStorage });
const uploadImage = upload.single('image');

// === TRAINER CRUD ROUTES ===

// GET all trainers (public)
router.get('/', async (req, res) => {
  try {
    console.log("=== DEBUGGING GET /admin/trainers ===");
    const trainers = await Trainer.find({}).sort({ createdAt: -1 });
    console.log(`Found ${trainers.length} trainers`);
    res.json(trainers);
  } catch (err) {
    console.error("GET /trainers error:", err);
    res.status(500).json({ error: 'Failed to fetch trainers' });
  }
});

// POST create trainer (Admin only)
router.post('/', requireAdmin, (req, res, next) => {
  console.log("=== MULTER MIDDLEWARE FOR POST /trainers ===");
  uploadImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      console.error("Unknown upload error:", err);
      return res.status(500).json({ error: 'Unknown upload error' });
    }
    console.log("Multer middleware passed, req.file:", req.file);
    next();
  });
}, async (req, res) => {
  try {
    console.log("=== DEBUGGING POST /admin/trainers ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    
    const { name, role, experience, image } = req.body;

    // Handle image: use uploaded file if exists, otherwise use URL from form
    let imageUrl = image;
    if (req.file) {
      console.log("Uploading new image to local storage...");
      imageUrl = `/uploads/${req.file.filename}`;
      console.log("Image uploaded to:", imageUrl);
    }

    if (!name || !role) {
        return res.status(400).json({ error: 'Name and role are required' });
    }

    const newTrainer = new Trainer({ 
      name, 
      role, 
      experience: experience || '', 
      image: imageUrl || '' 
    });
    
    await newTrainer.save();
    console.log("Trainer created successfully:", newTrainer);
    res.status(201).json({ success: true, data: newTrainer });
  } catch (err) {
    console.error("POST /trainers failed", err);
    res.status(500).json({ error: 'Failed to create trainer: ' + err.message });
  }
});

// PUT update trainer (Admin only)
router.put('/:id', requireAdmin, (req, res, next) => {
  console.log("=== MULTER MIDDLEWARE FOR PUT /trainers ===");
  uploadImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      console.error("Unknown upload error:", err);
      return res.status(500).json({ error: 'Unknown upload error' });
    }
    console.log("Multer middleware passed, req.file:", req.file);
    next();
  });
}, async (req, res) => {
  try {
    console.log("=== DEBUGGING PUT /admin/trainers ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("req.params.id:", req.params.id);
    
    const { name, role, experience, image } = req.body;

    // Handle image: use uploaded file if exists, otherwise use URL from form
    let imageUrl = image;
    if (req.file) {
      console.log("Uploading new image to local storage...");
      imageUrl = `/uploads/${req.file.filename}`;
      console.log("Image uploaded to:", imageUrl);
    }

    const updatePayload = { name, role, experience };
    if (imageUrl !== undefined) updatePayload.image = imageUrl;

    const updated = await Trainer.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    
    console.log("Trainer updated successfully:", updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT /trainers failed", err);
    res.status(500).json({ error: 'Failed to update trainer: ' + err.message });
  }
});

// DELETE trainer (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    console.log("=== DEBUGGING DELETE /admin/trainers ===");
    console.log("req.params.id:", req.params.id);
    
    const deleted = await Trainer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    
    console.log("Trainer deleted successfully");
    res.json({ success: true, message: 'Trainer deleted successfully' });
  } catch (err) {
    console.error("DELETE /trainers failed", err);
    res.status(500).json({ error: 'Failed to delete trainer: ' + err.message });
  }
});

export default router;
