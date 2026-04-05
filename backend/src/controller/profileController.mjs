import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.mjs';
import User from '../models/userModel.mjs';
import Weight from '../models/weightModel.mjs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '../../config.mjs';

const router = express.Router();

const s3Client = new S3Client({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretAccessKey,
  },
});


router.put('/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { name, bio, profileImage, weight, startingWeight, goal } = req.body;
    
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { name, bio, profileImage, weight, startingWeight, goal, email: req.user.email },
      { upsert: true, new: true }
    );
    
    // Crucial Timeline Sync: Ensure timeline history receives the update natively!
    if (weight) {
      await Weight.create({
        userId,
        weight: parseFloat(weight),
        date: new Date()
      });
    }
    
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error("PUT /profile error:", err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.post('/profile/progress', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { weight, date } = req.body;
    
    if (!weight) return res.status(400).json({ error: 'Weight is required' });

    // 1. Log instantly into the robust time-series weight schema
    await Weight.create({
      userId,
      weight: parseFloat(weight),
      date: date || new Date()
    });

    // 2. Keep standard profile record up to date
    const user = await User.findOneAndUpdate(
      { userId },
      { 
        $push: { progressHistory: { weight, date: date || new Date() } },
        weight 
      },
      { new: true }
    );
    
    res.json({ message: 'Progress added successfully', progressHistory: user.progressHistory });
  } catch (err) {
    console.error("POST /profile/progress error:", err);
    res.status(500).json({ error: 'Failed to add progress' });
  }
});

router.get('/upload-url', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { filename, contentType, folder } = req.query;
    
    const ext = filename?.split('.').pop() || 'jpg';
    const uploadFolder = folder || 'profiles';
    const key = `${uploadFolder}/${userId}/${Date.now()}.${ext}`;
    
    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      ContentType: contentType || 'image/jpeg',
    });
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    res.json({
      uploadUrl: signedUrl,
      imageUrl: `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`
    });
  } catch (err) {
    console.error("GET /upload-url error:", err);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

export default router;