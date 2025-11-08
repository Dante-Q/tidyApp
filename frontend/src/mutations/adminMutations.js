import {
  deletePost,
  togglePinPost,
  toggleCommentsOnPost,
} from "../services/forumService.js";
import { adminMovePost } from "../services/adminService.js";
import { deleteComment, updateComment } from "../services/commentService.js";
import { showErrorAlert, showSuccessAlert } from "../utils/errorHandlers.js";

/**
 * Create a mutation for admin deleting a post
 * @param {Object} queryClient - React Query client instance
 * @param {string} postId - ID of the post
 * @param {Function} navigate - Optional navigate function for redirecting after delete
 * @returns {Object} Mutation configuration for useMutation
 */
export function createAdminDeletePostMutation(
  queryClient,
  postId,
  navigate = null
) {
  return {
    mutationFn: () => deletePost(postId),

    onSuccess: () => {
      if (navigate) {
        navigate("/forum");
      }
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },

    onError: (error) => {
      showErrorAlert(error, "Failed to delete post. Please try again.");
    },
  };
}

/**
 * Create a mutation for admin moving a post to a different category
 * @param {Object} queryClient - React Query client instance
 * @param {string} postId - ID of the post
 * @returns {Object} Mutation configuration for useMutation
 */
export function createMovePostMutation(queryClient, postId) {
  return {
    mutationFn: ({ newCategory, newSubcategory }) =>
      adminMovePost(postId, newCategory, newSubcategory),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },

    onError: (error) => {
      showErrorAlert(error, "Failed to move post. Please try again.");
    },
  };
}

/**
 * Create a mutation for admin pinning/unpinning a post
 * @param {Object} queryClient - React Query client instance
 * @param {string} postId - ID of the post
 * @returns {Object} Mutation configuration for useMutation
 */
export function createTogglePinPostMutation(queryClient, postId) {
  return {
    mutationFn: () => togglePinPost(postId),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // Show success message
      const message = data.isPinned
        ? "Post pinned successfully"
        : "Post unpinned successfully";
      showSuccessAlert(message);
    },

    onError: (error) => {
      showErrorAlert(error, "Failed to toggle pin status. Please try again.");
    },
  };
}

/**
 * Create a mutation for admin toggling comments on/off for a post
 * @param {Object} queryClient - React Query client instance
 * @param {string} postId - ID of the post
 * @returns {Object} Mutation configuration for useMutation
 */
export function createToggleCommentsPostMutation(queryClient, postId) {
  return {
    mutationFn: () => toggleCommentsOnPost(postId),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });

      // Show success message
      const message = data.commentsEnabled
        ? "Comments enabled successfully"
        : "Comments disabled successfully";
      showSuccessAlert(message);
    },

    onError: (error) => {
      showErrorAlert(
        error,
        "Failed to toggle comments status. Please try again."
      );
    },
  };
}

/**
 * Create a mutation for admin deleting a comment
 * @param {Object} queryClient - React Query client instance
 * @param {string} postId - ID of the post containing the comment
 * @returns {Object} Mutation configuration for useMutation
 */
export function createAdminDeleteCommentMutation(queryClient, postId) {
  return {
    mutationFn: (commentId) => deleteComment(commentId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },

    onError: (error) => {
      showErrorAlert(error, "Failed to delete comment. Please try again.");
    },
  };
}

/**
 * Create a mutation for admin editing a comment
 * @param {Object} queryClient - React Query client instance
 * @param {string} postId - ID of the post containing the comment
 * @returns {Object} Mutation configuration for useMutation
 */
export function createAdminEditCommentMutation(queryClient, postId) {
  return {
    mutationFn: ({ commentId, content }) =>
      updateComment(commentId, { content }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },

    onError: (error) => {
      showErrorAlert(error, "Failed to update comment. Please try again.");
    },
  };
}
