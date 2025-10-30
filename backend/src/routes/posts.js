import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  getPostsByCategory,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getPosts);
router.get("/categories", getPostsByCategory);
router.get("/:id", getPostById);

// Protected routes (require authentication)
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLikePost);

export default router;
