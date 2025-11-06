/**
 * Beach configuration for TidyApp
 * Central source of truth for all beach data
 */

export const BEACHES = {
  muizenberg: {
    slug: "muizenberg",
    name: "Muizenberg",
    coordinates: { lat: -34.1183, lng: 18.4717 },
  },
  bloubergstrand: {
    slug: "bloubergstrand",
    name: "Bloubergstrand",
    coordinates: { lat: -33.8116, lng: 18.4364 },
  },
  strand: {
    slug: "strand",
    name: "Strand",
    coordinates: { lat: -34.1236, lng: 18.8258 },
  },
  clifton: {
    slug: "clifton",
    name: "Clifton",
    coordinates: { lat: -33.9394, lng: 18.3772 },
  },
  "kalk-bay": {
    slug: "kalk-bay",
    name: "Kalk Bay",
    coordinates: { lat: -34.1281, lng: 18.4506 },
  },
  milnerton: {
    slug: "milnerton",
    name: "Milnerton",
    coordinates: { lat: -33.8615, lng: 18.4959 },
  },
};

/**
 * Get array of all beach slugs
 * @returns {string[]} Array of beach slugs
 */
export const getAllBeachSlugs = () => {
  return Object.keys(BEACHES);
};

/**
 * Get array of all beach names
 * @returns {string[]} Array of beach names
 */
export const getAllBeachNames = () => {
  return Object.values(BEACHES).map((beach) => beach.name);
};

/**
 * Get beach data by slug
 * @param {string} slug - Beach slug
 * @returns {Object|undefined} Beach data or undefined if not found
 */
export const getBeachBySlug = (slug) => {
  return BEACHES[slug];
};

/**
 * Validate if a slug is a valid beach
 * @param {string} slug - Beach slug to validate
 * @returns {boolean} True if valid beach slug
 */
export const isValidBeachSlug = (slug) => {
  return slug in BEACHES;
};
