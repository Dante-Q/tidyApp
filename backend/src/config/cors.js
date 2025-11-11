/**
 * CORS Configuration
 * Cross-Origin Resource Sharing settings for development and production
 */

const isDevelopment = process.env.NODE_ENV !== "production";

// Allowed origins
const allowedOrigins = isDevelopment
  ? [
      // Development: Allow localhost on any port
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,
    ]
  : [
      // Production: Allow both with and without www
      "https://tidyapp.co.za",
      "https://www.tidyapp.co.za",
      // Also allow the API subdomain for direct access
      "https://api.tidyapp.co.za",
    ];

/**
 * CORS configuration options
 */
export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Check if origin is allowed
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      console.log(`✅ CORS: Allowed origin: ${origin}`);
      callback(null, true);
    } else {
      console.error(`❌ CORS: Blocked origin: ${origin}`);
      console.error(`   Allowed origins:`, allowedOrigins);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // Allow cookies and authentication headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],
  maxAge: 600, // Cache preflight requests for 10 minutes
};
