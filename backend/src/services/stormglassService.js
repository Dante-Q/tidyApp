/**
 * Stormglass API Service
 * Fetches tide data from Stormglass.io API
 *
 * API Limits: 10 requests/day on free tier
 * Strategy: Fetch 2-3 times per day and cache results
 */

const STORMGLASS_BASE_URL = "https://api.stormglass.io/v2";

/**
 * Fetch tide data for a specific location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} start - Start time (ISO 8601 format)
 * @param {string} end - End time (ISO 8601 format)
 * @returns {Promise<Object>} Tide data from Stormglass API
 */
async function fetchTideData(lat, lng, start, end) {
  const STORMGLASS_API_KEY = process.env.STORMGLASS_API_KEY;

  if (!STORMGLASS_API_KEY) {
    throw new Error("STORMGLASS_API_KEY is not configured");
  }

  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    start: start,
    end: end,
  });

  const url = `${STORMGLASS_BASE_URL}/tide/extremes/point?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: STORMGLASS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Check for quota exceeded (402 Payment Required or 429 Too Many Requests)
      if (response.status === 402 || response.status === 429) {
        throw new Error(
          `API quota exceeded (${response.status}). Daily limit: 10 requests. Try again tomorrow.`
        );
      }

      // Check for authentication errors
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          `Authentication failed (${response.status}). Check STORMGLASS_API_KEY in .env`
        );
      }

      throw new Error(
        `Stormglass API error (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tide data:", error);
    throw error;
  }
}

/**
 * Fetch sea level (tide heights) for a specific location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} start - Start time (ISO 8601 format)
 * @param {string} end - End time (ISO 8601 format)
 * @returns {Promise<Object>} Sea level data from Stormglass API
 */
async function fetchSeaLevelData(lat, lng, start, end) {
  const STORMGLASS_API_KEY = process.env.STORMGLASS_API_KEY;

  if (!STORMGLASS_API_KEY) {
    throw new Error("STORMGLASS_API_KEY is not configured");
  }

  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    start: start,
    end: end,
    params: "waterLevel", // Sea level parameter
  });

  const url = `${STORMGLASS_BASE_URL}/tide/sea-level/point?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: STORMGLASS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Check for quota exceeded (402 Payment Required or 429 Too Many Requests)
      if (response.status === 402 || response.status === 429) {
        throw new Error(
          `API quota exceeded (${response.status}). Daily limit: 10 requests. Try again tomorrow.`
        );
      }

      // Check for authentication errors
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          `Authentication failed (${response.status}). Check STORMGLASS_API_KEY in .env`
        );
      }

      throw new Error(
        `Stormglass API error (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sea level data:", error);
    throw error;
  }
}

export { fetchTideData, fetchSeaLevelData };
