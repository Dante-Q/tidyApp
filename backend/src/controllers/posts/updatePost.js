import Post from "../../models/Post.js";
import { isValidCategorySubcategory } from "../../config/forumCategories.js";
import {
  handleControllerError,
  canModifyPost,
  assignFields,
  validatePostTitle,
  validatePostContent,
} from "../utils/postHelpers.js";

/**
 * Update post
 */
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user is authorized to update this post
    if (!canModifyPost(post, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    const { category, subcategory, tags } = req.body;

    // Validate and sanitize title if provided
    if (req.body.title !== undefined) {
      const titleValidation = validatePostTitle(req.body.title);
      if (!titleValidation.valid) {
        return res.status(400).json({
          success: false,
          message: titleValidation.error,
        });
      }
      post.title = titleValidation.sanitized;
    }

    // Validate and sanitize content if provided
    if (req.body.content !== undefined) {
      const contentValidation = validatePostContent(req.body.content);
      if (!contentValidation.valid) {
        return res.status(400).json({
          success: false,
          message: contentValidation.error,
        });
      }
      post.content = contentValidation.sanitized;
    }

    // Validate category and subcategory combination if both are being updated
    if ((category || post.category) && subcategory) {
      const categoryToValidate = category || post.category;
      if (!isValidCategorySubcategory(categoryToValidate, subcategory)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category and subcategory combination",
        });
      }
    }

    // Update remaining allowed fields (title and content already handled with validation)
    assignFields(post, req.body, ["category", "tags"]);

    // Handle subcategory separately (can be null)
    if (subcategory !== undefined) {
      post.subcategory = subcategory || null;
    }

    // Set editedAt timestamp to mark this as an intentional edit
    post.editedAt = new Date();

    await post.save();

    // Populate both fields in one chain instead of separate calls
    await post.populate([
      { path: "author", select: "name" },
      { path: "commentCount" },
    ]);

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    handleControllerError(res, "Error updating post", error);
  }
};
