import mongoose from "mongoose";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/tidyapp";

async function deletePost(postId) {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    if (!postId) {
      console.error("❌ Error: Post ID is required");
      console.log("Usage: node deletePost.js <postId>");
      process.exit(1);
    }

    // Find the post first to show details
    const post = await Post.findById(postId);

    if (!post) {
      console.error(`❌ Post not found with ID: ${postId}`);
      process.exit(1);
    }

    console.log("\n📄 Post Details:");
    console.log(`   Title: ${post.title}`);
    console.log(`   Author: ${post.author?.name || "Unknown"}`);
    console.log(
      `   Category: ${post.category}/${post.subcategory || "general"}`
    );
    console.log(`   Created: ${post.createdAt}`);

    // Delete all comments associated with this post
    const deletedComments = await Comment.deleteMany({ post: postId });
    console.log(
      `\n🗑️  Deleted ${deletedComments.deletedCount} associated comments`
    );

    // Delete the post
    await Post.findByIdAndDelete(postId);
    console.log("🗑️  Post deleted successfully!");
  } catch (error) {
    console.error("❌ Error deleting post:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Get post ID from command line arguments
const postId = process.argv[2];
deletePost(postId);
