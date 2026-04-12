import Weight from '../models/weightModel.mjs';

/** Local calendar date key (avoids UTC day-shift bugs). */
export function dayKey(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function getWeekSeries(userId) {
  const now = new Date();
  const weekDay = now.getDay();
  const mondayOffset = weekDay === 0 ? -6 : 1 - weekDay;

  const startDate = new Date(now);
  startDate.setDate(now.getDate() + mondayOffset);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7);
  endDate.setHours(0, 0, 0, 0);

  const data = await Weight.find({ userId, date: { $gte: startDate, $lt: endDate } }).sort({ date: 1 });

  const daysMap = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const skeleton = [];

  for (let i = 0; i < 7; i += 1) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    skeleton.push({ name: daysMap[i], weight: null, dateKey: dayKey(d) });
  }

  data.forEach((d) => {
    const mapped = skeleton.find((s) => s.dateKey === dayKey(d.date));
    if (mapped) mapped.weight = d.weight;
  });

  return skeleton.map(({ name, weight }) => ({ name, weight }));
}

export async function getMonthSeries(userId) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthData = await Weight.find({ userId, date: { $gte: startDate, $lt: endDate } }).sort({ date: 1 });

  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const skeleton = [];
  for (let day = 1; day <= lastDay; day += 1) {
    skeleton.push({ name: String(day), day, weight: null });
  }

  const byDay = new Map(skeleton.map((s) => [s.day, s]));
  monthData.forEach((d) => {
    const dayNum = d.date.getDate();
    const mapped = byDay.get(dayNum);
    if (mapped) mapped.weight = d.weight;
  });

  return skeleton.map(({ name, weight }) => ({ name, weight }));
}

export async function getYearSeries(userId) {
  const now = new Date();
  const y = now.getFullYear();
  const startDate = new Date(y, 0, 1);
  const endDate = new Date(y + 1, 0, 1);

  const data = await Weight.find({ userId, date: { $gte: startDate, $lt: endDate } }).sort({ date: 1 });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const skeleton = months.map((m, i) => ({ name: m, weight: null, monthIdx: i }));

  data.forEach((d) => {
    const monthIdx = d.date.getMonth();
    const mapped = skeleton[monthIdx];
    if (mapped) mapped.weight = d.weight;
  });

  return skeleton.map(({ name, weight }) => ({ name, weight }));
}
