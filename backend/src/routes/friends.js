import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getSentFriendRequests,
  cancelFriendRequest,
  getFriends,
  removeFriend,
  getFriendshipStatus,
} from "../controllers/friends/index.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get pending friend requests for current user
router.get("/requests", getFriendRequests);

// Get sent friend requests (outgoing)
router.get("/sent", getSentFriendRequests);

// Get friendship status with another user
router.get("/status/:userId", getFriendshipStatus);

// Send friend request
router.post("/request/:userId", sendFriendRequest);

// Cancel/withdraw a sent friend request
router.delete("/request/:userId", cancelFriendRequest);

// Accept friend request
router.post("/accept/:requestId", acceptFriendRequest);

// Reject friend request
router.post("/reject/:requestId", rejectFriendRequest);

// Remove a friend
router.delete("/:friendId", removeFriend);

// Get friends list for a user (must come last - generic :userId route)
router.get("/:userId", getFriends);

export default router;
