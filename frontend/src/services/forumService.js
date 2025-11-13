import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
// Don't add /api prefix - it's already in VITE_API_URL
const API_URL = `${API_BASE_URL}/posts`;

// Get all posts with optional filters
export const getPosts = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, {
      params,
      withCredentials: true,
    });
    // Backend returns { success: true, posts, pagination }
    // Return the full response object so callers can read posts and pagination
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Get category statistics
export const getCategoryStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      withCredentials: true,
    });
    // Backend returns { success: true, stats }
    // Return full wrapper for consistency
    return response.data;
  } catch (error) {
    console.error("Error fetching category stats:", error);
    throw error;
  }
};

// Get single post by ID
export const getPostById = async (postId) => {
  try {
    if (!postId || postId === "undefined") {
      throw new Error("Invalid postId");
    }
    const response = await axios.get(`${API_URL}/${postId}`, {
      withCredentials: true,
    });
    // Backend returns { success: true, post }
    // Return full wrapper for consistency
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

// Create new post (requires authentication)
export const createPost = async (postData) => {
  try {
    const response = await axios.post(API_URL, postData, {
      withCredentials: true,
    });
    // Backend returns { success: true, post }
    // Return full wrapper for consistency
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Update existing post (requires authentication)
export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`${API_URL}/${postId}`, postData, {
      withCredentials: true,
    });
    // Backend returns { success: true, post }
    // Return full wrapper for consistency
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Delete post (requires authentication)
export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_URL}/${postId}`, {
      withCredentials: true,
    });
    // Backend returns { success: true, message }
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Toggle like on post (requires authentication)
export const toggleLikePost = async (postId) => {
  try {
    const response = await axios.post(
      `${API_URL}/${postId}/like`,
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

// Get posts by specific user
export const getPostsByUser = async (userId) => {
  try {
    const response = await axios.get(API_URL, {
      params: { author: userId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

// Toggle pin status on a post (admin only)
export const togglePinPost = async (postId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${postId}/pin`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling pin status:", error);
    throw error;
  }
};

// Toggle comments on a post (admin only)
export const toggleCommentsOnPost = async (postId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${postId}/comments`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling comments status:", error);
    throw error;
  }
};
