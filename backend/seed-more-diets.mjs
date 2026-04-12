import mongoose from 'mongoose';
import config from './config.mjs';
import Diet from './src/models/dietModel.mjs';

mongoose.connect(config.mongoUri)
  .then(async () => {
    await Diet.insertMany([
      { mealType: 'Breakfast', items: 'Oatmeal, 2 Boiled Eggs, Apple', calories: 450, notes: 'Rich in fiber and protein', image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=300' },
      { mealType: 'Lunch', items: 'Grilled Chicken Breast, Brown Rice, Broccoli', calories: 600, notes: 'High protein for muscle recovery', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300' },
      { mealType: 'Snacks', items: 'Protein Shake, Almonds', calories: 250, notes: 'Quick post-workout energy', image: 'https://images.unsplash.com/photo-1628244837563-71825fa775d5?auto=format&fit=crop&q=80&w=300' },
      { mealType: 'Dinner', items: 'Salmon, Quinoa, Asparagus', calories: 550, notes: 'Light and rich in Omega-3', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=300' },
      { mealType: 'Breakfast', items: 'Greek Yogurt, Mixed Berries, Chia Seeds', calories: 350, notes: 'Great source of probiotics', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=300' },
      { mealType: 'Dinner', items: 'Lean Beef Steak, Sweet Potato, Mixed Greens', calories: 700, notes: 'Perfect for building muscle mass', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=300' }
    ]);
    console.log('Seeded more fake diets!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
