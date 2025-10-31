/**
 * Forum Categories Configuration
 *
 * This is the central config for all forum categories and subcategories.
 * Add new categories/subcategories here and they'll automatically appear
 * in the forum UI, dropdowns, and navigation.
 *
 * Structure:
 * - slug: unique identifier (used in URLs and database)
 * - name: display name
 * - icon: emoji or icon
 * - description: brief description
 * - subcategories: array of subcategories (optional)
 */

export const FORUM_CATEGORIES = [
  {
    slug: "beaches",
    name: "Beaches",
    icon: "🏖️",
    description: "Share your favorite beach spots and coastal experiences",
    subcategories: [
      {
        slug: "surf-reports",
        name: "Surf Reports",
        icon: "🌊",
        description: "Current surf conditions and wave reports",
      },
      {
        slug: "beach-conditions",
        name: "Beach Conditions",
        icon: "🌅",
        description: "Water quality, weather, and beach status updates",
      },
      {
        slug: "beach-reviews",
        name: "Beach Reviews",
        icon: "⭐",
        description: "Share your beach experiences and recommendations",
      },
      {
        slug: "hidden-gems",
        name: "Hidden Gems",
        icon: "💎",
        description: "Discover lesser-known beach spots",
      },
    ],
  },
  {
    slug: "safety",
    name: "Safety & Awareness",
    icon: "⚠️",
    description: "Beach safety tips and important alerts",
    subcategories: [
      {
        slug: "safety-tips",
        name: "Safety Tips",
        icon: "⚠️",
        description: "Water safety and beach hazard awareness",
      },
      {
        slug: "wildlife",
        name: "Wildlife & Marine Life",
        icon: "🐋",
        description: "Encounters and information about marine wildlife",
      },
      {
        slug: "weather-alerts",
        name: "Weather Alerts",
        icon: "⛈️",
        description: "Storm warnings and weather updates",
      },
    ],
  },
  {
    slug: "events",
    name: "Events & Meetups",
    icon: "📅",
    description: "Community events and beach gatherings",
    subcategories: [
      {
        slug: "beach-cleanups",
        name: "Beach Cleanups",
        icon: "🧹",
        description: "Organize and join beach cleanup events",
      },
      {
        slug: "surf-sessions",
        name: "Surf Sessions",
        icon: "🏄",
        description: "Group surf meetups and sessions",
      },
      {
        slug: "social-events",
        name: "Social Events",
        icon: "🎉",
        description: "Beach parties, bonfires, and social gatherings",
      },
      {
        slug: "competitions",
        name: "Competitions",
        icon: "🏆",
        description: "Surf competitions and beach sports events",
      },
    ],
  },
  {
    slug: "general",
    name: "General Discussion",
    icon: "💬",
    description: "General beach and ocean-related discussions",
    subcategories: [
      {
        slug: "introductions",
        name: "Introductions",
        icon: "👋",
        description: "Introduce yourself to the community",
      },
      {
        slug: "questions",
        name: "Questions & Advice",
        icon: "❓",
        description: "Ask questions and get advice from the community",
      },
      {
        slug: "gear-equipment",
        name: "Gear & Equipment",
        icon: "🏄‍♂️",
        description: "Discuss surf gear, beach equipment, and recommendations",
      },
      {
        slug: "photography",
        name: "Photography",
        icon: "📸",
        description: "Share beach and ocean photography",
      },
      {
        slug: "off-topic",
        name: "Off Topic",
        icon: "🗨️",
        description: "Casual conversations and off-topic discussions",
      },
    ],
  },
];

/**
 * Get all category slugs (for validation)
 */
export const getAllCategorySlugs = () => {
  return FORUM_CATEGORIES.map((cat) => cat.slug);
};

/**
 * Get all subcategory slugs for a category
 */
export const getSubcategorySlugs = (categorySlug) => {
  const category = FORUM_CATEGORIES.find((cat) => cat.slug === categorySlug);
  return category?.subcategories?.map((sub) => sub.slug) || [];
};

/**
 * Get all valid subcategory slugs across all categories
 */
export const getAllSubcategorySlugs = () => {
  return FORUM_CATEGORIES.flatMap(
    (cat) => cat.subcategories?.map((sub) => sub.slug) || []
  );
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = (slug) => {
  return FORUM_CATEGORIES.find((cat) => cat.slug === slug);
};

/**
 * Get subcategory by slug (searches all categories)
 */
export const getSubcategoryBySlug = (subcategorySlug) => {
  for (const category of FORUM_CATEGORIES) {
    const subcategory = category.subcategories?.find(
      (sub) => sub.slug === subcategorySlug
    );
    if (subcategory) {
      return { category, subcategory };
    }
  }
  return null;
};

/**
 * Get display name for category
 */
export const getCategoryName = (slug) => {
  const category = getCategoryBySlug(slug);
  return category?.name || slug;
};

/**
 * Get display name for subcategory
 */
export const getSubcategoryName = (slug) => {
  const result = getSubcategoryBySlug(slug);
  return result?.subcategory?.name || slug;
};

/**
 * Get icon for category or subcategory
 */
export const getCategoryIcon = (slug) => {
  // First check if it's a category
  const category = getCategoryBySlug(slug);
  if (category) return category.icon;

  // Then check if it's a subcategory
  const result = getSubcategoryBySlug(slug);
  return result?.subcategory?.icon || "📝";
};

export default FORUM_CATEGORIES;
