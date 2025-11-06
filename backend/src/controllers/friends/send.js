import User from "../../models/User.js";
import {
  findFriendRequest,
  handleControllerError,
} from "../utils/friendHelpers.js";

/**
 * Send a friend request
 * POST /api/friends/request/:userId
 */
export const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params; // User to send request to
    const currentUserId = req.user._id; // Authenticated user

    // Validate: Can't friend yourself
    if (userId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot send friend request to yourself",
      });
    }

    // Fetch both users to perform all validations
    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(userId),
    ]);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already friends
    if (
      targetUser.friends.some(
        (id) => id.toString() === currentUserId.toString()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Already friends with this user",
      });
    }

    // Check if request already exists (you → them)
    const existingRequest = findFriendRequest(targetUser, currentUserId);
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already sent",
      });
    }

    // Check if target user has already sent a request to current user (them → you)
    const reverseRequest = findFriendRequest(currentUser, userId);
    if (reverseRequest) {
      return res.status(400).json({
        success: false,
        message:
          "This user has already sent you a friend request. Accept it instead.",
      });
    }

    // Add friend request atomically to prevent race conditions
    await User.updateOne(
      { _id: targetUser._id },
      {
        $addToSet: {
          friendRequests: { from: currentUserId, createdAt: new Date() },
        },
      }
    );

    res.json({
      success: true,
      message: "Friend request sent successfully",
    });
  } catch (error) {
    handleControllerError(res, "Failed to send friend request", error);
  }
};
