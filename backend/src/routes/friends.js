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

/**
 * Friends routes with separate rate limiting for read vs write operations
 * @param {Function} readLimiter - Rate limiter for read operations (GET)
 * @param {Function} writeLimiter - Rate limiter for write operations (POST, DELETE)
 */
export default function friendsRoutes(readLimiter, writeLimiter) {
  const router = express.Router();

  // All routes require authentication
  router.use(protect);

  // READ operations - high limit (500/15min)
  router.get("/requests", readLimiter, getFriendRequests);
  router.get("/sent", readLimiter, getSentFriendRequests);
  router.get("/status/:userId", readLimiter, getFriendshipStatus);
  router.get("/:userId", readLimiter, getFriends); // Must come last - generic :userId route

  // WRITE operations - strict limit (30/15min)
  router.post("/request/:userId", writeLimiter, sendFriendRequest);
  router.delete("/request/:userId", writeLimiter, cancelFriendRequest);
  router.post("/accept/:requestId", writeLimiter, acceptFriendRequest);
  router.post("/reject/:requestId", writeLimiter, rejectFriendRequest);
  router.delete("/:friendId", writeLimiter, removeFriend);

  return router;
}
