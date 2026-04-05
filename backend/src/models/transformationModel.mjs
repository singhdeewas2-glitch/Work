import mongoose from 'mongoose';

const transformationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  story: { type: String, required: true },
  beforeImage: { type: String, required: true },
  afterImage: { type: String }
}, { timestamps: true });

export default mongoose.model('Transformation', transformationSchema);
