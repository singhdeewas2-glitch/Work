export const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const YEAR_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Merge API rows with fixed label order (week / year). Month uses ordered daily rows from API.
 */
export function normalizeChartRows(timeView, data) {
  const raw = Array.isArray(data) ? data : [];
  if (timeView === 'week') {
    const map = new Map(raw.map((r) => [r?.name, r?.weight ?? null]));
    return WEEK_LABELS.map((name) => ({ name, weight: map.has(name) ? map.get(name) : null }));
  }
  if (timeView === 'year') {
    const map = new Map(raw.map((r) => [r?.name, r?.weight ?? null]));
    return YEAR_LABELS.map((name) => ({ name, weight: map.has(name) ? map.get(name) : null }));
  }
  return [...raw]
    .map((r) => ({ name: String(r?.name ?? ''), weight: r?.weight ?? null }))
    .sort((a, b) => Number(a.name) - Number(b.name));
}

/**
 * Strict user data only: null where no entry; numeric weight only for real logs.
 * No forward-fill, no synthetic continuity.
 */
export function toStrictChartRows(rows) {
  return rows.map((row) => {
    const w = row.weight;
    const has = w != null && w !== '' && !Number.isNaN(Number(w));
    return { name: row.name, weight: has ? Number(w) : null };
  });
}
