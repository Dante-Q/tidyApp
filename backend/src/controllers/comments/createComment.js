import Comment from "../../models/Comment.js";
import Post from "../../models/Post.js";
import {
  handleControllerError,
  validateCommentContent,
} from "../utils/commentHelpers.js";

/**
 * Create a new comment or reply
 * POST /api/comments
 */
export const createComment = async (req, res) => {
  try {
    const { postId, parentCommentId } = req.body;

    // Validate and sanitize content
    const validation = validateCommentContent(req.body.content);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if post is locked
    if (post.isLocked) {
      return res.status(403).json({
        success: false,
        message: "This post is locked and cannot accept new comments",
      });
    }

    // If it's a reply, verify parent comment exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }
    }

    const comment = await Comment.create({
      content: validation.sanitized,
      post: postId,
      author: req.user._id,
      parentComment: parentCommentId || null,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name displayName isAdmin showAdminBadge avatarColor"
    );

    res.status(201).json({
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    handleControllerError(res, "Error creating comment", error);
  }
};
