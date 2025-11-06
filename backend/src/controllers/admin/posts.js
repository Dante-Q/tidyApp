import Post from "../../models/Post.js";
import { FORUM_CATEGORIES } from "../../config/forumCategories.js";

/**
 * Admin: Edit any post
 * PATCH /api/admin/posts/:postId
 */
export const adminEditPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, category, subcategory, tags } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Validate category and subcategory if provided
    if (category) {
      const validCategory = FORUM_CATEGORIES.find(
        (cat) => cat.slug === category
      );
      if (!validCategory) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      if (subcategory) {
        // subcategories is an array of strings in backend config
        const isValidSubcategory =
          validCategory.subcategories.includes(subcategory);
        if (!isValidSubcategory) {
          return res.status(400).json({
            success: false,
            message: "Invalid subcategory",
          });
        }
      }
    }

    // Update fields if provided
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (subcategory) post.subcategory = subcategory;
    if (tags) post.tags = tags;

    post.editedAt = Date.now();

    await post.save();

    const updatedPost = await Post.findById(postId).populate(
      "author",
      "name displayName _id"
    );

    res.json({
      success: true,
      message: "Post updated by admin",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Admin edit post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to edit post",
    });
  }
};

/**
 * Admin: Delete any post
 * DELETE /api/admin/posts/:postId
 */
export const adminDeletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      message: "Post deleted by admin",
    });
  } catch (error) {
    console.error("Admin delete post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};

/**
 * Admin: Move post to different category/subcategory
 * PATCH /api/admin/posts/:postId/move
 */
export const adminMovePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { category, subcategory } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // Validate category
    const validCategory = FORUM_CATEGORIES.find((cat) => cat.slug === category);
    if (!validCategory) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    // Validate subcategory if provided
    if (subcategory) {
      // subcategories is an array of strings in backend config
      const isValidSubcategory =
        validCategory.subcategories.includes(subcategory);
      if (!isValidSubcategory) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory for this category",
        });
      }
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.category = category;
    post.subcategory = subcategory || null;
    // Don't set editedAt when just moving - it's not an edit

    await post.save();

    const updatedPost = await Post.findById(postId).populate(
      "author",
      "name displayName _id"
    );

    res.json({
      success: true,
      message: `Post moved to ${category}${
        subcategory ? `/${subcategory}` : ""
      }`,
      post: updatedPost,
    });
  } catch (error) {
    console.error("Admin move post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to move post",
    });
  }
};

/**
 * Admin: Toggle pin status on a post
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

/**
 * Admin: Toggle comments disabled status for a post
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
    console.error("Error toggling comments status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update comments status",
      error: error.message,
    });
  }
};
