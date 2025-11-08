import Post from "../../models/Post.js";
import { handleControllerError } from "../utils/postHelpers.js";
import { getRefId } from "../utils/refHelpers.js";

/**
 * Get single post by ID and increment view count
 * (unless the viewer is the post author)
 */
export const getPostById = async (req, res) => {
  try {
    // First, fetch the post to check authorship
    const post = await Post.findById(req.params.id)
      .populate("author", "name displayName isAdmin showAdminBadge avatarColor")
      .populate("commentCount")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only increment views if viewer is not the author
    const viewerId = req.user?._id?.toString();
    const authorId = getRefId(post.author);

    if (!authorId || viewerId !== authorId) {
      // Increment view count atomically (don't wait for result)
      Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec(); // Fire and forget

      // Increment the view count in the returned post object
      post.views = (post.views || 0) + 1;
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    handleControllerError(res, "Error fetching post", error);
  }
};
