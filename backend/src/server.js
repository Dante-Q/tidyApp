import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { helmetConfig } from "./config/security.js";
import { corsOptions } from "./config/cors.js";
import { initRateLimiters } from "./middleware/rateLimiters.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import tideRoutes from "./routes/tides.js";
import seaLevelRoutes from "./routes/seaLevel.js";
import friendRoutes from "./routes/friends.js";
import adminRoutes from "./routes/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Startup guard: ensure required env vars are present
const requiredEnv = ["JWT_SECRET", "MONGO_URI"];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(
    `Missing required environment variable(s): ${missing.join(", ")}.`
  );
  console.error(
    "Please create a backend/.env (or update it) — see backend/.env.example for required values."
  );
  // Exit with non-zero code to prevent the server from starting in a broken state
  process.exit(1);
}

const app = express();

// 1. Security Headers (Helmet.js)
app.use(helmet(helmetConfig));
console.log(
  process.env.NODE_ENV === "production"
    ? "🔒 Production security headers enabled"
    : "🔓 Development security headers enabled"
);

// 2. Trust proxy for accurate IP detection (important for rate limiting behind reverse proxies)
app.set("trust proxy", 1);

// 3. CORS configuration
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// 4. Connect to MongoDB FIRST (required for rate limiting)
await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB connected");

// 5. Initialize rate limiters AFTER MongoDB connection
const {
  globalLimiter,
  authLimiter,
  adminLimiter,
  publicDataLimiter,
  friendsLimiter,
  apiLimiter,
} = initRateLimiters(process.env.MONGO_URI);

// 6. Apply global rate limiter to all requests
app.use(globalLimiter);

// 7. Routes with specific rate limiters
app.get("/", (req, res) => {
  res.send("tidyApp API Running!");
});

// Auth routes (strict rate limiting)
app.use("/api/auth", authLimiter, authRoutes);

// Forum routes (general API rate limiting)
app.use("/api/posts", apiLimiter, postRoutes);
app.use("/api/comments", apiLimiter, commentRoutes);

// Friends routes (friend-specific rate limiting)
app.use("/api/friends", friendsLimiter, friendRoutes);

// Admin routes (admin-specific rate limiting)
app.use("/api/admin", adminLimiter, adminRoutes);

// Public data routes (relaxed rate limiting)
app.use("/api/tides", publicDataLimiter, tideRoutes);
app.use("/api/sea-level", publicDataLimiter, seaLevelRoutes);

// 8. Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 9. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔒 Security: Helmet + Rate Limiting (MongoDB) enabled`);
});
