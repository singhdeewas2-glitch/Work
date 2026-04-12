/*
API Configuration
Centralized API settings for all backend connections
*/

export const apiConfig = {
  development: {
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  production: {
    baseURL: 'https://api.gymfit.com/api',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000
  }
};

export const getApiUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? apiConfig.development.baseURL : apiConfig.production.baseURL;
};

export const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? apiConfig.development : apiConfig.production;
};

export const handleApiError = (error, fallbackData = null) => {
  console.error('API Error:', error);
  
  if (error.name === 'TypeError' && error.message.includes('ERR_CONNECTION_REFUSED')) {
    return {
      error: 'Backend server is not running. Please start the backend server.',
      fallback: fallbackData || { data: [], message: 'Backend unavailable - using fallback data' }
    };
  }
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      error: 'Network error. Please check your connection.',
      fallback: fallbackData || { data: [], message: 'Network error - using fallback data' }
    };
  }
  
  return {
    error: error.message || 'An unexpected error occurred',
    fallback: fallbackData || { data: [], message: 'Error occurred - using fallback data' }
  };
};

export default apiConfig;
