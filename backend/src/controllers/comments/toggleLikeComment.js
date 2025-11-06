import Comment from "../../models/Comment.js";
import { handleControllerError } from "../utils/commentHelpers.js";

/**
 * Like or unlike a comment
 * POST /api/comments/:id/like
 */
export const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user has already liked using proper ObjectId comparison
    const hasLiked = comment.likes.some((id) => id.equals(req.user._id));

    if (hasLiked) {
      // Unlike the comment
      comment.likes.pull(req.user._id);
    } else {
      // Like the comment
      comment.likes.addToSet(req.user._id);
    }

    await comment.save();

    res.json({
      success: true,
      likes: comment.likes.length,
      isLiked: !hasLiked,
    });
  } catch (error) {
    handleControllerError(res, "Error toggling like", error);
  }
};
