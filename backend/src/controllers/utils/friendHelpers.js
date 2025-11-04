/**
 * Helper function to find a friend request by sender ID
 * @param {Object} user - User document with friendRequests array
 * @param {String} fromId - ID of the user who sent the request
 * @returns {Object|undefined} The friend request object if found
 */
export const findFriendRequest = (user, fromId) => {
  return user.friendRequests.find(
    (request) => request.from.toString() === fromId.toString()
  );
};

/**
 * Helper function to handle controller errors consistently
 * @param {Object} res - Express response object
 * @param {String} message - User-friendly error message
 * @param {Error} error - The error object
 */
export const handleControllerError = (res, message, error) => {
  console.error(message, error);
  return res.status(500).json({ success: false, message });
};
