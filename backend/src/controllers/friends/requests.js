import User from "../../models/User.js";
import { handleControllerError } from "../utils/friendHelpers.js";

/**
 * Get pending friend requests for current user
 * GET /api/friends/requests
 */
export const getFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const user = await User.findById(currentUserId).populate(
      "friendRequests.from",
      "name displayName _id"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      requests: user.friendRequests,
    });
  } catch (error) {
    handleControllerError(res, "Failed to fetch friend requests", error);
  }
};
