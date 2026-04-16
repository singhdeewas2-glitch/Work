import express from 'express';
import Diet from '../models/dietModel.mjs';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.mjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadBufferToS3 } from '../utils/s3Upload.mjs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
const uploadImage = upload.single('image');

// GET all diet plans (protected so only logged in users can see)
router.get('/', requireAuth, async (req, res) => {
  try {
    const diets = await Diet.find().sort({ createdAt: 1 });
    res.json(diets);
  } catch (error) {
    console.error("GET /diet error:", error);
    res.status(500).json({ error: 'Failed to fetch diet plans' });
  }
});

// POST new diet plan (Admin only)
router.post('/', requireAdmin, (req, res, next) => {
  uploadImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ error: 'Unknown upload error' });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log("=== DEBUGGING POST /diet ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    
    const { mealType, items, calories, notes, image } = req.body;
    
    // Handle image: use uploaded file if exists, otherwise use URL from form
    let imageUrl = image || '';
    if (req.file) {
      console.log("Uploading diet image to S3...");
      imageUrl = await uploadBufferToS3(req.file.buffer, req.file.originalname, req.file.mimetype, 'diets');
      console.log("Diet image uploaded to:", imageUrl);
    }
    
    if (!mealType || !items) {
      return res.status(400).json({ error: 'mealType and items are required' });
    }

    const newDiet = new Diet({
      mealType,
      items,
      calories: calories || null,
      notes: notes || '',
      image: imageUrl
    });

    await newDiet.save();
    console.log("Diet plan created successfully:", newDiet);
    res.status(201).json({ success: true, data: newDiet });
  } catch (error) {
    console.error("POST /diet error:", error);
    res.status(500).json({ error: 'Failed to create diet plan' });
  }
});

// PUT update diet plan (Admin only)
router.put('/:id', requireAdmin, (req, res, next) => {
  uploadImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ error: 'Unknown upload error' });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log("=== DEBUGGING PUT /diet ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("req.params.id:", req.params.id);
    
    const { mealType, items, calories, notes, image } = req.body;
    
    // Handle image: use uploaded file if exists, otherwise use URL from form
    let imageUrl = image;
    if (req.file) {
      console.log("Uploading diet image to S3...");
      imageUrl = await uploadBufferToS3(req.file.buffer, req.file.originalname, req.file.mimetype, 'diets');
      console.log("Diet image uploaded to:", imageUrl);
    }
    
    const updatePayload = { mealType, items, calories, notes };
    if (imageUrl !== undefined) updatePayload.image = imageUrl;
    
    const updatedDiet = await Diet.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!updatedDiet) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }

    console.log("Diet plan updated successfully:", updatedDiet);
    res.json({ success: true, data: updatedDiet });
  } catch (error) {
    console.error("PUT /diet error:", error);
    res.status(500).json({ error: 'Failed to update diet plan' });
  }
});

// DELETE diet plan (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deletedDiet = await Diet.findByIdAndDelete(req.params.id);
    if (!deletedDiet) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }
    res.json({ message: 'Diet plan deleted successfully' });
  } catch (error) {
    console.error("DELETE /diet error:", error);
    res.status(500).json({ error: 'Failed to delete diet plan' });
  }
});

export default router;
