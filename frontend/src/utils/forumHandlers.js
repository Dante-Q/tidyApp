/**
 * Handle like action for posts
 * @param {Object} params - Handler parameters
 * @param {Object} params.user - Current user object
 * @param {Function} params.navigate - React Router navigate function
 * @param {Function} params.toggleLikeFn - Service function to toggle like
 * @param {string} params.itemId - ID of the item to like
 * @param {Function} params.onSuccess - Callback with response data
 * @param {Function} params.onError - Optional error callback
 */
export const handleLikeAction = async ({
  user,
  navigate,
  toggleLikeFn,
  itemId,
  onSuccess,
  onError,
}) => {
  if (!user) {
    navigate("/login");
    return;
  }

  try {
    const data = await toggleLikeFn(itemId);
    onSuccess(data);
  } catch (err) {
    console.error("Error toggling like:", err);
    if (onError) {
      onError(err);
    }
  }
};

/**
 * Handle delete action with confirmation
 * @param {Object} params - Handler parameters
 * @param {string} params.confirmMessage - Confirmation dialog message
 * @param {Function} params.deleteFn - Service function to delete item
 * @param {string} params.itemId - ID of the item to delete
 * @param {Function} params.onSuccess - Callback on successful deletion
 * @param {Function} params.onError - Optional error callback
 * @returns {Promise<boolean>} True if deleted, false if cancelled
 */
export const handleDeleteAction = async ({
  confirmMessage = "Are you sure you want to delete this?",
  deleteFn,
  itemId,
  onSuccess,
  onError,
}) => {
  if (!window.confirm(confirmMessage)) {
    return false;
  }

  try {
    await deleteFn(itemId);
    if (onSuccess) {
      onSuccess();
    }
    return true;
  } catch (err) {
    console.error("Error deleting:", err);
    if (onError) {
      onError(err);
    } else {
      alert("Failed to delete. Please try again.");
    }
    return false;
  }
};

/**
 * Handle comment submission
 * @param {Object} params - Handler parameters
 * @param {Object} params.user - Current user object
 * @param {Function} params.navigate - React Router navigate function
 * @param {string} params.content - Comment content
 * @param {Function} params.createCommentFn - Service function to create comment
 * @param {Object} params.commentData - Additional comment data (postId, parentCommentId, etc.)
 * @param {Function} params.onSuccess - Callback on successful submission
 * @param {Function} params.onError - Optional error callback
 * @param {Function} params.setSubmitting - Function to set submitting state
 */
export const handleCommentSubmit = async ({
  user,
  navigate,
  content,
  createCommentFn,
  commentData,
  onSuccess,
  onError,
  setSubmitting,
}) => {
  if (!user) {
    navigate("/login");
    return;
  }

  if (!content.trim()) return;

  if (setSubmitting) setSubmitting(true);

  try {
    await createCommentFn(commentData);
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    console.error("Error creating comment:", err);
    if (onError) {
      onError(err);
    }
  } finally {
    if (setSubmitting) setSubmitting(false);
  }
};

/**
 * Fetch post data with likes processing
 * @param {Object} params - Handler parameters
 * @param {Function} params.getPostFn - Service function to fetch post
 * @param {string} params.postId - ID of the post
 * @param {Object} params.user - Current user object
 * @param {Function} params.processLikesDataFn - Function to process likes data
 * @param {Function} params.onSuccess - Callback with processed post data and liked state
 * @param {Function} params.onError - Callback on error
 * @param {Function} params.setLoading - Function to set loading state
 */
export const fetchPostData = async ({
  getPostFn,
  postId,
  user,
  processLikesDataFn,
  onSuccess,
  onError,
  setLoading,
}) => {
  try {
    const data = await getPostFn(postId);

    // Process likes data
    const { count, liked } = processLikesDataFn(data.likes, user, data.isLiked);
    data.likes = count;

    if (onSuccess) {
      onSuccess(data, liked);
    }
    if (setLoading) setLoading(false);
  } catch (err) {
    console.error("Error fetching post:", err);
    if (onError) {
      onError("Failed to load post");
    }
    if (setLoading) setLoading(false);
  }
};

/**
 * Fetch comments for a post
 * @param {Object} params - Handler parameters
 * @param {Function} params.getCommentsFn - Service function to fetch comments
 * @param {string} params.postId - ID of the post
 * @param {Function} params.onSuccess - Callback with comments array
 * @param {Function} params.onError - Optional callback on error
 */
export const fetchCommentsData = async ({
  getCommentsFn,
  postId,
  onSuccess,
  onError,
}) => {
  try {
    const data = await getCommentsFn(postId);
    if (onSuccess) {
      onSuccess(data.comments || []);
    }
  } catch (err) {
    console.error("Error fetching comments:", err);
    if (onError) {
      onError([]);
    }
  }
};

/**
 * Handle post creation
 * @param {Object} params - Handler parameters
 * @param {Object} params.user - Current user object
 * @param {Function} params.navigate - React Router navigate function
 * @param {Object} params.formData - Post form data
 * @param {Function} params.createPostFn - Service function to create post
 * @param {Function} params.onSuccess - Callback with created post
 * @param {Function} params.onError - Callback on error
 * @param {Function} params.setLoading - Function to set loading state
 */
export const handleCreatePost = async ({
  user,
  navigate,
  formData,
  createPostFn,
  onSuccess,
  onError,
  setLoading,
}) => {
  if (!user) {
    if (onError) onError("You must be logged in to create a post");
    navigate("/login");
    return;
  }

  if (setLoading) setLoading(true);

  try {
    const post = await createPostFn(formData);
    if (onSuccess) {
      onSuccess(post);
    }
  } catch (err) {
    console.error("Error creating post:", err);
    if (onError) {
      onError(
        err.response?.data?.message ||
          "Failed to create post. Please try again."
      );
    }
  } finally {
    if (setLoading) setLoading(false);
  }
};

/**
 * Handle post update
 * @param {Object} params - Handler parameters
 * @param {Object} params.user - Current user object
 * @param {Function} params.navigate - React Router navigate function
 * @param {string} params.postId - ID of the post to update
 * @param {Object} params.formData - Updated post form data
 * @param {Function} params.updatePostFn - Service function to update post
 * @param {Function} params.onSuccess - Callback on successful update
 * @param {Function} params.onError - Callback on error
 * @param {Function} params.setSubmitting - Function to set submitting state
 */
export const handleUpdatePost = async ({
  user,
  navigate,
  postId,
  formData,
  updatePostFn,
  onSuccess,
  onError,
  setSubmitting,
}) => {
  if (!user) {
    if (onError) onError("You must be logged in to edit a post");
    navigate("/login");
    return;
  }

  if (setSubmitting) setSubmitting(true);

  try {
    await updatePostFn(postId, formData);
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    console.error("Error updating post:", err);
    if (onError) {
      onError(
        err.response?.data?.message ||
          "Failed to update post. Please try again."
      );
    }
  } finally {
    if (setSubmitting) setSubmitting(false);
  }
};

/**
 * Fetch user posts data
 * @param {Object} params - Handler parameters
 * @param {Function} params.getPostsFn - Service function to fetch user posts
 * @param {string} params.userId - ID of the user
 * @param {Function} params.onSuccess - Callback with posts and user info
 * @param {Function} params.onError - Callback on error
 * @param {Function} params.setLoading - Function to set loading state
 */
export const fetchUserPostsData = async ({
  getPostsFn,
  userId,
  onSuccess,
  onError,
  setLoading,
}) => {
  try {
    const data = await getPostsFn(userId);
    const postsArray = data.posts || [];
    const userInfo = postsArray.length > 0 ? postsArray[0].author : null;

    if (onSuccess) {
      onSuccess(postsArray, userInfo);
    }
    if (setLoading) setLoading(false);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    if (onError) {
      onError("Failed to load user profile");
    }
    if (setLoading) setLoading(false);
  }
};
