import express from "express";
import * as postsController from "../controllers/posts/index.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", postsController.getPosts);
router.get("/categories", postsController.getPostsByCategory);
router.get("/:id", postsController.getPostById);

// Protected routes (require authentication)
router.post("/", protect, postsController.createPost);
router.put("/:id", protect, postsController.updatePost);
router.delete("/:id", protect, postsController.deletePost);
router.post("/:id/like", protect, postsController.toggleLikePost);

export default router;
