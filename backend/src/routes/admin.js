import express from "express";
import { protect } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import {
  adminEditPost,
  adminDeletePost,
  adminMovePost,
} from "../controllers/admin/posts.js";
import {
  adminEditComment,
  adminDeleteComment,
} from "../controllers/admin/comments.js";

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(protect);
router.use(requireAdmin);

// Post management
router.patch("/posts/:postId", adminEditPost);
router.delete("/posts/:postId", adminDeletePost);
router.patch("/posts/:postId/move", adminMovePost);

// Comment management
router.patch("/comments/:commentId", adminEditComment);
router.delete("/comments/:commentId", adminDeleteComment);

export default router;
