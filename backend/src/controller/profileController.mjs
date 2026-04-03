import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.mjs';
import User from '../models/userModel.mjs';
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
    const { name, bio, profileImage, weight, goal } = req.body;
    
    await User.findOneAndUpdate(
      { userId },
      { name, bio, profileImage, weight, goal, email: req.user.email },
      { upsert: true, new: true }
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error("PUT /profile error:", err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/upload-url', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { filename, contentType } = req.query;
    
    const ext = filename?.split('.').pop() || 'jpg';
    const key = `profiles/${userId}/${Date.now()}.${ext}`;
    
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