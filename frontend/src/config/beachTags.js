/**
 * Beach Tags Configuration
 *
 * These tags can be added to posts to associate them with specific beaches.
 * Used for filtering and organizing beach-specific content.
 */

export const BEACH_TAGS = [
  {
    slug: "muizenberg",
    name: "Muizenberg",
    icon: "🏄",
    color: "#5fb8d6",
  },
  {
    slug: "bloubergstrand",
    name: "Bloubergstrand",
    icon: "🪁",
    color: "#5fb8d6",
  },
  {
    slug: "strand",
    name: "Strand",
    icon: "🏖️",
    color: "#5fb8d6",
  },
  {
    slug: "clifton",
    name: "Clifton",
    icon: "🌅",
    color: "#5fb8d6",
  },
  {
    slug: "kalk-bay",
    name: "Kalk Bay",
    icon: "🎣",
    color: "#5fb8d6",
  },
  {
    slug: "milnerton",
    name: "Milnerton",
    icon: "🌊",
    color: "#5fb8d6",
  },
];

/**
 * Get all beach tag slugs
 */
export const getAllBeachTagSlugs = () => {
  return BEACH_TAGS.map((tag) => tag.slug);
};

/**
 * Get beach tag by slug
 */
export const getBeachTagBySlug = (slug) => {
  return BEACH_TAGS.find((tag) => tag.slug === slug);
};

/**
 * Get beach tag name
 */
export const getBeachTagName = (slug) => {
  const tag = getBeachTagBySlug(slug);
  return tag?.name || slug;
};

/**
 * Get beach tag icon
 */
export const getBeachTagIcon = (slug) => {
  const tag = getBeachTagBySlug(slug);
  return tag?.icon || "🏖️";
};

/**
 * Get beach tag color
 */
export const getBeachTagColor = (slug) => {
  const tag = getBeachTagBySlug(slug);
  return tag?.color || "#6dd5ed";
};

export default BEACH_TAGS;
