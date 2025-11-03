import User from "../models/User.js";

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
      return res
        .status(400)
        .json({ error: "Cannot send friend request to yourself" });
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already friends
    if (targetUser.friends.includes(currentUserId)) {
      return res.status(400).json({ error: "Already friends with this user" });
    }

    // Check if request already exists
    const existingRequest = targetUser.friendRequests.find(
      (req) => req.from.toString() === currentUserId.toString()
    );
    if (existingRequest) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    // Add friend request
    targetUser.friendRequests.push({
      from: currentUserId,
      createdAt: new Date(),
    });
    await targetUser.save();

    res.json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Send friend request error:", error);
    res.status(500).json({ error: "Failed to send friend request" });
  }
};

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
      return res.status(404).json({ error: "User not found" });
    }

    // Find the friend request
    const requestIndex = currentUser.friendRequests.findIndex(
      (req) => req.from.toString() === requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    // Add both users to each other's friends list
    currentUser.friends.push(requestId);
    currentUser.friendRequests.splice(requestIndex, 1);
    await currentUser.save();

    // Add current user to requester's friends list
    const requester = await User.findById(requestId);
    if (requester) {
      requester.friends.push(currentUserId);
      await requester.save();
    }

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Accept friend request error:", error);
    res.status(500).json({ error: "Failed to accept friend request" });
  }
};

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
      return res.status(404).json({ error: "User not found" });
    }

    // Find and remove the friend request
    const requestIndex = currentUser.friendRequests.findIndex(
      (req) => req.from.toString() === requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    currentUser.friendRequests.splice(requestIndex, 1);
    await currentUser.save();

    res.json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Reject friend request error:", error);
    res.status(500).json({ error: "Failed to reject friend request" });
  }
};

/**
 * Get pending friend requests for current user
 * GET /api/friends/requests
 */
export const getFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const user = await User.findById(currentUserId).populate(
      "friendRequests.from",
      "name _id"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ requests: user.friendRequests });
  } catch (error) {
    console.error("Get friend requests error:", error);
    res.status(500).json({ error: "Failed to fetch friend requests" });
  }
};

/**
 * Get friends list for a user
 * GET /api/friends/:userId
 */
export const getFriends = async (req, res) => {
  try {
    let { userId } = req.params;

    // If userId is "me", use the authenticated user's ID
    if (userId === "me") {
      userId = req.user._id;
    }

    const user = await User.findById(userId).populate("friends", "name _id");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ friends: user.friends });
  } catch (error) {
    console.error("Get friends error:", error);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
};

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
      return res.status(404).json({ error: "User not found" });
    }

    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== friendId
    );
    await currentUser.save();

    // Remove current user from friend's list
    const friend = await User.findById(friendId);
    if (friend) {
      friend.friends = friend.friends.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
      await friend.save();
    }

    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Remove friend error:", error);
    res.status(500).json({ error: "Failed to remove friend" });
  }
};

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
      return res.json({ status: "self" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already friends
    if (currentUser.friends.includes(userId)) {
      return res.json({ status: "friends" });
    }

    // Check if current user has sent a request to target user
    const sentRequest = targetUser.friendRequests.find(
      (req) => req.from.toString() === currentUserId.toString()
    );
    if (sentRequest) {
      return res.json({ status: "pending_sent" });
    }

    // Check if target user has sent a request to current user
    const receivedRequest = currentUser.friendRequests.find(
      (req) => req.from.toString() === userId
    );
    if (receivedRequest) {
      return res.json({ status: "pending_received" });
    }

    // No relationship
    res.json({ status: "none" });
  } catch (error) {
    console.error("Get friendship status error:", error);
    res.status(500).json({ error: "Failed to check friendship status" });
  }
};
