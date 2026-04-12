/*
Profile Service
Handles API calls for user profile management
Provides functions to fetch and update user profile data
Used by Profile page for personal information management
Enhanced with comprehensive error handling and user-friendly messages
*/

import { getJson, putJson } from './httpClient';

// Error message mapping for better UX
const ERROR_MESSAGES = {
  400: 'Invalid profile data. Please check your input and try again.',
  401: 'Your session has expired. Please log in again.',
  403: 'You don\'t have permission to update this profile.',
  404: 'Profile not found. Please contact support.',
  409: 'Profile information conflicts with existing data.',
  422: 'Invalid profile data format. Please check all fields.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Server error. Please try again later.',
  502: 'Service temporarily unavailable. Please try again later.',
  503: 'Service maintenance in progress. Please try again later.',
  network: 'Network error. Please check your internet connection.',
  timeout: 'Request timed out. Please try again.',
  unknown: 'An unexpected error occurred. Please try again.',
};

/**
 * Get user-friendly error message based on error status or type
 * @param {Error|string} error - The error object or message
 * @param {number} status - HTTP status code if available
 * @returns {string} User-friendly error message
 */
function getErrorMessage(error, status = null) {
  if (status && ERROR_MESSAGES[status]) {
    return ERROR_MESSAGES[status];
  }
  
  if (error?.message) {
    const message = error.message.toLowerCase();
    if (message.includes('network') || message.includes('fetch')) {
      return ERROR_MESSAGES.network;
    }
    if (message.includes('timeout')) {
      return ERROR_MESSAGES.timeout;
    }
  }
  
  return ERROR_MESSAGES.unknown;
}

/**
 * Fetch user profile with enhanced error handling
 * @param {string} token - Authentication token
 * @returns {Promise<{ok: boolean, status: number, data: any, error?: string}>}
 */
export async function fetchProfile(token) {
  try {
    if (!token) {
      return {
        ok: false,
        status: 401,
        data: null,
        error: ERROR_MESSAGES[401],
      };
    }

    const res = await getJson('/api/profile', { token });
    let data = {};
    
    try {
      data = await res.json();
    } catch (parseError) {
      // If JSON parsing fails, it's likely a server error
      return {
        ok: false,
        status: res.status || 500,
        data: null,
        error: ERROR_MESSAGES[500],
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data: null,
        error: getErrorMessage(null, res.status),
      };
    }

    return {
      ok: true,
      status: res.status,
      data,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: getErrorMessage(error),
    };
  }
}

/**
 * Update user profile with enhanced error handling
 * @param {string} token - Authentication token
 * @param {Object} payload - Profile data to update
 * @returns {Promise<{ok: boolean, status: number, data: any, error?: string}>}
 */
export async function updateProfile(token, payload) {
  try {
    if (!token) {
      return {
        ok: false,
        status: 401,
        data: null,
        error: ERROR_MESSAGES[401],
      };
    }

    if (!payload || typeof payload !== 'object') {
      return {
        ok: false,
        status: 400,
        data: null,
        error: ERROR_MESSAGES[400],
      };
    }

    const res = await putJson('/api/profile', payload, { token });
    let data = null;
    
    try {
      data = await res.json();
    } catch (parseError) {
      // If JSON parsing fails, it's likely a server error
      return {
        ok: false,
        status: res.status || 500,
        data: null,
        error: ERROR_MESSAGES[500],
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data: null,
        error: getErrorMessage(null, res.status),
      };
    }

    return {
      ok: true,
      status: res.status,
      data,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: getErrorMessage(error),
    };
  }
}
