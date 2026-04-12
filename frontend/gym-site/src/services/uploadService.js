/*
Upload Service
Handles all file upload operations with proper error handling
Separates upload logic from UI components
*/

import { uploadFile, deleteJson } from './httpClient';

/**
 * Upload a file to the server
 * @param {File} file - The file to upload
 * @param {string} folder - Target folder (e.g., 'avatars', 'diets', 'transformations')
 * @param {string} token - Authentication token
 * @returns {Promise<{url: string}>} Upload response with file URL
 */
export async function uploadFileToServer(file, folder, token) {
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (!folder) {
    throw new Error('Folder must be specified');
  }
  
  if (!token) {
    throw new Error('Authentication token required');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  try {
    const response = await uploadFile('/upload', formData, { token });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.url) {
      throw new Error('Upload response missing file URL');
    }
    
    return data;
  } catch (error) {
    // Re-throw with more context
    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  }
}

/**
 * Remove a previously uploaded file
 * @param {string} url - The file URL to remove
 * @param {string} token - Authentication token
 * @returns {Promise<void>}
 */
export async function removeUploadedFile(url, token) {
  if (!url) {
    throw new Error('File URL is required');
  }
  
  if (!token) {
    throw new Error('Authentication token required');
  }

  try {
    const response = await deleteJson('/upload/remove', { token }, {
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `File removal failed with status ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to remove file: ${error.message}`);
  }
}

/**
 * Convert file to base64 for preview purposes
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Base64 representation
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    maxWidth = 2000,
    maxHeight = 2000
  } = options;

  const errors = [];
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }
  
  // Check image dimensions if it's an image
  if (file.type.startsWith('image/')) {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        if (img.width > maxWidth || img.height > maxHeight) {
          errors.push(`Image dimensions must be less than ${maxWidth}x${maxHeight}px`);
        }
        
        resolve({
          isValid: errors.length === 0,
          errors,
          dimensions: { width: img.width, height: img.height }
        });
      };
      
      img.onerror = () => {
        errors.push('Invalid image file');
        resolve({ isValid: false, errors });
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
  
  return Promise.resolve({
    isValid: errors.length === 0,
    errors
  });
}
