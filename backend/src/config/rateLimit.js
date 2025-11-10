/**
 * Rate Limiting Configuration
 * Centralized rate limit settings for all endpoints
 */

export const rateLimitConfig = {
  // Global rate limit for all requests
  global: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Authentication endpoints (login, register)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: "Too many authentication attempts, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Admin endpoints
  admin: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,
    message: "Too many admin requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Public data (tides, sea level)
  publicData: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Friend actions
  friends: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50,
    message: "Too many friend requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  },

  // General API endpoints (posts, comments)
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  },
};
