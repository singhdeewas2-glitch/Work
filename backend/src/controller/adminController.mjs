import express from 'express';
import { requireAdmin } from '../middleware/authMiddleware.mjs';
import User from '../models/userModel.mjs';
import Trainer from '../models/trainerModel.mjs';
import Content from '../models/contentModel.mjs';
import Transformation from '../models/transformationModel.mjs';
import Pricing from '../models/pricingModel.mjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadBufferToS3 } from '../utils/s3Upload.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

const router = express.Router();

// --- General Upload ---
router.post('/upload', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log("FORENSIC TRACE: /api/admin/upload hit");
    console.log('FILE:', req.file);
    console.log('BODY:', req.body);

    if (!req.file) {
      return res.status(400).json({ error: 'No file received' });
    }

    const fileUrl = await uploadBufferToS3(req.file.buffer, req.file.originalname, req.file.mimetype, 'admin-uploads');
    console.log("File saved to S3:", fileUrl);
    res.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

// --- Members ---
router.get('/members', requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members' });
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

router.post('/trainers', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log("=== POST /trainers ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { name, role, experience, image } = req.body;
    let imageUrl = image;
    if (req.file) {
      imageUrl = await uploadBufferToS3(req.file.buffer, req.file.originalname, req.file.mimetype, 'trainers');
      console.log("Image saved to S3:", imageUrl);
    }

    if (!name || !role || !imageUrl) {
      return res.status(400).json({ error: 'Name, role, and trainer image are required' });
    }

    const newTrainer = new Trainer({ name, role, experience, image: imageUrl });
    await newTrainer.save();
    console.log("Trainer created:", newTrainer);
    res.json({ success: true, data: newTrainer });
  } catch (err) {
    console.error("POST /trainers failed", err);
    res.status(500).json({ error: 'Failed to create trainer: ' + err.message });
  }
});

router.put('/trainers/:id', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log("=== PUT /trainers ===");
    const { name, role, experience, image } = req.body;
    let imageUrl = image;
    if (req.file) {
      imageUrl = await uploadBufferToS3(req.file.buffer, req.file.originalname, req.file.mimetype, 'trainers');
    }

    const updatePayload = { name, role, experience };
    if (imageUrl) updatePayload.image = imageUrl;

    const updated = await Trainer.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT /trainers failed", err);
    res.status(500).json({ error: 'Failed to update trainer: ' + err.message });
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
    console.log("=== POST /prices ===");
    console.log("req.body:", req.body);

    const { title, price, duration, features, isPopular } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    let processedFeatures = features;
    if (typeof features === 'string') {
      processedFeatures = features.split(',').map(f => f.trim()).filter(f => f);
    }

    const newPrice = new Pricing({
      title,
      price,
      duration: duration || '/month',
      features: processedFeatures,
      isPopular: isPopular || false
    });

    await newPrice.save();
    console.log("Pricing plan created:", newPrice);
    res.json({ success: true, data: newPrice });
  } catch (err) {
    console.error("POST /prices failed", err);
    res.status(500).json({ error: 'Failed to create pricing: ' + err.message });
  }
});

router.put('/prices/:id', requireAdmin, async (req, res) => {
  try {
    const { title, price, duration, features, isPopular } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    let processedFeatures = features;
    if (typeof features === 'string') {
      processedFeatures = features.split(',').map(f => f.trim()).filter(f => f);
    }

    const updated = await Pricing.findByIdAndUpdate(req.params.id, {
      title, price,
      duration: duration || '/month',
      features: processedFeatures,
      isPopular: isPopular || false
    }, { new: true });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT /prices failed", err);
    res.status(500).json({ error: 'Failed to update pricing: ' + err.message });
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

// --- Content / Config ---
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
    let { whatsapp, phone, email, address, mapsLink } = req.body;
    
    // Natively normalize shortlinks on save so it doesn't throttle the backend during standard public page loads!
    if (mapsLink && (mapsLink.includes('maps.app.goo.gl') || mapsLink.includes('goo.gl/maps'))) {
       try {
         const fetchMod = (await import('node-fetch')).default || global.fetch;
         const response = await fetchMod(mapsLink, { redirect: 'follow' });
         mapsLink = response.url; // Replace with the heavy, un-obfuscated maps string
       } catch (err) {
         console.error('Failed to unpack Maps URL', err);
       }
    }

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
      return {
        ...t.toObject(),
        progress: t.afterImage ? 100 : 0,
        duration: `${durationDays} days`
      };
    });
    res.json(hydrated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transformations' });
  }
});

router.post('/transformations', requireAdmin,
  upload.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]),
  async (req, res) => {
    try {
      console.log("=== POST /transformations ===");
      console.log("req.body:", req.body);
      console.log("req.files:", req.files);

      const { name, story, beforeImage, afterImage } = req.body;

      let beforeImageUrl = beforeImage;
      let afterImageUrl = afterImage;

      if (req.files?.beforeImage?.[0]) {
        beforeImageUrl = await uploadBufferToS3(req.files.beforeImage[0].buffer, req.files.beforeImage[0].originalname, req.files.beforeImage[0].mimetype, 'transformations');
        console.log("Before image saved:", beforeImageUrl);
      }

      if (req.files?.afterImage?.[0]) {
        afterImageUrl = await uploadBufferToS3(req.files.afterImage[0].buffer, req.files.afterImage[0].originalname, req.files.afterImage[0].mimetype, 'transformations');
        console.log("After image saved:", afterImageUrl);
      }

      if (!beforeImageUrl || !name || !story) {
        return res.status(400).json({ error: 'Missing required fields (name, story, or beforeImage)' });
      }

      const newTrans = new Transformation({ name, story, beforeImage: beforeImageUrl, afterImage: afterImageUrl });
      await newTrans.save();
      console.log("Transformation created:", newTrans);
      res.json({ success: true, data: newTrans });
    } catch (err) {
      console.error("POST /transformations failed", err);
      res.status(500).json({ error: 'Failed to create transformation: ' + err.message });
    }
  }
);

router.put('/transformations/:id', requireAdmin,
  upload.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]),
  async (req, res) => {
    try {
      console.log("=== PUT /transformations ===");
      const { name, story, beforeImage, afterImage } = req.body;

      let beforeImageUrl = beforeImage;
      let afterImageUrl = afterImage;

      if (req.files?.beforeImage?.[0]) {
        beforeImageUrl = await uploadBufferToS3(req.files.beforeImage[0].buffer, req.files.beforeImage[0].originalname, req.files.beforeImage[0].mimetype, 'transformations');
      }

      if (req.files?.afterImage?.[0]) {
        afterImageUrl = await uploadBufferToS3(req.files.afterImage[0].buffer, req.files.afterImage[0].originalname, req.files.afterImage[0].mimetype, 'transformations');
      }

      const updatePayload = { name, story };
      if (beforeImageUrl) updatePayload.beforeImage = beforeImageUrl;
      if (afterImageUrl) updatePayload.afterImage = afterImageUrl;

      const updated = await Transformation.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error("PUT /transformations failed", err);
      res.status(500).json({ error: 'Failed to update transformation: ' + err.message });
    }
  }
);

router.delete('/transformations/:id', requireAdmin, async (req, res) => {
  try {
    await Transformation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transformation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transformation' });
  }
});

export default router;
