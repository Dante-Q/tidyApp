import {
  getCategoryIcon,
  getCategoryName,
  getSubcategoryName,
} from "../config/forumCategories.js";

/**
 * Format a date string into a relative time format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Get emoji/icon for a category or subcategory
 * @param {string} slug - Category or subcategory slug
 * @returns {string} Icon/emoji character
 */
export const getCategoryEmoji = (slug) => {
  return getCategoryIcon(slug);
};

/**
 * Get human-readable label for a category or subcategory
 * @param {string} slug - Category or subcategory slug
 * @returns {string} Display label
 */
export const getCategoryLabel = (slug) => {
  // First try as category
  const categoryName = getCategoryName(slug);
  if (categoryName !== slug) return categoryName;

  // Then try as subcategory
  const subcategoryName = getSubcategoryName(slug);
  return subcategoryName;
};

/**
 * Format a date string into a short relative time format (for comments)
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatCommentDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Process likes data - converts array to count and checks if user liked
 * @param {Array|number} likes - Likes array or count
 * @param {Object} user - Current user object
 * @param {boolean} isLiked - Whether user liked (if provided by backend)
 * @returns {Object} { count: number, liked: boolean }
 */
export const processLikesData = (likes, user, isLiked = undefined) => {
  if (Array.isArray(likes)) {
    const likesCount = likes.length;
    const userLiked = user && likes.some((userId) => userId === user.id);
    return { count: likesCount, liked: userLiked };
  }
  return { count: likes || 0, liked: isLiked || false };
};

/**
 * Pluralize a word based on count
 * @param {number} count - The count to check
 * @param {string} singular - Singular form of the word
 * @param {string} plural - Plural form of the word (optional, defaults to singular + 's')
 * @returns {string} The appropriate form of the word
 */
export const pluralize = (count, singular, plural = null) => {
  if (count === 1) return singular;
  return plural || `${singular}s`;
};

/**
 * Get user initials for avatar display
 * @param {string} name - User's name
 * @returns {string} First letter capitalized
 */
export const getUserInitial = (name) => {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
};

/**
 * Get subcategory label with icon
 * @param {string} categorySlug - Category slug
 * @param {string} subcategorySlug - Subcategory slug
 * @returns {string} Subcategory display label with icon
 */
export const getSubcategoryLabel = (categorySlug, subcategorySlug) => {
  if (!subcategorySlug) return "";
  const icon = getCategoryIcon(subcategorySlug);
  const name = getSubcategoryName(subcategorySlug);
  return `${icon} ${name}`;
};
