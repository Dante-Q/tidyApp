import User from "../../models/User.js";
import { handleControllerError } from "../utils/friendHelpers.js";

/**
 * Remove a friend
 * DELETE /api/friends/:friendId
 */
export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const currentUserId = req.user._id;

    // Remove friend from current user's list
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user is actually in the friends list
    const isFriend = currentUser.friends.some(
      (id) => id.toString() === friendId.toString()
    );

    if (!isFriend) {
      return res.status(400).json({
        success: false,
        message: "This user is not in your friends list",
      });
    }

    // Remove friend from both users' lists atomically
    await Promise.all([
      User.updateOne({ _id: currentUserId }, { $pull: { friends: friendId } }),
      User.updateOne({ _id: friendId }, { $pull: { friends: currentUserId } }),
    ]);

    res.json({
      success: true,
      message: "Friend removed successfully",
    });
  } catch (error) {
    handleControllerError(res, "Failed to remove friend", error);
  }
};
