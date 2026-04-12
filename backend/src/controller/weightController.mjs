import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.mjs';
import { getWeekSeries, getMonthSeries, getYearSeries } from '../services/weightSeriesService.mjs';

const router = express.Router();

router.get('/week', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const rows = await getWeekSeries(userId);
    res.json(rows);
  } catch (err) {
    console.error('GET /weight/week error:', err);
    res.status(500).json({ error: 'Failed to fetch weekly weight' });
  }
});

router.get('/month', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const rows = await getMonthSeries(userId);
    res.json(rows);
  } catch (err) {
    console.error('GET /weight/month error:', err);
    res.status(500).json({ error: 'Failed to fetch monthly weight' });
  }
});

router.get('/year', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const rows = await getYearSeries(userId);
    res.json(rows);
  } catch (err) {
    console.error('GET /weight/year error:', err);
    res.status(500).json({ error: 'Failed to fetch yearly weight' });
  }
});

export default router;
