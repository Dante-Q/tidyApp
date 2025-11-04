import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Don't add /api prefix - it's already in VITE_API_URL
const API_URL = `${API_BASE_URL}/comments`;

// Get all comments for a specific post
export const getCommentsByPost = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/post/${postId}`, {
      withCredentials: true,
    });
    // Backend returns { success: true, comments, pagination }
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Create new comment or reply (requires authentication)
export const createComment = async (commentData) => {
  try {
    const response = await axios.post(API_URL, commentData, {
      withCredentials: true,
    });
    // Backend returns { success: true, comment }
    // Return full wrapper for consistency
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

// Update existing comment (requires authentication)
export const updateComment = async (commentId, content) => {
  try {
    const response = await axios.put(
      `${API_URL}/${commentId}`,
      { content },
      {
        withCredentials: true,
      }
    );
    // Backend returns { success: true, comment }
    // Return full wrapper for consistency
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

// Delete comment (requires authentication)
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${commentId}`, {
      withCredentials: true,
    });
    // Backend returns { success: true, message }
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Toggle like on comment (requires authentication)
export const toggleLikeComment = async (commentId) => {
  try {
    const response = await axios.post(
      `${API_URL}/${commentId}/like`,
      {},
      {
        withCredentials: true,
      }
    );
    // Backend returns { success: true, likes, isLiked }
    return response.data;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};
