import Post from "../../models/Post.js";
import { handleControllerError } from "../utils/postHelpers.js";

/**
 * Get posts by category with stats
 */
export const getPostsByCategory = async (req, res) => {
  try {
    const categories = [
      "surf-reports",
      "beach-safety",
      "general-discussion",
      "events-meetups",
    ];

    // Use aggregation to get stats efficiently in fewer queries
    const stats = await Promise.all(
      categories.map(async (category) => {
        // Single aggregation query to get all stats including total comments
        const [categoryStats] = await Post.aggregate([
          { $match: { category } },
          {
            $facet: {
              // Get total post count
              totalCount: [{ $count: "count" }],
              // Get total comments count for all posts in this category
              totalComments: [
                {
                  $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post",
                    as: "comments",
                    pipeline: [{ $project: { _id: 1 } }], // Only fetch comment IDs for counting
                  },
                },
                {
                  $unwind: {
                    path: "$comments",
                    preserveNullAndEmptyArrays: true, // Include posts with no comments
                  },
                },
                {
                  $group: {
                    _id: null,
                    count: {
                      $sum: {
                        $cond: [{ $ifNull: ["$comments", false] }, 1, 0],
                      },
                    },
                  },
                },
              ],
              // Get recent posts with their details
              recentPosts: [
                { $sort: { createdAt: -1 } },
                { $limit: 5 },
                {
                  $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                  },
                },
                { $unwind: "$author" },
                {
                  $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post",
                    as: "comments",
                    pipeline: [{ $project: { _id: 1 } }], // Only fetch IDs for counting
                  },
                },
                {
                  $addFields: {
                    commentCount: { $size: "$comments" },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    category: 1,
                    subcategory: 1,
                    tags: 1,
                    views: 1,
                    likes: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    editedAt: 1,
                    "author._id": 1,
                    "author.name": 1,
                    commentCount: 1,
                  },
                },
              ],
            },
          },
        ]);

        return {
          category,
          totalPosts: categoryStats.totalCount[0]?.count || 0,
          totalComments: categoryStats.totalComments[0]?.count || 0,
          recentPosts: categoryStats.recentPosts,
        };
      })
    );

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    handleControllerError(res, "Error fetching category stats", error);
  }
};
