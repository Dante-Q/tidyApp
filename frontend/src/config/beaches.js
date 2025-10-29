/**
 * Beach API configuration
 * Contains only the data needed for API calls (coordinates, timezone)
 * For UI content (descriptions, images, etc.), see src/data/beachInfo.js
 */

export const beaches = {
  muizenberg: {
    name: "Muizenberg",
    coordinates: { lat: -34.105, lon: 18.472 },
    timezone: "Africa/Johannesburg",
  },
  bloubergstrand: {
    name: "Bloubergstrand",
    coordinates: { lat: -33.808, lon: 18.464 },
    timezone: "Africa/Johannesburg",
  },
  strand: {
    name: "Strand",
    coordinates: { lat: -34.11, lon: 18.827 },
    timezone: "Africa/Johannesburg",
  },
  clifton: {
    name: "Clifton",
    coordinates: { lat: -33.951, lon: 18.377 },
    timezone: "Africa/Johannesburg",
  },
  kalkbay: {
    name: "Kalk Bay",
    coordinates: { lat: -34.127, lon: 18.449 },
    timezone: "Africa/Johannesburg",
  },
  milnerton: {
    name: "Milnerton",
    coordinates: { lat: -33.885, lon: 18.495 },
    timezone: "Africa/Johannesburg",
  },
};

/**
 * Get beach data by name (case-insensitive)
 * @param {string} beachName - Beach identifier
 * @returns {Object|null} Beach data or null if not found
 */
export function getBeach(beachName) {
  const key = beachName?.toLowerCase();
  return beaches[key] || null;
}

/**
 * Get all beach names
 * @returns {Array<string>} Array of beach identifiers
 */
export function getBeachNames() {
  return Object.keys(beaches);
}
