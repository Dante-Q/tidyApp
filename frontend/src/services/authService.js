import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

/**
 * Get current user profile
 * Returns full user data including bio, location, interests
 */
export const getCurrentUserProfile = async () => {
  const response = await axios.get(API_ENDPOINTS.auth.me, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Get user profile info by user ID
 * Uses the friends endpoint but returns only the user profile data
 * @param {string} userId - The ID of the user whose profile to fetch
 */
export const getUserProfile = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch profile");
  }
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const response = await axios.get(`${API_BASE_URL}/friends/${userId}`, {
    withCredentials: true,
  });
  // Return just the user object, not the friends array
  return response.data.user;
};
