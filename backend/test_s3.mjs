import { uploadBufferToS3 } from './src/utils/s3Upload.mjs';
import fs from 'fs';

async function test() {
  try {
    const buffer = Buffer.from('test string content for file upload testing');
    console.log('Uploading test buffer to S3...');
    const url = await uploadBufferToS3(buffer, 'test.txt', 'text/plain', 'test_folder');
    console.log('Success! URL:', url);
  } catch (err) {
    console.error('S3 Upload Failed:', err);
  }
}

test();
