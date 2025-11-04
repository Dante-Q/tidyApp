import sanitizeHtml from "sanitize-html";
import { Filter } from "bad-words";

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
 * Check if user can modify a comment (author or admin)
 * @param {Object} comment - The comment document
 * @param {Object} user - The authenticated user
 * @returns {Boolean} True if user can modify the comment
 */
export const canModify = (comment, user) => {
  return (
    comment.author.toString() === user._id.toString() || user.role === "admin"
  );
};

/**
 * Validate and sanitize comment content
 * @param {String} content - Raw content from request
 * @returns {Object} { valid: boolean, sanitized: string, error: string }
 */
export const validateCommentContent = (content) => {
  // Trim whitespace
  const trimmed = content?.trim();

  if (!trimmed) {
    return { valid: false, error: "Content cannot be empty" };
  }

  if (trimmed.length > 2000) {
    return {
      valid: false,
      error: "Content exceeds maximum length of 2000 characters",
    };
  }

  // Sanitize HTML - allow basic formatting for comments
  const sanitized = sanitizeHtml(trimmed, {
    allowedTags: ["b", "i", "em", "strong", "u", "p", "br", "code", "a"],
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
