/**
 * Forum Categories Configuration (Backend)
 *
 * Mirror of frontend config for validation.
 * Keep this in sync with frontend/src/config/forumCategories.js
 */

export const FORUM_CATEGORIES = [
  {
    slug: "general",
    name: "General",
    subcategories: [
      "info-tips",
      "community-news",
      "gear-equipment",
      "surfing",
      "kiteboarding",
      "diving-snorkeling",
      "yoga-wellness",
      "sailing-boating",
    ],
  },
  {
    slug: "beaches",
    name: "Beaches",
    subcategories: [
      "muizenberg",
      "bloubergstrand",
      "strand",
      "clifton",
      "kalk-bay",
      "milnerton",
      "hidden-gems",
    ],
  },
  {
    slug: "food-hangouts",
    name: "Food & Hangouts",
    subcategories: ["cafes-takeaways", "bars-sundowners", "chill-spots"],
  },
  {
    slug: "safety",
    name: "Safety & Awareness",
    subcategories: [
      "general-safety",
      "local-alerts",
      "boating-safety",
      "parking-access",
      "emergencies",
    ],
  },
  {
    slug: "wildlife",
    name: "Wildlife",
    subcategories: [
      "marine-life",
      "birds-coastal-animals",
      "conservation",
      "sightings-encounters",
    ],
  },
  {
    slug: "events",
    name: "Events",
    subcategories: [
      "competitions",
      "festivals-events",
      "workshops-lessons",
      "yoga-events",
      "cleanups-meetups",
    ],
  },
  {
    slug: "marketplace",
    name: "Marketplace",
    subcategories: [
      "buy-sell-swap",
      "rentals-lessons",
      "services-repairs",
      "sailing-boat-supplies",
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
