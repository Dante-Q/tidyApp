import User from "../../models/User.js";
import { handleControllerError } from "../utils/friendHelpers.js";

/**
 * Get friends list for a user
 * GET /api/friends/:userId
 */
export const getFriends = async (req, res) => {
  try {
    let { userId } = req.params;
    const currentUserId = req.user._id;

    // If userId is "me", use the authenticated user's ID
    if (userId === "me") {
      userId = req.user._id;
    }

    const user = await User.findById(userId).populate(
      "friends",
      "name displayName _id"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if viewing own profile
    const isOwnProfile = userId.toString() === currentUserId.toString();

    // If not viewing own profile, check bidirectional friendship
    let canViewFriends = isOwnProfile;

    if (!isOwnProfile) {
      // Check if current user is in target user's friends list (they friended you)
      const isInTargetFriendsList = user.friends.some(
        (friend) => friend._id.toString() === currentUserId.toString()
      );

      // Also check if target user is in current user's friends list (you friended them)
      const currentUser = await User.findById(currentUserId);
      const isInCurrentFriendsList = currentUser.friends.some(
        (id) => id.toString() === userId.toString()
      );

      // Both must be true for a valid friendship
      canViewFriends = isInTargetFriendsList && isInCurrentFriendsList;
    }

    // Always return user profile info, but friends list only if authorized
    res.json({
      success: true,
      friends: canViewFriends ? user.friends : [],
      canViewFriends: canViewFriends,
      user: {
        name: user.name,
        displayName: user.displayName,
        _id: user._id,
        avatarColor: user.avatarColor,
        bio: user.bio,
        location: user.location,
        interests: user.interests,
      },
    });
  } catch (error) {
    handleControllerError(res, "Failed to fetch friends", error);
  }
};
