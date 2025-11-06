import mongoose from "mongoose";
import {
  getAllCategorySlugs,
  getAllSubcategorySlugs,
} from "../config/forumCategories.js";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      // Don't trim - preserve spaces, newlines, and emojis
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: getAllCategorySlugs(),
      lowercase: true,
    },
    subcategory: {
      type: String,
      enum: getAllSubcategorySlugs(),
      lowercase: true,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          // Allow empty array
          if (!tags || tags.length === 0) return true;
          // Valid beach tags: muizenberg, bloubergstrand, strand, clifton, kalk-bay, milnerton
          const validTags = [
            "muizenberg",
            "bloubergstrand",
            "strand",
            "clifton",
            "kalk-bay",
            "milnerton",
          ];
          return tags.every((tag) => validTags.includes(tag.toLowerCase()));
        },
        message: "Invalid beach tag",
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    commentsDisabled: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for comment count
postSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  count: true,
});

// Index for faster queries
postSchema.index({ category: 1, subcategory: 1, createdAt: -1 });
postSchema.index({ author: 1 });
postSchema.index({ tags: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
