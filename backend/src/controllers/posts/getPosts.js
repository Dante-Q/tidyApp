import Post from "../../models/Post.js";
import { handleControllerError } from "../utils/postHelpers.js";

/**
 * Get all posts with pagination and filtering
 */
export const getPosts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      author,
      tags,
      page = 1,
      limit = 20,
      sort = "-createdAt",
    } = req.query;

    // Parse pagination values explicitly to prevent string math bugs
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (category) {
      query.category = category;
    }
    if (subcategory) {
      query.subcategory = subcategory;
    }
    if (author) {
      query.author = author;
    }
    if (tags) {
      // tags can be a comma-separated string or an array
      const tagArray = Array.isArray(tags) ? tags : tags.split(",");
      query.tags = { $in: tagArray };
    }

    const posts = await Post.find(query)
      .populate("author", "name")
      .populate("commentCount")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(); // Use lean() for read-only queries to reduce memory

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    handleControllerError(res, "Error fetching posts", error);
  }
};
