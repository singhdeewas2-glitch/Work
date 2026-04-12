import mongoose from 'mongoose';
import config from './config.mjs';
import Diet from './src/models/dietModel.mjs';

mongoose.connect(config.mongoUri)
  .then(async () => {
    const fakeImages = [
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1628244837563-71825fa775d5?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=300'
    ];
    await Diet.deleteMany({ image: { $in: fakeImages } });
    console.log('Deleted the 6 fake diets we added.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  });
