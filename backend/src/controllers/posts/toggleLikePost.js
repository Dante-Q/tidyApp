import Post from "../../models/Post.js";
import { handleControllerError } from "../utils/postHelpers.js";

/**
 * Like/Unlike post
 */
export const toggleLikePost = async (req, res) => {
  try {
    // First check if post exists
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user has already liked
    const hasLiked = post.likes.some((id) => id.equals(req.user._id));

    // Use atomic operation to prevent race conditions
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      hasLiked
        ? { $pull: { likes: req.user._id } }
        : { $addToSet: { likes: req.user._id } },
      { new: true } // Return updated document
    );

    res.json({
      success: true,
      likes: updatedPost.likes.length,
      isLiked: !hasLiked,
    });
  } catch (error) {
    handleControllerError(res, "Error toggling like", error);
  }
};
