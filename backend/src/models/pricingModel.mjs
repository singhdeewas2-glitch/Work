import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: String, default: '/month' },
  features: { type: [String], default: [] },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Pricing', pricingSchema);
