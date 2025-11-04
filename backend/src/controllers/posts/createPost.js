import Post from "../../models/Post.js";
import { isValidCategorySubcategory } from "../../config/forumCategories.js";
import {
  handleControllerError,
  validatePostTitle,
  validatePostContent,
} from "../utils/postHelpers.js";

/**
 * Create new post
 */
export const createPost = async (req, res) => {
  try {
    const { category, subcategory, tags } = req.body;

    // Validate and sanitize title
    const titleValidation = validatePostTitle(req.body.title);
    if (!titleValidation.valid) {
      return res.status(400).json({
        success: false,
        message: titleValidation.error,
      });
    }

    // Validate and sanitize content
    const contentValidation = validatePostContent(req.body.content);
    if (!contentValidation.valid) {
      return res.status(400).json({
        success: false,
        message: contentValidation.error,
      });
    }

    // Validate category and subcategory combination
    if (subcategory && !isValidCategorySubcategory(category, subcategory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category and subcategory combination",
      });
    }

    const post = await Post.create({
      title: titleValidation.sanitized,
      content: contentValidation.sanitized,
      category,
      subcategory: subcategory || null,
      tags: tags || [],
      author: req.user._id,
    });

    // Populate author in one step instead of separate findById
    await post.populate("author", "name");

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    handleControllerError(res, "Error creating post", error);
  }
};
