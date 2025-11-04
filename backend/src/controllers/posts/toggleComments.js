import Post from "../../models/Post.js";
import { handleControllerError } from "../utils/postHelpers.js";

/**
 * Toggle comments disabled status for a post (admin only)
 * PATCH /api/posts/:id/comments
 */
export const toggleComments = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.commentsDisabled = !post.commentsDisabled;
    await post.save();

    // Populate author information
    await post.populate(
      "author",
      "name displayName isAdmin showAdminBadge avatarColor"
    );

    res.json({
      success: true,
      message: post.commentsDisabled
        ? "Comments disabled successfully"
        : "Comments enabled successfully",
      post,
    });
  } catch (error) {
    handleControllerError(res, "Failed to update comments status", error);
  }
};
