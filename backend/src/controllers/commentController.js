import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// Get comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (page - 1) * limit;

    // Get top-level comments (no parent)
    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate("author", "name")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate("author", "name")
          .sort("createdAt");

        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    const total = await Comment.countDocuments({
      post: postId,
      parentComment: null,
    });

    res.json({
      comments: commentsWithReplies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching comments", error: error.message });
  }
};

// Create comment
export const createComment = async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if post is locked
    if (post.isLocked) {
      return res.status(403).json({
        message: "This post is locked and cannot accept new comments",
      });
    }

    // If it's a reply, verify parent comment exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
      parentComment: parentCommentId || null,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating comment", error: error.message });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    const { content } = req.body;

    if (content) {
      comment.content = content;
      comment.isEdited = true;
      comment.editedAt = new Date();
    }

    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name"
    );

    res.json(updatedComment);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating comment", error: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: comment._id });

    await comment.deleteOne();

    res.json({ message: "Comment and replies deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting comment", error: error.message });
  }
};

// Like/Unlike comment
export const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const userIndex = comment.likes.indexOf(req.user._id);

    if (userIndex === -1) {
      // Like the comment
      comment.likes.push(req.user._id);
    } else {
      // Unlike the comment
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();

    res.json({ likes: comment.likes.length, isLiked: userIndex === -1 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error toggling like", error: error.message });
  }
};
