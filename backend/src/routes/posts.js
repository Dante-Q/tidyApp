import express from "express";
import * as postsController from "../controllers/posts/index.js";
import { protect, optionalAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = express.Router();

// Public routes
router.get("/", postsController.getPosts);
router.get("/categories", postsController.getPostsByCategory);

// Protected routes (require authentication)
router.post("/", protect, postsController.createPost);

// Admin-only routes (must come before /:id routes)
router.patch("/:id/pin", protect, requireAdmin, postsController.togglePinPost);
router.patch(
  "/:id/comments",
  protect,
  requireAdmin,
  postsController.toggleComments
);

// Routes with :id parameter (must come after more specific routes)
router.get("/:id", optionalAuth, postsController.getPostById);
router.put("/:id", protect, postsController.updatePost);
router.delete("/:id", protect, postsController.deletePost);
router.post("/:id/like", protect, postsController.toggleLikePost);

export default router;
