import { API_BASE_URL } from '../config/api';

/**
 * Low-level JSON fetch helpers. No UI concerns.
 * Complete HTTP method coverage for API interactions.
 */
export async function getJson(path, { token, headers = {} } = {}) {
  const h = { ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/api${path}`, { headers: h });
  return res;
}

export async function postJson(path, body, { token, headers = {} } = {}) {
  const h = { 'Content-Type': 'application/json', ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify(body),
  });
  return res;
}

export async function putJson(path, body, { token, headers = {} } = {}) {
  const h = { 'Content-Type': 'application/json', ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    method: 'PUT',
    headers: h,
    body: JSON.stringify(body),
  });
  return res;
}

export async function deleteJson(path, { token, headers = {} } = {}) {
  const h = { ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    method: 'DELETE',
    headers: h,
  });
  return res;
}

export async function uploadFile(path, formData, { token, headers = {} } = {}) {
  const h = { ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  // Don't set Content-Type for FormData - browser sets it with boundary
  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    method: 'POST',
    headers: h,
    body: formData,
  });
  return res;
}
