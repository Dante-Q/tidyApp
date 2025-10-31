/**
 * Open-Meteo Marine API Service
 * Handles fetching marine/surf data from Open-Meteo API
 */

import { getBeach } from "../config/beachApiConfig.js";
import { EXTERNAL_APIS } from "../config/api.js";

// Get Marine API URL from config
const MARINE_API_URL = EXTERNAL_APIS.openMeteo.marine;

/**
 * Build API URL for a specific beach
 * @param {string} beachName - Beach identifier
 * @returns {string|null} API URL or null if beach not found
 */
function buildMarineApiUrl(beachName) {
  const beach = getBeach(beachName);
  if (!beach) return null;

  const { lat, lon } = beach.coordinates;

  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: [
      "wave_height",
      "wave_direction",
      "wave_period",
      "wind_wave_height",
      "wind_wave_direction",
      "wind_wave_period",
      "swell_wave_height",
      "swell_wave_direction",
      "swell_wave_period",
    ].join(","),
    current: ["wave_height", "wave_direction", "wave_period"].join(","),
    timezone: "Africa/Johannesburg",
  });

  return `${MARINE_API_URL}?${params.toString()}`;
}

/**
 * Fetch marine data for a specific beach
 * @param {string} beachName - Beach identifier
 * @param {Object} options - Fetch options
 * @param {AbortSignal} options.signal - Abort signal for request cancellation
 * @returns {Promise<Object>} Marine data from API
 * @throws {Error} If beach not found or API request fails
 */
export async function fetchMarineData(beachName, { signal } = {}) {
  const url = buildMarineApiUrl(beachName);

  if (!url) {
    throw new Error(`Unknown beach: ${beachName}`);
  }

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`);
  }

  const data = await response.json();

  // Validate API didn't return an error object
  if (data.error) {
    throw new Error(data.reason || "API returned an error");
  }

  return data;
}
