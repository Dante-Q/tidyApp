import Post from "../../models/Post.js";
import { handleControllerError } from "../utils/postHelpers.js";

/**
 * Get single post by ID and increment view count
 */
export const getPostById = async (req, res) => {
  try {
    // First, increment view count atomically
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "name displayName")
      .populate("commentCount")
      .lean(); // Use lean() for read-only queries to reduce memory

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    handleControllerError(res, "Error fetching post", error);
  }
};
