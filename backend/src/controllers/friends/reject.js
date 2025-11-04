import User from "../../models/User.js";
import {
  findFriendRequest,
  handleControllerError,
} from "../utils/friendHelpers.js";

/**
 * Reject a friend request
 * POST /api/friends/reject/:requestId
 */
export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find and remove the friend request
    const friendRequest = findFriendRequest(currentUser, requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    // Remove friend request atomically
    await User.updateOne(
      { _id: currentUserId },
      { $pull: { friendRequests: { from: requestId } } }
    );

    res.json({
      success: true,
      message: "Friend request rejected",
    });
  } catch (error) {
    handleControllerError(res, "Failed to reject friend request", error);
  }
};
