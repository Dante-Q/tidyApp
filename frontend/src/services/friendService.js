import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/friends`;

/**
 * Send a friend request to a user
 * @param {string} userId - The ID of the user to send request to
 */
export const sendFriendRequest = async (userId) => {
  const response = await axios.post(
    `${API_URL}/request/${userId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Accept a friend request
 * @param {string} requestId - The ID of the user who sent the request
 */
export const acceptFriendRequest = async (requestId) => {
  const response = await axios.post(
    `${API_URL}/accept/${requestId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Reject a friend request
 * @param {string} requestId - The ID of the user who sent the request
 */
export const rejectFriendRequest = async (requestId) => {
  const response = await axios.post(
    `${API_URL}/reject/${requestId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Get pending friend requests for current user
 */
export const getFriendRequests = async () => {
  const response = await axios.get(`${API_URL}/requests`, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Get sent friend requests (outgoing requests from current user)
 */
export const getSentFriendRequests = async () => {
  const response = await axios.get(`${API_URL}/sent`, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Cancel a sent friend request
 * @param {string} userId - The ID of the user to whom the request was sent
 */
export const cancelFriendRequest = async (userId) => {
  const response = await axios.delete(`${API_URL}/request/${userId}`, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Get friendship status with another user
 * @param {string} userId - The ID of the user to check status with
 * @returns {Promise<{status: 'none'|'friends'|'pending_sent'|'pending_received'|'self'}>}
 */
export const getFriendshipStatus = async (userId) => {
  const response = await axios.get(`${API_URL}/status/${userId}`, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Get friends list for a user
 * @param {string} userId - The ID of the user whose friends to fetch
 */
export const getFriends = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch friends");
  }
  const response = await axios.get(`${API_URL}/${userId}`, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Remove a friend
 * @param {string} friendId - The ID of the friend to remove
 */
export const removeFriend = async (friendId) => {
  const response = await axios.delete(`${API_URL}/${friendId}`, {
    withCredentials: true,
  });
  return response.data;
};
