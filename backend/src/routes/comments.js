import express from "express";
import * as commentsController from "../controllers/comments/index.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/post/:postId", commentsController.getCommentsByPost);

// Protected routes (require authentication)
router.post("/", protect, commentsController.createComment);
router.put("/:id", protect, commentsController.updateComment);
router.delete("/:id", protect, commentsController.deleteComment);
router.post("/:id/like", protect, commentsController.toggleLikeComment);

export default router;
