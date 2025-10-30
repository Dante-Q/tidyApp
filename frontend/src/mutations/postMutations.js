import {
  toggleLikePost,
  deletePost,
  createPost,
  updatePost,
} from "../services/forumService.js";

/**
 * Create a mutation for liking/unliking a post with optimistic updates
 * @param {Object} queryClient - React Query client instance
 * @param {string} postId - ID of the post
 * @returns {Object} Mutation configuration for useMutation
 */
export function createLikePostMutation(queryClient, postId) {
  return {
    mutationFn: (postIdToLike) => toggleLikePost(postIdToLike),

    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      // Snapshot previous value
      const previousPost = queryClient.getQueryData(["post", postId]);

      // Optimistically update
      queryClient.setQueryData(["post", postId], (old) => ({
        ...old,
        likes: old.isLiked ? old.likes - 1 : old.likes + 1,
        isLiked: !old.isLiked,
      }));

      return { previousPost };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
    },

    onSuccess: (data) => {
      // Update with server data
      queryClient.setQueryData(["post", postId], (old) => ({
        ...old,
        likes: data.likes,
        isLiked: data.isLiked,
      }));
    },
  };
}

/**
 * Create a mutation for deleting a post
 * @param {Object} queryClient - React Query client instance
 * @param {Function} navigate - React Router navigate function
 * @returns {Object} Mutation configuration for useMutation
 */
export function createDeletePostMutation(queryClient, navigate) {
  return {
    mutationFn: (postId) => deletePost(postId),

    onSuccess: () => {
      // Navigate to forum after successful delete
      navigate("/forum");
      // Invalidate posts list to remove deleted post
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },

    onError: () => {
      alert("Failed to delete post. Please try again.");
    },
  };
}

/**
 * Create a mutation for creating a new post
 * @param {Object} queryClient - React Query client instance
 * @param {Function} navigate - React Router navigate function
 * @returns {Object} Mutation configuration for useMutation
 */
export function createCreatePostMutation(queryClient, navigate) {
  return {
    mutationFn: (formData) => createPost(formData),

    onSuccess: (data) => {
      // Invalidate posts list to show new post
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // Navigate to the new post
      navigate(`/forum/post/${data._id}`);
    },

    onError: (err) => {
      throw err; // Let component handle error display
    },
  };
}

/**
 * Create a mutation for updating an existing post
 * @param {Object} queryClient - React Query client instance
 * @param {string} postId - ID of the post being updated
 * @param {Function} navigate - React Router navigate function
 * @returns {Object} Mutation configuration for useMutation
 */
export function createUpdatePostMutation(queryClient, postId, navigate) {
  return {
    mutationFn: (formData) => updatePost(postId, formData),

    onSuccess: async (updatedPost) => {
      console.log("Post updated, server response:", updatedPost);

      // Remove all cached data for this post to force fresh fetch
      queryClient.removeQueries({ queryKey: ["post", postId] });
      queryClient.removeQueries({ queryKey: ["comments", postId] });

      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // Navigate immediately - PostDetailPage will fetch fresh data
      navigate(`/forum/post/${postId}`);
    },

    onError: (err) => {
      throw err; // Let component handle error display
    },
  };
}
