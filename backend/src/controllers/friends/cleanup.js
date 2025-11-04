import User from "../../models/User.js";

/**
 * Cleanup friend data when a user account is deleted
 * This utility function should be called when deleting a user account
 * @param {String} deletedUserId - The ID of the user being deleted
 */
export const cleanupFriendDataOnUserDelete = async (deletedUserId) => {
  try {
    // Remove the deleted user from all friends lists and friend requests
    await User.updateMany(
      {},
      {
        $pull: {
          friends: deletedUserId,
          friendRequests: { from: deletedUserId },
        },
      }
    );

    console.log(`Cleaned up friend data for deleted user: ${deletedUserId}`);
  } catch (error) {
    console.error("Error cleaning up friend data:", error);
    throw error;
  }
};
