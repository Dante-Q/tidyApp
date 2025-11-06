import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Admin: Edit any post
 */
export const adminEditPost = async (postId, updates) => {
  const response = await axios.patch(
    `${API_URL}/admin/posts/${postId}`,
    updates,
    { withCredentials: true }
  );
  return response.data;
};

/**
 * Admin: Delete any post
 */
export const adminDeletePost = async (postId) => {
  const response = await axios.delete(`${API_URL}/admin/posts/${postId}`, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Admin: Move post to different category/subcategory
 */
export const adminMovePost = async (postId, category, subcategory) => {
  const response = await axios.patch(
    `${API_URL}/admin/posts/${postId}/move`,
    { category, subcategory },
    { withCredentials: true }
  );
  return response.data;
};

/**
 * Admin: Edit any comment
 */
export const adminEditComment = async (commentId, content) => {
  const response = await axios.patch(
    `${API_URL}/admin/comments/${commentId}`,
    { content },
    { withCredentials: true }
  );
  return response.data;
};

/**
 * Admin: Delete any comment
 */
export const adminDeleteComment = async (commentId) => {
  const response = await axios.delete(
    `${API_URL}/admin/comments/${commentId}`,
    { withCredentials: true }
  );
  return response.data;
};
