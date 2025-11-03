import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import tideRoutes from "./routes/tides.js";
import seaLevelRoutes from "./routes/seaLevel.js";
import cookieParser from "cookie-parser";

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

// CORS configuration - allow localhost and 127.0.0.1 on any port (for development)
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);

    // Allow localhost and 127.0.0.1 on any port
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // Allow cookies and auth headers
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Test route
app.get("/", (req, res) => {
  res.send("tidyApp API Running!");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Forum routes
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Tide data routes
app.use("/api/tides", tideRoutes);

// Sea level data routes
app.use("/api/sea-level", seaLevelRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
