import User from "../../models/User.js";
import { handleControllerError } from "../utils/friendHelpers.js";

/**
 * Get friend requests that the current user has sent to others
 * GET /api/friends/sent
 */
export const getSentFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all users who have pending requests from the current user
    const usersWithRequests = await User.find({
      "friendRequests.from": currentUserId,
    })
      .select("name displayName _id friendRequests")
      .lean();

    // Map to get the request details with recipient info
    const sentRequests = usersWithRequests
      .map((user) => {
        // Find the specific request from current user in this user's friendRequests array
        const request = user.friendRequests.find(
          (req) => req.from.toString() === currentUserId.toString()
        );

        // Skip if request not found (shouldn't happen but be safe)
        if (!request) {
          return null;
        }

        return {
          _id: request._id,
          to: {
            _id: user._id,
            name: user.name,
            displayName: user.displayName,
          },
          createdAt: request.createdAt,
        };
      })
      .filter(Boolean); // Remove any null entries

    res.json({
      success: true,
      requests: sentRequests,
    });
  } catch (error) {
    console.error("Error in getSentFriendRequests:", error);
    handleControllerError(res, "Failed to fetch sent friend requests", error);
  }
};
