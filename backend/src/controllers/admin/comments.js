import Comment from "../../models/Comment.js";

/**
 * Admin: Edit any comment
 * PATCH /api/admin/comments/:commentId
 */
export const adminEditComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.content = content.trim();
    comment.editedAt = Date.now();

    await comment.save();

    const updatedComment = await Comment.findById(commentId).populate(
      "author",
      "name displayName _id"
    );

    res.json({
      success: true,
      message: "Comment updated by admin",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Admin edit comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to edit comment",
    });
  }
};

/**
 * Admin: Delete any comment
 * DELETE /api/admin/comments/:commentId
 */
export const adminDeleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: commentId });

    res.json({
      success: true,
      message: "Comment and replies deleted by admin",
    });
  } catch (error) {
    console.error("Admin delete comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};
