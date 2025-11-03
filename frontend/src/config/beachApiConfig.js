/**
 * Beach API configuration
 * Contains only the data needed for API calls (coordinates, timezone)
 * For UI content (descriptions, images, etc.), see src/data/beachInfo.js
 *
 * IMPORTANT: Coordinates are set ~100-200m offshore in the water
 * for accurate tide and wave data from Stormglass and Open-Meteo APIs.
 * Map markers will still display at the beach location.
 */

export const beaches = {
  muizenberg: {
    name: "Muizenberg",
    coordinates: {
      lat: -34.108979,
      lon: 18.473497,
    },
    beachLocation: { lat: -34.105, lon: 18.472 }, // Visual marker on beach
    timezone: "Africa/Johannesburg",
  },
  bloubergstrand: {
    name: "Bloubergstrand",
    coordinates: {
      lat: -33.818903,
      lon: 18.469919,
    },
    beachLocation: { lat: -33.808, lon: 18.464 },
    timezone: "Africa/Johannesburg",
  },
  strand: {
    name: "Strand",
    coordinates: {
      lat: -34.128956,
      lon: 18.828002,
    },
    beachLocation: { lat: -34.11, lon: 18.827 },
    timezone: "Africa/Johannesburg",
  },
  clifton: {
    name: "Clifton",
    coordinates: {
      lat: -33.922131,
      lon: 18.374834,
    },
    beachLocation: { lat: -33.951, lon: 18.377 },
    timezone: "Africa/Johannesburg",
  },
  kalkbay: {
    name: "Kalk Bay",
    coordinates: {
      lat: -34.126241,
      lon: 18.452563,
    },
    beachLocation: { lat: -34.127, lon: 18.449 },
    timezone: "Africa/Johannesburg",
  },
  milnerton: {
    name: "Milnerton",
    coordinates: {
      lat: -33.859574,
      lon: 18.486802,
    },
    beachLocation: { lat: -33.885, lon: 18.495 },
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
