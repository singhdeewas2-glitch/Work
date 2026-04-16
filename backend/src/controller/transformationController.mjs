import express from 'express';
import Transformation from '../models/transformationModel.mjs';
import { requireAdmin } from '../middleware/authMiddleware.mjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// storage
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + '-' + file.originalname);
  }
});

const upload = multer({ storage: diskStorage });

/* ================= GET ================= */
router.get('/', async (req, res) => {
  try {
    console.log("=== GET /api/transformations ===");
    const data = await Transformation.find({}).sort({ createdAt: -1 });
    console.log(`Found ${data.length} transformations`);
    
    // CRITICAL: Check if all items have same image paths in DB
    console.log("=== DATABASE IMAGE PATH ANALYSIS ===");
    console.log("DB DATA:", data.map(item => ({
      _id: item._id,
      name: item.name,
      beforeImage: item.beforeImage,
      afterImage: item.afterImage
    })));
    
    // Check for duplicates in database
    const beforeImageUrls = data.map(item => item.beforeImage);
    const afterImageUrls = data.map(item => item.afterImage);
    
    const uniqueBeforeUrls = [...new Set(beforeImageUrls)];
    const uniqueAfterUrls = [...new Set(afterImageUrls)];
    
    console.log("=== DUPLICATE DETECTION ===");
    console.log("All before URLs from DB:", beforeImageUrls);
    console.log("Unique before URLs:", uniqueBeforeUrls);
    console.log("All after URLs from DB:", afterImageUrls);
    console.log("Unique after URLs:", uniqueAfterUrls);
    
    if (uniqueBeforeUrls.length === 1 && beforeImageUrls.length > 1) {
      console.error("🚨 FILE OVERWRITE CONFIRMED: All items have SAME beforeImage URL!");
      console.error("🔍 This means uploads are overwriting the same file");
    }
    
    if (uniqueAfterUrls.length === 1 && afterImageUrls.length > 1) {
      console.error("🚨 FILE OVERWRITE CONFIRMED: All items have SAME afterImage URL!");
      console.error("🔍 This means uploads are overwriting the same file");
    }
    
    if (uniqueBeforeUrls.length > 1) {
      console.log("✅ DB OK: beforeImage URLs are different");
    }
    
    if (uniqueAfterUrls.length > 1) {
      console.log("✅ DB OK: afterImage URLs are different");
    }
    
    console.log("=== END DB ANALYSIS ===");
    
    res.json(data);
  } catch (err) {
    console.error("GET /transformations error:", err);
    res.status(500).json({ error: 'Failed to fetch transformations' });
  }
});

/* ================= CREATE ================= */
router.post(
  '/',
  requireAdmin,
  upload.fields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log("=== TRANSFORMATION CREATE DEBUG ===");
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);
      
      const { name, story } = req.body;

      const beforeFile = req.files?.beforeImage?.[0];
      const afterFile = req.files?.afterImage?.[0];

      console.log("=== FILE UPLOAD DEBUG ===");
      console.log("Before file:", beforeFile);
      console.log("After file:", afterFile);
      console.log("Before filename:", beforeFile?.filename);
      console.log("After filename:", afterFile?.filename);
      console.log("Before originalname:", beforeFile?.originalname);
      console.log("After originalname:", afterFile?.originalname);

      if (!beforeFile) {
        console.log("ERROR: Before image is required but not found");
        return res.status(400).json({ error: 'Before image is required' });
      }

      const beforeImageUrl = `/uploads/${beforeFile.filename}`;
      const afterImageUrl = afterFile ? `/uploads/${afterFile.filename}` : null;

      console.log("=== GENERATED IMAGE URLS ===");
      console.log("Before image URL:", beforeImageUrl);
      console.log("After image URL:", afterImageUrl);
      console.log("Before filename unique?", beforeFile.filename);
      console.log("After filename unique?", afterFile?.filename);

      const newTrans = new Transformation({
        name,
        story,
        beforeImage: beforeImageUrl,
        afterImage: afterImageUrl
      });

      await newTrans.save();
      console.log("=== TRANSFORMATION CREATED ===");
      console.log("Saved data:", {
        name: newTrans.name,
        beforeImage: newTrans.beforeImage,
        afterImage: newTrans.afterImage,
        _id: newTrans._id
      });

      res.status(201).json({ success: true, data: newTrans });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create transformation' });
    }
  }
);

/* ================= UPDATE ================= */
router.put(
  '/:id',
  requireAdmin,
  upload.fields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { name, story } = req.body;

      const beforeFile = req.files?.beforeImage?.[0];
      const afterFile = req.files?.afterImage?.[0];

      const updatePayload = {
        name,
        story
      };

      if (beforeFile) {
        updatePayload.beforeImage = `/uploads/${beforeFile.filename}`;
      }

      if (afterFile) {
        updatePayload.afterImage = `/uploads/${afterFile.filename}`;
      }

      const updated = await Transformation.findByIdAndUpdate(
        req.params.id,
        updatePayload,
        { new: true }
      );
      
      console.log("=== TRANSFORMATION UPDATED ===");
      console.log("Update payload:", updatePayload);
      console.log("Updated data:", {
        name: updated.name,
        beforeImage: updated.beforeImage,
        afterImage: updated.afterImage,
        _id: updated._id
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update transformation' });
    }
  }
);

/* ================= DELETE ================= */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Transformation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transformation' });
  }
});

export default router;