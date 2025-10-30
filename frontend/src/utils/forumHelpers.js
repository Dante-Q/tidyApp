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
 * Get emoji for a forum category
 * @param {string} category - Category slug
 * @returns {string} Emoji character
 */
export const getCategoryEmoji = (category) => {
  const emojis = {
    "surf-reports": "🌊",
    "beach-safety": "🏖️",
    "general-discussion": "🌅",
    "events-meetups": "📅",
  };
  return emojis[category] || "📝";
};

/**
 * Get human-readable label for a forum category
 * @param {string} category - Category slug
 * @returns {string} Category label
 */
export const getCategoryLabel = (category) => {
  const labels = {
    "surf-reports": "Surf Reports",
    "beach-safety": "Beach Safety",
    "general-discussion": "General Discussion",
    "events-meetups": "Events & Meetups",
  };
  return labels[category] || category;
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
