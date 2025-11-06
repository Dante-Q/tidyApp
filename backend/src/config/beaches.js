/**
 * Beach Configuration
 * Central source of truth for all beach data across the backend.
 * Keep this in sync with frontend beach configuration.
 *
 * IMPORTANT: Coordinates are set ~100-200m offshore in the water
 * for accurate tide and wave data from APIs (Stormglass, Open-Meteo).
 */

export const BEACHES = {
  muizenberg: {
    slug: "muizenberg",
    name: "Muizenberg",
    coordinates: {
      lat: -34.108979,
      lng: 18.473497,
    },
  },
  bloubergstrand: {
    slug: "bloubergstrand",
    name: "Bloubergstrand",
    coordinates: {
      lat: -33.818903,
      lng: 18.469919,
    },
  },
  strand: {
    slug: "strand",
    name: "Strand",
    coordinates: {
      lat: -34.128956,
      lng: 18.828002,
    },
  },
  clifton: {
    slug: "clifton",
    name: "Clifton",
    coordinates: {
      lat: -33.922131,
      lng: 18.374834,
    },
  },
  "kalk-bay": {
    slug: "kalk-bay",
    name: "Kalk Bay",
    coordinates: {
      lat: -34.126241,
      lng: 18.452563,
    },
  },
  milnerton: {
    slug: "milnerton",
    name: "Milnerton",
    coordinates: {
      lat: -33.859574,
      lng: 18.486802,
    },
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
