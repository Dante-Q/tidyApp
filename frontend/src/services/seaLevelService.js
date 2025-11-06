/**
 * Sea Level Data Service
 * Handles fetching and processing hourly sea level (tide height) data
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

/**
 * Fetch sea level data for all beaches
 * @returns {Promise<Object>} Sea level data for all beaches
 */
export async function fetchAllSeaLevelData() {
  const response = await fetch(`${API_BASE_URL}/api/sea-level`);

  if (!response.ok) {
    throw new Error(`Failed to fetch sea level data: ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetch sea level data for a specific beach
 * @param {string} beachName - Name of the beach
 * @returns {Promise<Object>} Sea level data for the beach
 */
export async function fetchBeachSeaLevelData(beachName) {
  const response = await fetch(`${API_BASE_URL}/api/sea-level/${beachName}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch sea level data: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get current sea level height from hourly data
 * Finds the closest hour to current time
 * @param {Array} seaLevel - Array of hourly sea level readings
 * @returns {number|null} Current height in meters, or null if no data
 */
export function getCurrentSeaLevel(seaLevel) {
  if (!seaLevel || seaLevel.length === 0) {
    return null;
  }

  const now = new Date();

  // Find the reading closest to current time
  let closestReading = seaLevel[0];
  let smallestDiff = Math.abs(new Date(seaLevel[0].time) - now);

  for (const reading of seaLevel) {
    const readingTime = new Date(reading.time);
    const diff = Math.abs(readingTime - now);

    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestReading = reading;
    }

    // If we've passed current time, use this reading
    if (readingTime > now) {
      break;
    }
  }

  return closestReading.height;
}

/**
 * Get sea level readings for the next N hours
 * @param {Array} seaLevel - Array of hourly sea level readings
 * @param {number} hours - Number of hours to return (default 24)
 * @returns {Array} Filtered array of future readings
 */
export function getNextHoursSeaLevel(seaLevel, hours = 24) {
  if (!seaLevel || seaLevel.length === 0) {
    return [];
  }

  const now = new Date();

  return seaLevel
    .filter((reading) => new Date(reading.time) >= now)
    .slice(0, hours);
}

/**
 * Calculate tide rate of change (rising/falling speed)
 * @param {Array} seaLevel - Array of hourly sea level readings
 * @returns {Object|null} { rate: number (m/hour), direction: 'rising'|'falling'|'slack' }
 */
export function getTideRate(seaLevel) {
  if (!seaLevel || seaLevel.length < 2) {
    return null;
  }

  const now = new Date();

  // Find current and next hour readings
  let currentReading = null;
  let nextReading = null;

  for (let i = 0; i < seaLevel.length - 1; i++) {
    const readingTime = new Date(seaLevel[i].time);
    const nextTime = new Date(seaLevel[i + 1].time);

    if (readingTime <= now && nextTime > now) {
      currentReading = seaLevel[i];
      nextReading = seaLevel[i + 1];
      break;
    }
  }

  if (!currentReading || !nextReading) {
    return null;
  }

  const rate = nextReading.height - currentReading.height;

  let direction = "slack";
  if (Math.abs(rate) > 0.05) {
    // 5cm threshold for "slack"
    direction = rate > 0 ? "rising" : "falling";
  }

  return {
    rate: Math.abs(rate),
    direction,
    currentHeight: currentReading.height,
    nextHeight: nextReading.height,
  };
}

/**
 * Format sea level height for display
 * @param {number} height - Height in meters
 * @returns {string} Formatted height string (e.g., "1.23m")
 */
export function formatSeaLevelHeight(height) {
  if (height === null || height === undefined) {
    return "N/A";
  }
  return `${height.toFixed(2)}m`;
}

/**
 * Get sea level at a specific time
 * @param {Array} seaLevel - Array of hourly sea level readings
 * @param {Date|string} targetTime - Time to look up
 * @returns {number|null} Height at that time, or null if not found
 */
export function getSeaLevelAtTime(seaLevel, targetTime) {
  if (!seaLevel || seaLevel.length === 0) {
    return null;
  }

  const target = new Date(targetTime);

  // Find exact match or closest reading
  const exactMatch = seaLevel.find((reading) => {
    const readingTime = new Date(reading.time);
    return readingTime.getTime() === target.getTime();
  });

  if (exactMatch) {
    return exactMatch.height;
  }

  // Find closest reading
  let closestReading = seaLevel[0];
  let smallestDiff = Math.abs(new Date(seaLevel[0].time) - target);

  for (const reading of seaLevel) {
    const readingTime = new Date(reading.time);
    const diff = Math.abs(readingTime - target);

    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestReading = reading;
    }
  }

  return closestReading.height;
}
