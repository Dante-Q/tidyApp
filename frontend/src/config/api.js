// API configuration
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Remove trailing slash if present
const API_BASE_URL = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
  },
};
