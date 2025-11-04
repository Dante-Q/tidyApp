import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
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

    // Create new user
    const user = await User.create({
      email,
      password,
      name: nameValidation.sanitized,
      isAdmin: isAdminEmail(email), // Check if email is in admin list
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
        isAdmin: user.isAdmin,
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

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update admin status based on current config (in case admin list changed)
    const shouldBeAdmin = isAdminEmail(user.email);
    if (user.isAdmin !== shouldBeAdmin) {
      user.isAdmin = shouldBeAdmin;
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
        isAdmin: user.isAdmin,
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

      res.json(user);
    } catch (err) {
      res.status(401).json({ message: "Token is not valid" });
    }
  })
);

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// Update profile (displayName) - Protected route
router.patch(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const { displayName } = req.body;

    if (!displayName || !displayName.trim()) {
      return res.status(400).json({ message: "Display name is required" });
    }

    const validation = validateName(displayName);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.error });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.displayName = validation.sanitized;
    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        displayName: user.displayName,
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

    // Remove user from all friends lists
    await User.updateMany({ friends: userId }, { $pull: { friends: userId } });

    // Remove all friend requests to this user
    await User.updateMany(
      { "friendRequests.from": userId },
      { $pull: { friendRequests: { from: userId } } }
    );

    // Remove all friend requests from this user
    await User.updateMany(
      {
        _id: {
          $in: (await User.findById(userId)).friendRequests.map((r) => r.from),
        },
      },
      { $pull: { friendRequests: { from: userId } } }
    );

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Clear the auth cookie
    res.clearCookie("token");

    res.json({ message: "Account deleted successfully" });
  })
);

export default router;
