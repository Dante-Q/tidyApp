import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { protect } from "../middleware/auth.js";
import sanitizeHtml from "sanitize-html";
import { Filter } from "bad-words";
import { isAdminEmail } from "../config/adminConfig.js";

const router = express.Router();
const filter = new Filter();

/**
 * Validate and sanitize username/name
 * @param {String} name - Raw name from request
 * @returns {Object} { valid: boolean, sanitized: string, error: string }
 */
const validateName = (name) => {
  const trimmed = name?.trim();

  if (!trimmed) {
    return { valid: false, error: "Name cannot be empty" };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters long" };
  }

  if (trimmed.length > 50) {
    return {
      valid: false,
      error: "Name exceeds maximum length of 50 characters",
    };
  }

  // Remove all HTML tags (names should be plain text)
  const sanitized = sanitizeHtml(trimmed, {
    allowedTags: [],
    allowedAttributes: {},
  });

  // Remove emojis and other Unicode symbols to prevent spoofing admin crown
  // This regex removes emojis, symbols, and other non-basic characters
  const withoutEmojis = sanitized.replace(
    /[\u{1F000}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}]/gu,
    ""
  );

  const finalName = withoutEmojis.trim();

  if (!finalName) {
    return {
      valid: false,
      error: "Name cannot contain only emojis or symbols",
    };
  }

  // Check for profanity
  if (filter.isProfane(finalName)) {
    return {
      valid: false,
      error: "Name contains inappropriate language",
    };
  }

  return { valid: true, sanitized: finalName };
};

// Middleware to handle async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Register new user
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    // Validate and sanitize name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({ message: nameValidation.error });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if display name (which will be auto-generated from name) is already taken
    // Display names are auto-generated from name in the pre-save hook
    const displayNameExists = await User.findOne({
      displayName: { $regex: new RegExp(`^${nameValidation.sanitized}$`, "i") },
    });
    if (displayNameExists) {
      return res.status(400).json({
        message: "This name is already taken. Please choose a different name.",
      });
    }

    // Check if user should be admin
    const shouldBeAdmin = isAdminEmail(email);

    // Create new user
    const user = await User.create({
      email,
      password,
      name: nameValidation.sanitized,
      isAdmin: shouldBeAdmin,
      // Only set showAdminBadge for admins
      ...(shouldBeAdmin && { showAdminBadge: true }),
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Send JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Must be false in development for localhost
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        displayName: user.displayName,
        avatarColor: user.avatarColor,
        // Only include admin fields if user is admin
        ...(user.isAdmin && {
          isAdmin: true,
          showAdminBadge: user.showAdminBadge,
        }),
      },
    });
  })
);

// Login user
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Block login for system accounts
    if (user.isSystem) {
      return res
        .status(403)
        .json({ message: "Cannot login to system accounts" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update admin status based on current config (in case admin list changed)
    const shouldBeAdmin = isAdminEmail(user.email);
    if (user.isAdmin !== shouldBeAdmin) {
      user.isAdmin = shouldBeAdmin;
      // If promoting to admin, set showAdminBadge to true
      if (shouldBeAdmin) {
        user.showAdminBadge = true;
      }
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Send JWT as HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Must be false in development for localhost
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        displayName: user.displayName,
        avatarColor: user.avatarColor,
        // Only include admin fields if user is admin
        ...(user.isAdmin && {
          isAdmin: true,
          showAdminBadge: user.showAdminBadge,
        }),
      },
    });
  })
);

// Get current user (protected route example)
router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const token = req.cookies.token; // <-- read from cookie

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create response object
      const response = user.toObject();

      // Hide admin fields from non-admins (security best practice)
      if (!user.isAdmin) {
        delete response.isAdmin;
        delete response.showAdminBadge;
      }

      res.json(response);
    } catch (err) {
      res.status(401).json({ message: "Token is not valid" });
    }
  })
);

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// Update profile (displayName, avatarColor, bio, location, interests, and admin badge visibility) - Protected route
router.patch(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const {
      displayName,
      showAdminBadge,
      avatarColor,
      bio,
      location,
      interests,
    } = req.body;

    if (!displayName || !displayName.trim()) {
      return res.status(400).json({ message: "Display name is required" });
    }

    const validation = validateName(displayName);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.error });
    }

    // Validate avatarColor if provided
    if (avatarColor && !/^#[0-9A-F]{6}$/i.test(avatarColor)) {
      return res.status(400).json({
        message: "Avatar color must be a valid hex color (e.g., #6dd5ed)",
      });
    }

    // Check if display name is already taken by another user (case-insensitive)
    const existingUser = await User.findOne({
      displayName: { $regex: new RegExp(`^${validation.sanitized}$`, "i") },
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          "This display name is already taken. Please choose a different one.",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.displayName = validation.sanitized;

    // Update avatar color if provided
    if (avatarColor) {
      user.avatarColor = avatarColor;
    }

    // Update bio, location, interests if provided
    if (bio !== undefined) {
      // Bio validation
      if (bio && bio.length > 500) {
        return res.status(400).json({
          message: "Bio cannot exceed 500 characters",
        });
      }
      user.bio = bio; // Don't trim - preserve spaces, newlines, and emojis
    }
    if (location !== undefined) {
      const trimmedLocation = location.trim();
      if (trimmedLocation.length > 100) {
        return res.status(400).json({
          message: "Location cannot exceed 100 characters",
        });
      }
      user.location = trimmedLocation;
    }
    if (interests !== undefined) {
      const trimmedInterests = interests.trim();
      if (trimmedInterests.length > 100) {
        return res.status(400).json({
          message: "Interests cannot exceed 100 characters",
        });
      }
      user.interests = trimmedInterests;
    }

    // Only allow admins to change showAdminBadge setting
    if (user.isAdmin && typeof showAdminBadge === "boolean") {
      user.showAdminBadge = showAdminBadge;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        displayName: user.displayName,
        avatarColor: user.avatarColor,
        // Only include admin fields if user is admin
        ...(user.isAdmin && {
          isAdmin: true,
          showAdminBadge: user.showAdminBadge,
        }),
      },
    });
  })
);

// Delete account - Protected route
router.delete(
  "/account",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Use MongoDB transaction to ensure all operations succeed or rollback
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        // Find or create a "Deleted User" system account atomically
        // Using findOneAndUpdate with upsert prevents race conditions
        const deletedUserAccount = await User.findOneAndUpdate(
          { email: "deleted@system.local" },
          {
            $setOnInsert: {
              email: "deleted@system.local",
              password: await bcrypt.hash(Math.random().toString(36), 10),
              name: "[Deleted User]",
              displayName: "[Deleted User]",
              isSystem: true, // Mark as system account to prevent login
            },
          },
          { new: true, upsert: true, session }
        );

        // Reassign all posts to the deleted user account
        await Post.updateMany(
          { author: userId },
          { $set: { author: deletedUserAccount._id } },
          { session }
        );

        // Reassign all comments to the deleted user account
        await Comment.updateMany(
          { author: userId },
          { $set: { author: deletedUserAccount._id } },
          { session }
        );

        // Remove user from all friends lists
        await User.updateMany(
          { friends: userId },
          { $pull: { friends: userId } },
          { session }
        );

        // Remove all friend requests involving this user
        // This handles both incoming (requests TO this user) and outgoing (requests FROM this user)
        // since all requests have a "from" field that can match the deleted user's ID
        await User.updateMany(
          { "friendRequests.from": userId },
          { $pull: { friendRequests: { from: userId } } },
          { session }
        );

        // Delete the user
        await User.findByIdAndDelete(userId, { session });
      });

      // Transaction succeeded - clear the auth cookie
      res.clearCookie("token");
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      // Transaction failed - rollback happened automatically
      console.error("Account deletion failed:", error);
      res
        .status(500)
        .json({ error: "Failed to delete account. Please try again." });
    } finally {
      // Always end the session
      await session.endSession();
    }
  })
);

export default router;
