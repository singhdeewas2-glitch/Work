import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// ---------- AWS S3 CONFIG ----------
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY,
  },
});

// ---------- GENERAL CONFIG ----------
const config = {
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGO_URI,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  accessKey: process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || process.env.REGION,
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  clientId: process.env.COGNITO_CLIENT_ID,
  tableName: process.env.DYNAMO_TABLE_NAME || 'Users',
  bucketName: process.env.S3_BUCKET_NAME || process.env.BUCKET_NAME || 'gym-user-profiles',

  aws: {
    region: process.env.AWS_REGION || process.env.REGION,
    bucketName: process.env.S3_BUCKET_NAME || process.env.BUCKET_NAME,
  },
};


export default config;