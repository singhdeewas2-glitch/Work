/**
 * Central API base URL. Override with VITE_API_BASE_URL in .env for production.
 */
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiPaths = {
  profile: `${API_BASE}/api/profile`,
  weight: (view) => `${API_BASE}/api/weight/${view}`,
};
