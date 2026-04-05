import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.mjs';
import Weight from '../models/weightModel.mjs';

const router = express.Router();

// GET /api/weight/week (Rolling last 7 days)
router.get('/week', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 6);
    startDate.setHours(0,0,0,0);

    const data = await Weight.find({ userId, date: { $gte: startDate } }).sort({ date: 1 });

    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let skeleton = [];
    
    // Construct exact 7-day rolling skeleton
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        skeleton.push({ name: daysMap[d.getDay()], weight: null, rawDate: d.toDateString() });
    }

    // Map strict DB values overriding earlier duplicated day entries naturally
    data.forEach(d => {
       const mapped = skeleton.find(s => s.rawDate === d.date.toDateString());
       if (mapped) mapped.weight = d.weight;
    });

    res.json(skeleton);
  } catch (err) {
    console.error("GET /weight/week error:", err);
    res.status(500).json({ error: 'Failed to fetch weekly weight' });
  }
});

// GET /api/weight/month (Current calendar month 1-31)
router.get('/month', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const data = await Weight.find({ userId, date: { $gte: startDate } }).sort({ date: 1 });

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    let skeleton = [];
    for(let i=1; i<=daysInMonth; i++) {
        skeleton.push({ name: String(i), weight: null, rawDate: i });
    }

    data.forEach(d => {
       const targetDay = d.date.getDate();
       const mapped = skeleton.find(s => s.rawDate === targetDay);
       if (mapped) mapped.weight = d.weight;
    });

    // Erase future days to prevent line drawing
    const currentDay = now.getDate();
    skeleton = skeleton.map(row => {
        if (row.rawDate > currentDay) row.weight = null;
        return row;
    });

    res.json(skeleton);
  } catch (err) {
    console.error("GET /weight/month error:", err);
    res.status(500).json({ error: 'Failed to fetch monthly weight' });
  }
});

// GET /api/weight/year (Strict Current Year Jan-Dec)
router.get('/year', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 0, 1);
    const aggregated = await Weight.aggregate([
      { $match: { userId, date: { $gte: startDate } } },
      { $group: { _id: { $month: "$date" }, avgWeight: { $avg: "$weight" } } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let skeleton = months.map((m, i) => ({ name: m, weight: null, idx: i }));

    aggregated.forEach(a => {
      // _id is 1-12
      skeleton[a._id - 1].weight = parseFloat(a.avgWeight.toFixed(1));
    });

    const currentIdx = now.getMonth();
    skeleton = skeleton.map(row => {
      if (row.idx > currentIdx) row.weight = null;
      return row;
    });

    res.json(skeleton);
  } catch (err) {
    console.error("GET /weight/year error:", err);
    res.status(500).json({ error: 'Failed to fetch yearly weight' });
  }
});

export default router;
