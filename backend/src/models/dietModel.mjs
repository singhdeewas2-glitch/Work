import mongoose from 'mongoose';

const dietSchema = new mongoose.Schema({
  mealType: { 
    type: String, 
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks']
  },
  items: { 
    type: String, 
    required: true 
  },
  calories: { 
    type: Number, 
    default: null 
  },
  notes: { 
    type: String, 
    default: '' 
  },
  image: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Diet', dietSchema);
