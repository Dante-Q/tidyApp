import express from "express";
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/post/:postId", getCommentsByPost);

// Protected routes (require authentication)
router.post("/", protect, createComment);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);
router.post("/:id/like", protect, toggleLikeComment);

export default router;
