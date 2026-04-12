import express from 'express';
import Diet from '../models/dietModel.mjs';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.mjs';

const router = express.Router();

// GET all diet plans (protected so only logged in users can see)
router.get('/', requireAuth, async (req, res) => {
  try {
    const diets = await Diet.find().sort({ createdAt: 1 });
    res.json(diets);
  } catch (error) {
    console.error("GET /diet error:", error);
    res.status(500).json({ error: 'Failed to fetch diet plans' });
  }
});

// POST new diet plan (Admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { mealType, items, calories, notes, image } = req.body;
    
    if (!mealType || !items) {
      return res.status(400).json({ error: 'mealType and items are required' });
    }

    const newDiet = new Diet({
      mealType,
      items,
      calories: calories || null,
      notes: notes || '',
      image: image || ''
    });

    await newDiet.save();
    res.status(201).json(newDiet);
  } catch (error) {
    console.error("POST /diet error:", error);
    res.status(500).json({ error: 'Failed to create diet plan' });
  }
});

// PUT update diet plan (Admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { mealType, items, calories, notes, image } = req.body;
    
    const updatedDiet = await Diet.findByIdAndUpdate(
      req.params.id,
      { mealType, items, calories, notes, image },
      { new: true, runValidators: true }
    );

    if (!updatedDiet) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }

    res.json(updatedDiet);
  } catch (error) {
    console.error("PUT /diet error:", error);
    res.status(500).json({ error: 'Failed to update diet plan' });
  }
});

// DELETE diet plan (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deletedDiet = await Diet.findByIdAndDelete(req.params.id);
    if (!deletedDiet) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }
    res.json({ message: 'Diet plan deleted successfully' });
  } catch (error) {
    console.error("DELETE /diet error:", error);
    res.status(500).json({ error: 'Failed to delete diet plan' });
  }
});

export default router;
