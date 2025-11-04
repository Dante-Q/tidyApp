import User from "../../models/User.js";
import {
  findFriendRequest,
  handleControllerError,
} from "../utils/friendHelpers.js";

/**
 * Get friendship status between current user and another user
 * GET /api/friends/status/:userId
 */
export const getFriendshipStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Can't check status with yourself
    if (userId === currentUserId.toString()) {
      return res.json({
        success: true,
        status: "self",
      });
    }

    // Fetch both users in parallel for better performance
    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(userId),
    ]);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already friends (bidirectional check)
    if (currentUser.friends.some((id) => id.toString() === userId.toString())) {
      return res.json({
        success: true,
        status: "friends",
      });
    }

    // Check if current user has sent a request to target user
    const sentRequest = findFriendRequest(targetUser, currentUserId);
    if (sentRequest) {
      return res.json({
        success: true,
        status: "pending_sent",
      });
    }

    // Check if target user has sent a request to current user
    const receivedRequest = findFriendRequest(currentUser, userId);
    if (receivedRequest) {
      return res.json({
        success: true,
        status: "pending_received",
      });
    }

    // No relationship
    res.json({
      success: true,
      status: "none",
    });
  } catch (error) {
    handleControllerError(res, "Failed to check friendship status", error);
  }
};
