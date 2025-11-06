import sanitizeHtml from "sanitize-html";
import { Filter } from "bad-words";
import { getRefId } from "./refHelpers.js";

// Initialize profanity filter
const filter = new Filter();

/**
 * Helper function to handle controller errors consistently
 * @param {Object} res - Express response object
 * @param {String} message - User-friendly error message
 * @param {Error} error - The error object
 */
export const handleControllerError = (res, message, error) => {
  console.error(message, error);
  return res
    .status(500)
    .json({ success: false, message, error: error.message });
};

/**
 * Check if user can modify a post (author or admin)
 * @param {Object} post - The post document
 * @param {Object} user - The authenticated user
 * @returns {Boolean} True if user can modify the post
 */
export const canModifyPost = (post, user) => {
  const postAuthorId = getRefId(post.author);
  const userId = getRefId(user._id);

  return postAuthorId === userId || user.role === "admin";
};

/**
 * Helper to assign only defined fields from source to target
 * @param {Object} target - Object to update
 * @param {Object} source - Object with new values
 * @param {Array<String>} fields - List of allowed field names
 */
export const assignFields = (target, source, fields) => {
  fields.forEach((f) => {
    if (source[f] !== undefined) target[f] = source[f];
  });
};

/**
 * Validate and sanitize post title
 * @param {String} title - Raw title from request
 * @returns {Object} { valid: boolean, sanitized: string, error: string }
 */
export const validatePostTitle = (title) => {
  const trimmed = title?.trim();

  if (!trimmed) {
    return { valid: false, error: "Title cannot be empty" };
  }

  if (trimmed.length < 5) {
    return { valid: false, error: "Title must be at least 5 characters long" };
  }

  if (trimmed.length > 200) {
    return {
      valid: false,
      error: "Title exceeds maximum length of 200 characters",
    };
  }

  // Sanitize HTML and filter profanity
  const sanitized = sanitizeHtml(trimmed, {
    allowedTags: [], // No HTML tags allowed in titles
    allowedAttributes: {},
  });

  const filtered = filter.clean(sanitized);

  return { valid: true, sanitized: filtered };
};

/**
 * Validate and sanitize post content
 * @param {String} content - Raw content from request
 * @returns {Object} { valid: boolean, sanitized: string, error: string }
 */
export const validatePostContent = (content) => {
  const trimmed = content?.trim();

  if (!trimmed) {
    return { valid: false, error: "Content cannot be empty" };
  }

  if (trimmed.length < 10) {
    return {
      valid: false,
      error: "Content must be at least 10 characters long",
    };
  }

  if (trimmed.length > 10000) {
    return {
      valid: false,
      error: "Content exceeds maximum length of 10000 characters",
    };
  }

  // Sanitize HTML - allow safe formatting tags
  const sanitized = sanitizeHtml(trimmed, {
    allowedTags: [
      "b",
      "i",
      "em",
      "strong",
      "u",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "a",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    // Enforce noopener noreferrer on links
    transformTags: {
      a: (tagName, attribs) => {
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            target: "_blank",
            rel: "noopener noreferrer",
          },
        };
      },
    },
  });

  // Filter profanity
  const filtered = filter.clean(sanitized);

  return { valid: true, sanitized: filtered };
};
