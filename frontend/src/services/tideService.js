/**
 * Tide Data Service
 * Fetches tide data from backend API (which serves static data from Stormglass)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Don't add /api prefix - it's already in VITE_API_URL

/**
 * Fetch tide data for all beaches
 * @returns {Promise<Object>} All beaches tide data
 */
export async function fetchAllTideData() {
  const response = await fetch(`${API_BASE_URL}/tides`);

  if (!response.ok) {
    throw new Error(`Failed to fetch tide data: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Fetch tide data for a specific beach
 * @param {string} beachName - Beach identifier (e.g., 'muizenberg')
 * @returns {Promise<Object>} Beach-specific tide data
 */
export async function fetchBeachTideData(beachName) {
  const response = await fetch(`${API_BASE_URL}/tides/${beachName}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Tide data not found for beach: ${beachName}`);
    }
    throw new Error(`Failed to fetch tide data: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Get next high and low tides from extremes array
 * @param {Array} extremes - Array of tide extremes from API
 * @returns {Object} Next high and low tide info
 */
export function getNextTides(extremes) {
  if (!extremes || extremes.length === 0) {
    return { nextHigh: null, nextLow: null };
  }

  const now = new Date();
  const futureTides = extremes.filter((tide) => new Date(tide.time) > now);

  const nextHigh = futureTides.find((tide) => tide.type === "high");
  const nextLow = futureTides.find((tide) => tide.type === "low");

  return { nextHigh, nextLow };
}

/**
 * Get current tide height (interpolated between extremes)
 * @param {Array} extremes - Array of tide extremes
 * @returns {number|null} Current tide height in meters
 */
export function getCurrentTideHeight(extremes) {
  if (!extremes || extremes.length < 2) return null;

  const now = new Date();

  // Find the two extremes surrounding current time
  let before = null;
  let after = null;

  for (let i = 0; i < extremes.length - 1; i++) {
    const current = new Date(extremes[i].time);
    const next = new Date(extremes[i + 1].time);

    if (current <= now && next >= now) {
      before = extremes[i];
      after = extremes[i + 1];
      break;
    }
  }

  if (!before || !after) return null;

  // Simple linear interpolation
  const beforeTime = new Date(before.time).getTime();
  const afterTime = new Date(after.time).getTime();
  const nowTime = now.getTime();

  const progress = (nowTime - beforeTime) / (afterTime - beforeTime);
  const currentHeight =
    before.height + (after.height - before.height) * progress;

  return Math.round(currentHeight * 100) / 100; // Round to 2 decimals
}

/**
 * Format time for display
 * @param {string} isoTime - ISO 8601 time string
 * @returns {string} Formatted time (e.g., "14:30")
 */
export function formatTideTime(isoTime) {
  const date = new Date(isoTime);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Johannesburg",
  });
}

/**
 * Format date for display
 * @param {string} isoTime - ISO 8601 time string
 * @returns {string} Formatted date (e.g., "Nov 3")
 */
export function formatTideDate(isoTime) {
  const date = new Date(isoTime);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "Africa/Johannesburg",
  });
}
