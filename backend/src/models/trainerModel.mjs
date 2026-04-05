import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  experience: { type: String, default: '' },
  image: { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Trainer', trainerSchema);
