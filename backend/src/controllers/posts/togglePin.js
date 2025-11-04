import Post from "../../models/Post.js";

/**
 * Toggle pin status on a post (Admin only)
 * PATCH /api/posts/:id/pin
 */
export const togglePinPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the post
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Toggle the pin status
    post.isPinned = !post.isPinned;
    await post.save();

    res.json({
      success: true,
      message: post.isPinned
        ? "Post pinned successfully"
        : "Post unpinned successfully",
      isPinned: post.isPinned,
    });
  } catch (error) {
    console.error("Error toggling pin status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update pin status",
      error: error.message,
    });
  }
};
