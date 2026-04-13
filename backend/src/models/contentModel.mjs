import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  whatsapp: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  mapsLink: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Content', contentSchema);
