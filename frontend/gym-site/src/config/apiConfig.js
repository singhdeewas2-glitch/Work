export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://gym-cwsz.onrender.com";

export const getApiUrl = (endpoint = "") => {
  return `${API_BASE_URL}/api${endpoint?.startsWith("/") ? endpoint : "/" + endpoint}`;
};

export const handleApiError = (error) => {
  console.error("API Error:", error);

  return {
    error:
      error?.response?.data?.error ||
      error.message ||
      "Server Error",
  };
};