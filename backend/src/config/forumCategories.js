/**
 * Forum Categories Configuration (Backend)
 *
 * Mirror of frontend config for validation.
 * Keep this in sync with frontend/src/config/forumCategories.js
 */

export const FORUM_CATEGORIES = [
  {
    slug: "beaches",
    name: "Beaches",
    subcategories: [
      "surf-reports",
      "beach-conditions",
      "beach-reviews",
      "hidden-gems",
    ],
  },
  {
    slug: "safety",
    name: "Safety & Awareness",
    subcategories: ["safety-tips", "wildlife", "weather-alerts"],
  },
  {
    slug: "events",
    name: "Events & Meetups",
    subcategories: [
      "beach-cleanups",
      "surf-sessions",
      "social-events",
      "competitions",
    ],
  },
  {
    slug: "general",
    name: "General Discussion",
    subcategories: [
      "introductions",
      "questions",
      "gear-equipment",
      "photography",
      "off-topic",
    ],
  },
];

/**
 * Get all valid category slugs
 */
export const getAllCategorySlugs = () => {
  return FORUM_CATEGORIES.map((cat) => cat.slug);
};

/**
 * Get all valid subcategory slugs for a category
 */
export const getSubcategorySlugs = (categorySlug) => {
  const category = FORUM_CATEGORIES.find((cat) => cat.slug === categorySlug);
  return category?.subcategories || [];
};

/**
 * Get all valid subcategory slugs across all categories
 */
export const getAllSubcategorySlugs = () => {
  return FORUM_CATEGORIES.flatMap((cat) => cat.subcategories || []);
};

/**
 * Validate category and subcategory combination
 */
export const isValidCategorySubcategory = (category, subcategory) => {
  const cat = FORUM_CATEGORIES.find((c) => c.slug === category);
  if (!cat) return false;
  if (!subcategory) return true; // Category is valid, subcategory is optional
  return cat.subcategories.includes(subcategory);
};

export default FORUM_CATEGORIES;
