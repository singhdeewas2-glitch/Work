import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Cognito Sub ID
  email: { type: String, required: true },
  name: { type: String, default: '' },
  bio: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  weight: { type: String, default: '' },
  startingWeight: { type: String, default: '' }, // Track starting weight
  goal: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  progressHistory: [{
    date: { type: Date, default: Date.now },
    weight: { type: String, required: true }
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
