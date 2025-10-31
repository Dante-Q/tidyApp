import mongoose from "mongoose";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/tidyapp";

async function deleteUser(userId) {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    if (!userId) {
      console.error("❌ Error: User ID is required");
      console.log("Usage: node deleteUser.js <userId>");
      process.exit(1);
    }

    // Find the user first to show details
    const user = await User.findById(userId);

    if (!user) {
      console.error(`❌ User not found with ID: ${userId}`);
      process.exit(1);
    }

    console.log("\n👤 User Details:");
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Created: ${user.createdAt}`);

    // Count user's posts and comments
    const postCount = await Post.countDocuments({ author: userId });
    const commentCount = await Comment.countDocuments({ author: userId });

    console.log(`\n📊 User Activity:`);
    console.log(`   Posts: ${postCount}`);
    console.log(`   Comments: ${commentCount}`);

    // Delete all user's comments
    const deletedComments = await Comment.deleteMany({ author: userId });
    console.log(
      `\n🗑️  Deleted ${deletedComments.deletedCount} comments by user`
    );

    // Delete all user's posts (and their associated comments)
    const userPosts = await Post.find({ author: userId });
    for (const post of userPosts) {
      await Comment.deleteMany({ post: post._id });
    }
    const deletedPosts = await Post.deleteMany({ author: userId });
    console.log(`🗑️  Deleted ${deletedPosts.deletedCount} posts by user`);

    // Delete the user
    await User.findByIdAndDelete(userId);
    console.log("🗑️  User deleted successfully!");
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Get user ID from command line arguments
const userId = process.argv[2];
deleteUser(userId);
