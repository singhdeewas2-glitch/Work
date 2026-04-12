import mongoose from 'mongoose';
import config from './config.mjs';
import Diet from './src/models/dietModel.mjs';

mongoose.connect(config.mongoUri)
  .then(async () => {
    const dCount = await Diet.countDocuments();
    console.log('Current diet count:', dCount);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
