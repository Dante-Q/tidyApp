import Comment from "../../models/Comment.js";
import {
  handleControllerError,
  canModify,
  validateCommentContent,
} from "../utils/commentHelpers.js";

/**
 * Update a comment (content only)
 * PUT /api/comments/:id
 */
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user is authorized to update this comment
    if (!canModify(comment, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this comment",
      });
    }

    // Validate and sanitize content if provided
    if (req.body.content) {
      const validation = validateCommentContent(req.body.content);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.error,
        });
      }

      comment.content = validation.sanitized;
      comment.isEdited = true;
      comment.editedAt = new Date();
    }

    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name"
    );

    res.json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    handleControllerError(res, "Error updating comment", error);
  }
};
