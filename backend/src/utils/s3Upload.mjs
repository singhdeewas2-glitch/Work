import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import config from '../../config.mjs';

const s3Client = new S3Client({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretAccessKey,
  },
});

export const uploadBufferToS3 = async (fileBuffer, originalName, mimeType, folder = 'transformations') => {
  const ext = originalName.split('.').pop() || 'jpg';
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
  });
  
  await s3Client.send(command);
  
  return `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`;
};
