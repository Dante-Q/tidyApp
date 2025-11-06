import User from "../../models/User.js";
import { handleControllerError } from "../utils/friendHelpers.js";

/**
 * Cancel/withdraw a friend request that was sent to another user
 * DELETE /api/friends/request/:userId
 */
export const cancelFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params; // The user who received the request
    const currentUserId = req.user._id; // The user who sent it (and wants to cancel)

    // Remove the friend request from the target user's friendRequests array
    const result = await User.updateOne(
      { _id: userId },
      {
        $pull: {
          friendRequests: { from: currentUserId },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    res.json({
      success: true,
      message: "Friend request cancelled successfully",
    });
  } catch (error) {
    handleControllerError(res, "Failed to cancel friend request", error);
  }
};
