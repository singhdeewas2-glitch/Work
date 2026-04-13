import express from 'express';
import { requireAdmin } from '../middleware/authMiddleware.mjs';
import User from '../models/userModel.mjs';
import Trainer from '../models/trainerModel.mjs';
import Content from '../models/contentModel.mjs';
import Transformation from '../models/transformationModel.mjs';
import multer from 'multer';
import { uploadBufferToS3 } from '../utils/s3Upload.mjs';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

const uploadImage = upload.single('image');

router.get('/members', requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// --- General Upload Service ---
router.post('/upload', requireAdmin, (req, res, next) => {
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
    console.log("FORENSIC TRACE: /api/admin/upload hit")
    console.log('HEADERS:', req.headers['content-type']);
    console.log('FILE:', req.file);
    console.log('BODY:', req.body);

    if (!req.file) {
      return res.status(400).json({ error: 'No file received' });
    }
    
    console.log("Uploading file:", req.file.originalname);
    const folder = req.body.folder || 'misc';
    const imageUrl = await uploadBufferToS3(req.file.buffer, req.file.originalname, req.file.mimetype, folder);
    res.json({ url: imageUrl });
  } catch (err) {
    console.error("S3 Upload Error:", err);
    res.status(500).json({ error: 'S3 upload failed: ' + err.message, stack: err.stack });
  }
});

// --- Users Management ---

router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { role, weight, startingWeight, goal, name } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role, weight, startingWeight, goal, name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// --- Trainers Management ---

router.get('/trainers', requireAdmin, async (req, res) => {
  try {
    const trainers = await Trainer.find({});
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trainers' });
  }
});

router.post('/trainers', requireAdmin, async (req, res) => {
  try {
    console.log("Saving:", req.body);
    const { name, role, experience, image } = req.body;

    if (!name || !role || !image) {
        return res.status(400).json({ error: 'Name, role, and trainer image are required' });
    }

    const newTrainer = new Trainer({ name, role, experience, image });
    await newTrainer.save();
    res.json(newTrainer);
  } catch (err) {
    console.error("POST /trainers failed", err);
    res.status(500).json({ error: 'Failed to create trainer' });
  }
});

router.put('/trainers/:id', requireAdmin, async (req, res) => {
  try {
    console.log("Saving:", req.body);
    const { name, role, experience, image } = req.body;

    const updatePayload = { name, role, experience };
    if (image) updatePayload.image = image;

    const updated = await Trainer.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("PUT /trainers failed", err);
    res.status(500).json({ error: 'Failed to update trainer' });
  }
});

router.delete('/trainers/:id', requireAdmin, async (req, res) => {
  try {
    await Trainer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trainer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete trainer' });
  }
});

// --- Pricing Management ---

import Pricing from '../models/pricingModel.mjs';

router.get('/prices', requireAdmin, async (req, res) => {
  try {
    const prices = await Pricing.find({});
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

router.post('/prices', requireAdmin, async (req, res) => {
  try {
    const newPrice = new Pricing(req.body);
    await newPrice.save();
    res.json(newPrice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create pricing' });
  }
});

router.put('/prices/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pricing' });
  }
});

router.delete('/prices/:id', requireAdmin, async (req, res) => {
  try {
    await Pricing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pricing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete pricing' });
  }
});

// --- Content Management ---


router.get('/config', requireAdmin, async (req, res) => {
  try {
    const content = await Content.findOne({});
    res.json(content || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

router.put('/config', requireAdmin, async (req, res) => {
  try {
    const { whatsapp, phone, email, address, mapsLink } = req.body;
    let content = await Content.findOne({});
    if (!content) {
      content = new Content({ whatsapp, phone, email, address, mapsLink });
    } else {
      content.whatsapp = whatsapp || '';
      content.phone = phone || '';
      content.email = email || '';
      content.address = address || '';
      content.mapsLink = mapsLink || '';
    }
    await content.save();
    res.json(content);
  } catch (err) {
    console.error('Save Config Error:', err);
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// --- Transformations Management ---

router.get('/transformations', requireAdmin, async (req, res) => {
  try {
    const transformations = await Transformation.find({}).sort({ createdAt: -1 });
    const hydrated = transformations.map((t) => {
      const start = new Date(t.createdAt);
      const end = new Date(t.updatedAt || t.createdAt);
      const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      const progress = t.afterImage ? 100 : 0;
      return {
        ...t.toObject(),
        progress,
        duration: `${durationDays} days`
      };
    });
    res.json(hydrated);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transformations' });
  }
});

router.post('/transformations', requireAdmin, async (req, res) => {
  try {
    console.log("Saving:", req.body);
    const { name, story, beforeImage, afterImage } = req.body;

    if (!beforeImage || !name || !story) {
        return res.status(400).json({ error: 'Missing required fields (name, story, or beforeImage)' });
    }

    const newTrans = new Transformation({ name, story, beforeImage, afterImage });
    await newTrans.save();
    res.json(newTrans);
  } catch (err) {
    console.error("POST /transformations failed", err);
    res.status(500).json({ error: 'Failed to create transformation' });
  }
});

router.put('/transformations/:id', requireAdmin, async (req, res) => {
  try {
    console.log("Saving:", req.body);
    const { name, story, beforeImage, afterImage } = req.body;

    const updatePlayload = { name, story };
    if (beforeImage) updatePlayload.beforeImage = beforeImage;
    if (afterImage) updatePlayload.afterImage = afterImage;

    const updated = await Transformation.findByIdAndUpdate(req.params.id, updatePlayload, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("PUT /transformations failed", err);
    res.status(500).json({ error: 'Failed to update transformation' });
  }
});

router.delete('/transformations/:id', requireAdmin, async (req, res) => {
  try {
    await Transformation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transformation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transformation' });
  }
});

export default router;
