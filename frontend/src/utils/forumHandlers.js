/**
 * Forum Handler Functions
 *
 * NOTE: Most handlers have been replaced by React Query mutations.
 * See: frontend/src/mutations/postMutations.js and commentMutations.js
 *
 * This file only contains handlers still in use by components not yet migrated.
 */

/**
 * Fetch user posts data
 * Used by: UserProfilePage (not yet migrated to React Query)
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
