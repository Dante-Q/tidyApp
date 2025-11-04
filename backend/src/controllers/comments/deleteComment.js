import Comment from "../../models/Comment.js";
import { handleControllerError, canModify } from "../utils/commentHelpers.js";

/**
 * Delete a comment and all its replies
 * DELETE /api/comments/:id
 */
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user is authorized to delete this comment
    if (!canModify(comment, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: comment._id });

    await comment.deleteOne();

    res.json({
      success: true,
      message: "Comment and replies deleted successfully",
    });
  } catch (error) {
    handleControllerError(res, "Error deleting comment", error);
  }
};
