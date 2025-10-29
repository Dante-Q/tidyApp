/**
 * Transform Open-Meteo API data to component-friendly format
 */

/**
 * Calculate surf rating based on wave height and period
 * Good waves = height + decent period
 */
export function calculateSurfRating(height, period) {
  // Better waves have more height AND longer period
  const score = height * (period / 10); // Normalize period contribution

  if (score >= 3.5) return "excellent";
  if (score >= 2.5) return "good";
  if (score >= 1.5) return "fair";
  return "poor";
}

/**
 * Transform API hourly data to WaveHeightGraph format
 * @param {Object} apiData - Response from Open-Meteo marine API
 * @param {number} hoursToShow - Number of hours to display (default 24)
 * @param {boolean} startFromNow - Start from current hour instead of first hour (default true)
 * @returns {Array} Formatted wave data for graph
 */
export function transformWaveData(
  apiData,
  hoursToShow = 24,
  startFromNow = true
) {
  if (!apiData?.hourly) return [];

  const { time, wave_height, wave_period } = apiData.hourly;

  if (!time || !wave_height || !wave_period) return [];

  let startIndex = 0;

  // If starting from now, find the current hour index
  if (startFromNow) {
    const now = new Date();
    startIndex = time.findIndex((timestamp) => {
      const dataTime = new Date(timestamp);
      return dataTime >= now;
    });

    // If no future time found, start from beginning
    if (startIndex === -1) startIndex = 0;
  }

  // Take requested number of hours starting from the index
  const hours = time.slice(startIndex, startIndex + hoursToShow);

  return hours.map((timestamp, i) => {
    const actualIndex = startIndex + i;
    // API returns times in the specified timezone (Africa/Johannesburg)
    // Parse as-is without timezone conversion
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Africa/Johannesburg", // Match API timezone
    });

    const height = wave_height[actualIndex] || 0;
    const period = wave_period[actualIndex] || 0;
    const rating = calculateSurfRating(height, period);

    return {
      time: timeStr,
      height: parseFloat(height.toFixed(1)),
      period: Math.round(period),
      rating,
      timestamp, // Keep original for comparison
    };
  });
}

/**
 * Find peak wave in dataset
 * @param {Array} waveData - Transformed wave data
 * @returns {Object} Peak wave info
 */
export function findPeakWave(waveData) {
  if (!waveData || waveData.length === 0) {
    return { height: 0, time: "--:--" };
  }

  const peak = waveData.reduce((max, current) =>
    current.height > max.height ? current : max
  );

  return {
    height: peak.height,
    time: peak.time,
  };
}

/**
 * Get current wave conditions from API
 * @param {Object} apiData - Response from Open-Meteo marine API
 * @returns {Object} Current wave conditions
 */
export function getCurrentConditions(apiData) {
  const current = apiData?.current;

  if (!current) {
    // Fallback to first hourly data point
    const hourly = apiData?.hourly;
    if (hourly?.wave_height?.[0] && hourly?.wave_period?.[0]) {
      return {
        height: parseFloat(hourly.wave_height[0].toFixed(1)),
        period: Math.round(hourly.wave_period[0]),
        direction: hourly.wave_direction?.[0]
          ? Math.round(hourly.wave_direction[0])
          : undefined,
        rating: calculateSurfRating(
          hourly.wave_height[0],
          hourly.wave_period[0]
        ),
      };
    }
    return { height: 0, period: 0, rating: "poor" };
  }

  const height = current.wave_height || 0;
  const period = current.wave_period || 0;
  const direction = current.wave_direction;

  return {
    height: parseFloat(height.toFixed(1)),
    period: Math.round(period),
    direction: direction !== undefined ? Math.round(direction) : undefined,
    rating: calculateSurfRating(height, period),
  };
}
