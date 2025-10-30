import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// Get all posts with pagination and filtering
export const getPosts = async (req, res) => {
  try {
    const { category, page = 1, limit = 20, sort = "-createdAt" } = req.query;

    const query = {};
    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .populate("author", "name email")
      .populate("commentCount")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

// Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email")
      .populate("commentCount");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching post", error: error.message });
  }
};

// Create new post
export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name email"
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating post", error: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    const { title, content, category } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;

    // Set editedAt timestamp to mark this as an intentional edit
    post.editedAt = new Date();

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name email")
      .populate("commentCount");

    res.json(updatedPost);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating post", error: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete all comments associated with the post
    await Comment.deleteMany({ post: post._id });

    await post.deleteOne();

    res.json({ message: "Post and associated comments deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};

// Like/Unlike post
export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userIndex = post.likes.indexOf(req.user._id);

    if (userIndex === -1) {
      // Like the post
      post.likes.push(req.user._id);
    } else {
      // Unlike the post
      post.likes.splice(userIndex, 1);
    }

    await post.save();

    res.json({ likes: post.likes.length, isLiked: userIndex === -1 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error toggling like", error: error.message });
  }
};

// Get posts by category with stats
export const getPostsByCategory = async (req, res) => {
  try {
    const categories = [
      "surf-reports",
      "beach-safety",
      "general-discussion",
      "events-meetups",
    ];

    const stats = await Promise.all(
      categories.map(async (category) => {
        const posts = await Post.find({ category })
          .populate("commentCount")
          .sort("-createdAt")
          .limit(5);

        const totalPosts = await Post.countDocuments({ category });
        const totalComments = await Comment.countDocuments({
          post: { $in: posts.map((p) => p._id) },
        });

        return {
          category,
          totalPosts,
          totalComments,
          recentPosts: posts,
        };
      })
    );

    res.json(stats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching category stats", error: error.message });
  }
};
