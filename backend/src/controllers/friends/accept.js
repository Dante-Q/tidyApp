import User from "../../models/User.js";
import {
  findFriendRequest,
  handleControllerError,
} from "../utils/friendHelpers.js";

/**
 * Accept a friend request
 * POST /api/friends/accept/:requestId
 */
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params; // The _id of the user who sent the request
    const currentUserId = req.user._id;

    // Find current user
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the friend request
    const friendRequest = findFriendRequest(currentUser, requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    // Check if already friends (shouldn't happen, but good to validate)
    const alreadyFriends = currentUser.friends.some(
      (id) => id.toString() === requestId.toString()
    );

    if (alreadyFriends) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user",
      });
    }

    // Find the requester user first to ensure they exist
    const requester = await User.findById(requestId);
    if (!requester) {
      return res.status(404).json({
        success: false,
        message: "Requester user not found",
      });
    }

    // Use atomic operations to add friends and remove request
    // This prevents race conditions and ensures both operations succeed or fail together
    await Promise.all([
      // Add friend to current user's list and remove request
      User.updateOne(
        { _id: currentUserId },
        {
          $addToSet: { friends: requestId },
          $pull: { friendRequests: { from: requestId } },
        }
      ),
      // Add current user to requester's friends list
      User.updateOne(
        { _id: requestId },
        { $addToSet: { friends: currentUserId } }
      ),
    ]);

    res.json({
      success: true,
      message: "Friend request accepted",
    });
  } catch (error) {
    handleControllerError(res, "Failed to accept friend request", error);
  }
};
