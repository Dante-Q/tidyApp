// API configuration
// In development, Vite proxy handles /api requests to backend
// In production, set VITE_API_URL to your backend URL
const API_BASE_URL = "/api";

// Backend API endpoints
export const API_ENDPOINTS = {
  auth: {
    base: `${API_BASE_URL}/auth`,
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
    profile: `${API_BASE_URL}/auth/profile`,
    deleteAccount: `${API_BASE_URL}/auth/account`,
    verify: (token) => `${API_BASE_URL}/auth/verify/${token}`,
    resendVerification: `${API_BASE_URL}/auth/resend-verification`,
  },
};

// External API endpoints
export const EXTERNAL_APIS = {
  openMeteo: {
    marine: "https://marine-api.open-meteo.com/v1/marine",
    weather: "https://api.open-meteo.com/v1/forecast",
  },
  // Future: tide APIs, weather APIs, etc.
};
