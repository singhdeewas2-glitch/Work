/*
Weight Service
Handles API calls for weight tracking data
Provides functions to fetch weight series for different time views
Used by useWeightChartData hook for weight progress visualization
*/

import { getJson } from './httpClient';

export async function fetchWeightSeries(token, timeView) {
  const res = await getJson(`/api/weight/${timeView}`, { token });
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}
