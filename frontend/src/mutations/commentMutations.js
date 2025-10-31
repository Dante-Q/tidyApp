import {
  createComment,
  updateComment,
  toggleLikeComment,
  deleteComment,
} from "../services/commentService.js";
import { showErrorAlert } from "../utils/errorHandlers.js";

/**
 * Create a mutation for creating a new comment
 * @param {Object} queryClient - React Query client instance
 * @param {string} postId - ID of the post being commented on
 * @param {Function} setError - Optional error callback
 * @returns {Object} Mutation configuration for useMutation
 */
export function createCreateCommentMutation(
  queryClient,
  postId,
  setError = null
) {
  return {
    mutationFn: (commentData) => createComment(commentData),

    onSuccess: () => {
      // Invalidate both comments and post queries
      // (post query needs refresh to update comment count)
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to post comment. Please try again.";
      if (setError) {
        setError(message);
      } else {
        alert(message);
      }
    },
  };
}

/**
 * Create a mutation for liking/unliking a comment with optimistic updates
 * @param {Object} queryClient - React Query client instance
 * @param {string} postId - ID of the post containing the comment
 * @returns {Object} Mutation configuration for useMutation
 */
export function createLikeCommentMutation(queryClient, postId) {
  return {
    mutationFn: (commentId) => toggleLikeComment(commentId),

    onMutate: async (commentId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      // Snapshot previous value
      const previousComments = queryClient.getQueryData(["comments", postId]);

      // Optimistically update the comment in the comments array
      queryClient.setQueryData(["comments", postId], (oldComments) => {
        if (!oldComments) return oldComments;

        const updateComment = (comments) =>
          comments.map((comment) => {
            if (comment._id === commentId) {
              return {
                ...comment,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                isLiked: !comment.isLiked,
              };
            }
            // Handle nested replies
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateComment(comment.replies),
              };
            }
            return comment;
          });

        return updateComment(oldComments);
      });

      return { previousComments };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments
        );
      }
    },

    onSuccess: () => {
      // Refetch to ensure server state is accurate
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  };
}

/**
 * Create a mutation for deleting a comment
 * @param {Object} queryClient - React Query client instance
 * @param {string} postId - ID of the post containing the comment
 * @returns {Object} Mutation configuration for useMutation
 */
export function createDeleteCommentMutation(queryClient, postId) {
  return {
    mutationFn: (commentId) => deleteComment(commentId),

    onSuccess: () => {
      // Invalidate both comments and post queries
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },

    onError: (error) => {
      showErrorAlert(error, "Failed to delete comment. Please try again.");
    },
  };
}

/**
 * Create a mutation for updating/editing a comment
 * @param {Object} queryClient - React Query client instance
 * @param {string} postId - ID of the post containing the comment
 * @returns {Object} Mutation configuration for useMutation
 */
export function createUpdateCommentMutation(queryClient, postId) {
  return {
    mutationFn: ({ commentId, content }) => updateComment(commentId, content),

    onMutate: async ({ commentId, content }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      // Snapshot previous value
      const previousComments = queryClient.getQueryData(["comments", postId]);

      // Optimistically update the comment
      queryClient.setQueryData(["comments", postId], (oldComments) => {
        if (!oldComments) return oldComments;

        const updateCommentInList = (comments) =>
          comments.map((comment) => {
            if (comment._id === commentId) {
              return {
                ...comment,
                content: content,
                isEdited: true,
              };
            }
            // Handle nested replies
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentInList(comment.replies),
              };
            }
            return comment;
          });

        return updateCommentInList(oldComments);
      });

      return { previousComments };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments
        );
      }
      showErrorAlert(err, "Failed to update comment. Please try again.");
    },

    onSuccess: () => {
      // Refetch to ensure server state is accurate
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  };
}
