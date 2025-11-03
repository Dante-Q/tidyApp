import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
  removeFriend,
  getFriendshipStatus,
} from "../controllers/friendController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Send friend request
router.post("/request/:userId", sendFriendRequest);

// Accept friend request
router.post("/accept/:requestId", acceptFriendRequest);

// Reject friend request
router.post("/reject/:requestId", rejectFriendRequest);

// Get pending friend requests for current user
router.get("/requests", getFriendRequests);

// Get friendship status with another user
router.get("/status/:userId", getFriendshipStatus);

// Get friends list for a user
router.get("/:userId", getFriends);

// Remove a friend
router.delete("/:friendId", removeFriend);

export default router;
