import Post from "../../models/Post.js";
import Comment from "../../models/Comment.js";
import { handleControllerError, canModifyPost } from "../utils/postHelpers.js";

/**
 * Delete post and all associated comments
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user is authorized to delete this post
    if (!canModifyPost(post, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    // Delete all comments associated with the post
    await Comment.deleteMany({ post: post._id });

    await post.deleteOne();

    res.json({
      success: true,
      message: "Post and associated comments deleted successfully",
    });
  } catch (error) {
    handleControllerError(res, "Error deleting post", error);
  }
};
