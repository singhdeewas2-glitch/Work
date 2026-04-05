import mongoose from 'mongoose';

const weightSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  weight: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Index for fast time-series aggregation
weightSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Weight', weightSchema);
