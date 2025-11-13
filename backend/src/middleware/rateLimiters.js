/**
 * Rate Limiting Middleware
 * Creates rate limiters with MongoDB persistence
 */

import rateLimit from "express-rate-limit";
import MongoStore from "rate-limit-mongo";
import { rateLimitConfig } from "../config/rateLimit.js";

/**
 * Creates a MongoDB store for rate limiting
 * @param {string} mongoUri - MongoDB connection string
 * @returns {MongoStore} MongoDB store instance
 */
function createMongoStore(mongoUri) {
  return new MongoStore({
    uri: mongoUri,
    collectionName: "rateLimits",
    expireTimeMs: 15 * 60 * 1000,
    errorHandler: (error) => {
      console.error("❌ Rate limit store error:", error);
    },
  });
}

/**
 * Initialize all rate limiters with MongoDB store
 * MUST be called after MongoDB connection is established
 * @param {string} mongoUri - MongoDB connection string
 * @returns {Object} Object containing all rate limiter middleware
 */
export function initRateLimiters(mongoUri) {
  const store = createMongoStore(mongoUri);

  console.log("✅ Rate limiters initialized with MongoDB store");

  return {
    globalLimiter: rateLimit({
      ...rateLimitConfig.global,
      store,
    }),

    authLimiter: rateLimit({
      ...rateLimitConfig.auth,
      store,
    }),

    adminLimiter: rateLimit({
      ...rateLimitConfig.admin,
      store,
    }),

    publicDataLimiter: rateLimit({
      ...rateLimitConfig.publicData,
      store,
    }),

    friendsReadLimiter: rateLimit({
      ...rateLimitConfig.friendsRead,
      store,
    }),

    friendsWriteLimiter: rateLimit({
      ...rateLimitConfig.friendsWrite,
      store,
    }),

    apiLimiter: rateLimit({
      ...rateLimitConfig.api,
      store,
    }),
  };
}
