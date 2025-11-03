/**
 * Fetch Tide Data Script
 *
 * This script fetches tide data from Stormglass API for all beaches
 * and saves it to a JSON file for frontend consumption.
 *
 * Usage: node src/scripts/fetchTideData.js
 *
 * Recommended Schedule:
 * - Run 2-3 times per day (e.g., 6am, 2pm, 10pm)
 * - Each run fetches 7 days of tide predictions
 * - Can be automated with cron job or task scheduler
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const {
  fetchTideData,
  fetchSeaLevelData,
} = require("../services/stormglassService");

// Beach locations (same as frontend config)
const BEACHES = {
  muizenberg: {
    name: "Muizenberg",
    coordinates: { lat: -34.1183, lng: 18.4717 },
  },
  bloubergstrand: {
    name: "Bloubergstrand",
    coordinates: { lat: -33.8116, lng: 18.4364 },
  },
  strand: {
    name: "Strand",
    coordinates: { lat: -34.1236, lng: 18.8258 },
  },
  clifton: {
    name: "Clifton",
    coordinates: { lat: -33.9394, lng: 18.3772 },
  },
  kalkbay: {
    name: "Kalk Bay",
    coordinates: { lat: -34.1281, lng: 18.4506 },
  },
  milnerton: {
    name: "Milnerton",
    coordinates: { lat: -33.8615, lng: 18.4959 },
  },
};

// Output directory
const DATA_DIR = path.join(__dirname, "../../data");
const TIDE_DATA_FILE = path.join(DATA_DIR, "tideData.json");

/**
 * Get time range for API request
 * @param {number} days - Number of days to fetch (default 7)
 * @returns {Object} Start and end times in ISO format
 */
function getTimeRange(days = 7) {
  const now = new Date();
  const start = now.toISOString();

  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + days);
  const end = endDate.toISOString();

  return { start, end };
}

/**
 * Fetch tide data for a single beach
 * @param {string} beachKey - Beach identifier
 * @param {Object} beach - Beach configuration
 * @returns {Promise<Object>} Tide data for the beach
 */
async function fetchBeachTideData(beachKey, beach) {
  const { start, end } = getTimeRange(7); // 7 days of predictions
  const { lat, lng } = beach.coordinates;

  console.log(`Fetching tide data for ${beach.name}...`);

  try {
    // Fetch tide extremes (high/low tides)
    const extremes = await fetchTideData(lat, lng, start, end);

    console.log(
      `✓ Fetched ${extremes.data?.length || 0} tide extremes for ${beach.name}`
    );

    return {
      beach: beachKey,
      name: beach.name,
      coordinates: beach.coordinates,
      extremes: extremes.data || [],
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error(
      `✗ Error fetching tide data for ${beach.name}:`,
      error.message
    );
    return {
      beach: beachKey,
      name: beach.name,
      coordinates: beach.coordinates,
      extremes: [],
      error: error.message,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Fetch tide data for all beaches
 */
async function fetchAllBeachTides() {
  console.log("Starting tide data fetch...\n");

  const results = {
    lastUpdated: new Date().toISOString(),
    beaches: {},
    meta: {
      totalBeaches: Object.keys(BEACHES).length,
      daysOfPredictions: 7,
      apiProvider: "Stormglass.io",
    },
  };

  // Fetch data for each beach sequentially to avoid rate limiting
  for (const [beachKey, beach] of Object.entries(BEACHES)) {
    const tideData = await fetchBeachTideData(beachKey, beach);
    results.beaches[beachKey] = tideData;

    // Add small delay between requests to be polite to API
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Save to file
  fs.writeFileSync(TIDE_DATA_FILE, JSON.stringify(results, null, 2));

  console.log(`\n✓ Tide data saved to ${TIDE_DATA_FILE}`);
  console.log(
    `✓ Total beaches processed: ${Object.keys(results.beaches).length}`
  );
  console.log(`✓ Last updated: ${results.lastUpdated}`);

  // Print summary
  console.log("\nSummary:");
  Object.entries(results.beaches).forEach(([key, data]) => {
    if (data.error) {
      console.log(`  ${data.name}: ERROR - ${data.error}`);
    } else {
      console.log(`  ${data.name}: ${data.extremes.length} tide extremes`);
    }
  });
}

// Run the script
fetchAllBeachTides()
  .then(() => {
    console.log("\n✓ Tide data fetch complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n✗ Fatal error:", error);
    process.exit(1);
  });
