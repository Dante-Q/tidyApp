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
    slug: "general",
    name: "General",
    icon: "💬",
    description: "General discussions, tips, and community topics",
    subcategories: [
      {
        slug: "info-tips",
        name: "Info & Tips",
        icon: "💡",
        description: "General information and helpful tips",
      },
      {
        slug: "community-news",
        name: "Community News",
        icon: "📰",
        description: "News and updates from the community",
      },
      {
        slug: "gear-equipment",
        name: "Gear & Equipment",
        icon: "🎒",
        description: "Discuss gear, equipment, and product recommendations",
      },
      {
        slug: "surfing",
        name: "Surfing",
        icon: "🏄",
        description: "Surf talk, techniques, and surf culture",
      },
      {
        slug: "kiteboarding",
        name: "Kiteboarding",
        icon: "🪁",
        description: "Kiteboarding discussions and tips",
      },
      {
        slug: "diving-snorkeling",
        name: "Diving & Snorkeling",
        icon: "🤿",
        description: "Underwater adventures and diving spots",
      },
      {
        slug: "yoga-wellness",
        name: "Yoga & Wellness",
        icon: "🧘",
        description: "Yoga, meditation, and wellness activities",
      },
      {
        slug: "sailing-boating",
        name: "Sailing & Boating",
        icon: "⛵",
        description: "Sailing, boating, and marine navigation",
      },
    ],
  },
  {
    slug: "beaches",
    name: "Beaches",
    icon: "🏖️",
    description: "Discussions about specific beaches and hidden spots",
    subcategories: [
      {
        slug: "muizenberg",
        name: "Muizenberg",
        icon: "🏄",
        description: "The surf capital with colorful beach huts",
      },
      {
        slug: "bloubergstrand",
        name: "Bloubergstrand",
        icon: "🪁",
        description: "Epic Table Mountain views and kiteboarding",
      },
      {
        slug: "strand",
        name: "Strand",
        icon: "🏖️",
        description: "Family-friendly beach with calm waters",
      },
      {
        slug: "clifton",
        name: "Clifton",
        icon: "🌅",
        description: "Pristine beaches sheltered from the wind",
      },
      {
        slug: "kalk-bay",
        name: "Kalk Bay",
        icon: "🎣",
        description: "Charming harbor with tidal pool",
      },
      {
        slug: "milnerton",
        name: "Milnerton",
        icon: "🌊",
        description: "Lagoon beach perfect for water sports",
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
    description: "Safety information, alerts, and awareness",
    subcategories: [
      {
        slug: "general-safety",
        name: "General Safety",
        icon: "⚠️",
        description: "General safety tips and precautions",
      },
      {
        slug: "local-alerts",
        name: "Local Alerts",
        icon: "🚨",
        description: "Current warnings and safety alerts",
      },
      {
        slug: "boating-safety",
        name: "Boating Safety",
        icon: "⛵",
        description: "Safe boating practices and marine safety",
      },
      {
        slug: "parking-access",
        name: "Parking & Access",
        icon: "🅿️",
        description: "Parking info and beach access details",
      },
      {
        slug: "emergencies",
        name: "Emergencies",
        icon: "🆘",
        description: "Emergency contacts and urgent situations",
      },
    ],
  },
  {
    slug: "food-hangouts",
    name: "Food & Hangouts",
    icon: "🍔",
    description: "Best places to eat and hang out near the beach",
    subcategories: [
      {
        slug: "cafes-takeaways",
        name: "Cafés & Takeaways",
        icon: "☕",
        description: "Coffee shops and quick bites",
      },
      {
        slug: "bars-sundowners",
        name: "Bars & Sundowners",
        icon: "🍹",
        description: "Best spots for drinks and sunset views",
      },
      {
        slug: "chill-spots",
        name: "Chill Spots",
        icon: "🛋️",
        description: "Relaxing hangout spots near the beach",
      },
    ],
  },
  {
    slug: "wildlife",
    name: "Wildlife",
    icon: "🐋",
    description: "Marine life, coastal animals, and conservation",
    subcategories: [
      {
        slug: "marine-life",
        name: "Marine Life",
        icon: "🐠",
        description: "Dolphins, whales, seals, and ocean creatures",
      },
      {
        slug: "birds-coastal-animals",
        name: "Birds & Coastal Animals",
        icon: "🦅",
        description: "Seabirds, penguins, and shore wildlife",
      },
      {
        slug: "conservation",
        name: "Conservation",
        icon: "🌿",
        description: "Marine conservation and environmental protection",
      },
      {
        slug: "sightings-encounters",
        name: "Sightings & Encounters",
        icon: "👀",
        description: "Share your wildlife encounters and sightings",
      },
    ],
  },
  {
    slug: "events",
    name: "Events",
    icon: "📅",
    description: "Beach events, competitions, and community activities",
    subcategories: [
      {
        slug: "competitions",
        name: "Competitions",
        icon: "🏆",
        description: "Surf contests and beach sports competitions",
      },
      {
        slug: "festivals-events",
        name: "Festivals & Events",
        icon: "🎉",
        description: "Beach festivals and special events",
      },
      {
        slug: "workshops-lessons",
        name: "Workshops & Lessons",
        icon: "📚",
        description: "Learn new skills and attend workshops",
      },
      {
        slug: "yoga-events",
        name: "Yoga Events",
        icon: "🧘",
        description: "Beach yoga sessions and wellness events",
      },
      {
        slug: "cleanups-meetups",
        name: "Cleanups & Meetups",
        icon: "🧹",
        description: "Beach cleanups and community meetups",
      },
    ],
  },
  {
    slug: "marketplace",
    name: "Marketplace",
    icon: "🛒",
    description: "Buy, sell, swap gear and services",
    subcategories: [
      {
        slug: "buy-sell-swap",
        name: "Buy/Sell/Swap",
        icon: "💰",
        description: "Trade gear and equipment",
      },
      {
        slug: "rentals-lessons",
        name: "Rentals & Lessons",
        icon: "📖",
        description: "Rent equipment or book lessons",
      },
      {
        slug: "services-repairs",
        name: "Services & Repairs",
        icon: "🔧",
        description: "Equipment repairs and services",
      },
      {
        slug: "sailing-boat-supplies",
        name: "Sailing & Boat Supplies",
        icon: "⛵",
        description: "Boat gear and marine supplies",
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
