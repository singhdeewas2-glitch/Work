import { getApiUrl } from '../config/apiConfig';

/**
 * Low-level JSON fetch helpers. No UI concerns.
 * Complete HTTP method coverage for API interactions.
 */
export async function getJson(path, { token, headers = {} } = {}) {
  const h = { ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  const res = await fetch(getApiUrl(path), { headers: h });
  return res;
}

export async function postJson(path, body, { token, headers = {} } = {}) {
  const h = { 'Content-Type': 'application/json', ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  const res = await fetch(getApiUrl(path), {
    method: 'POST',
    headers: h,
    body: JSON.stringify(body),
  });
  return res;
}

export async function putJson(path, body, { token, headers = {} } = {}) {
  const h = { 'Content-Type': 'application/json', ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  const res = await fetch(getApiUrl(path), {
    method: 'PUT',
    headers: h,
    body: JSON.stringify(body),
  });
  return res;
}

export async function deleteJson(path, { token, headers = {} } = {}) {
  const h = { ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  const res = await fetch(getApiUrl(path), {
    method: 'DELETE',
    headers: h,
  });
  return res;
}

export async function uploadFile(path, formData, { token, headers = {} } = {}) {
  const h = { ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  // Don't set Content-Type for FormData - browser sets it with boundary
  const res = await fetch(getApiUrl(path), {
    method: 'POST',
    headers: h,
    body: formData,
  });
  return res;
}

export async function postFormData(path, formData, { token, headers = {} } = {}) {
  const h = { ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  
  // DEBUG: Log authorization header
  console.log("=== POST FORM DATA DEBUG ===");
  console.log("URL:", getApiUrl(path));
  console.log("Token present:", !!token);
  console.log("Token length:", token?.length || 0);
  console.log("Authorization header:", h.Authorization);
  console.log("FormData entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
  }
  
  // Don't set Content-Type for FormData - browser sets it with boundary
  const res = await fetch(getApiUrl(path), {
    method: 'POST',
    headers: h,
    body: formData,
  });
  
  console.log("Response status:", res.status);
  console.log("Response ok:", res.ok);
  
  return res;
}

export async function putFormData(path, formData, { token, headers = {} } = {}) {
  const h = { ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  
  // DEBUG: Log authorization header
  console.log("=== PUT FORM DATA DEBUG ===");
  console.log("URL:", getApiUrl(path));
  console.log("Token present:", !!token);
  console.log("Token length:", token?.length || 0);
  console.log("Authorization header:", h.Authorization);
  console.log("FormData entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
  }
  
  // Don't set Content-Type for FormData - browser sets it with boundary
  const res = await fetch(getApiUrl(path), {
    method: 'PUT',
    headers: h,
    body: formData,
  });
  
  console.log("Response status:", res.status);
  console.log("Response ok:", res.ok);
  
  return res;
}
