import Comment from "../../models/Comment.js";
import { handleControllerError } from "../utils/commentHelpers.js";

/**
 * Get comments for a post with pagination
 * GET /api/comments/:postId
 */
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Parse pagination values explicitly to prevent string math bugs
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    // Get top-level comments (no parent)
    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate("author", "name displayName isAdmin showAdminBadge avatarColor")
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNum);

    // Batch fetch all replies in a single query (eliminates N+1 problem)
    const commentIds = comments.map((c) => c._id);
    const replies = await Comment.find({ parentComment: { $in: commentIds } })
      .populate("author", "name displayName isAdmin showAdminBadge avatarColor")
      .sort("createdAt");

    // Group replies by parent comment ID
    const repliesByParent = replies.reduce((acc, reply) => {
      const parentId = reply.parentComment.toString();
      acc[parentId] = acc[parentId] || [];
      acc[parentId].push(reply);
      return acc;
    }, {});

    // Attach replies to their parent comments
    const commentsWithReplies = comments.map((comment) => ({
      ...comment.toObject(),
      replies: repliesByParent[comment._id.toString()] || [],
    }));

    const total = await Comment.countDocuments({
      post: postId,
      parentComment: null,
    });

    res.json({
      comments: commentsWithReplies,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    handleControllerError(res, "Error fetching comments", error);
  }
};
