/**
 * Fetch Sea Level Data Script
 *
 * This script fetches hourly sea level data from Stormglass API for all beaches
 * and saves it to a JSON file for frontend consumption.
 *
 * Usage: node src/scripts/fetchSeaLevelData.js
 *
 * IMPORTANT: Stormglass free tier = 10 requests/day
 * - This script uses 6 requests (one per beach)
 * - Run on EVEN DAYS (alternates with fetchTideData.js on odd days)
 * - Best time: Early morning (6am)
 *
 * Data Strategy:
 * - Fetches 7 days of hourly sea level predictions
 * - Provides smooth tide curve (24 data points per day)
 * - Complements tide extremes (high/low only)
 * - Overwrites entire file atomically (all beaches or nothing)
 * - Falls back to partial updates if some beaches fail
 *
 * Recommended Schedule:
 * - Run on even days at 6am: 0 6 * * 2,4,6 (cron)
 * - Alternates with tide extremes on odd days
 */

/**
 * Fetches sea level (hourly water levels) for configured beaches
 */

import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Import stormglass service
import { fetchSeaLevelData as fetchSeaLevelDataFromAPI } from "../services/stormglassService.js";

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
const SEA_LEVEL_DATA_FILE = path.join(DATA_DIR, "seaLevelData.json");
const BACKUP_FILE = path.join(DATA_DIR, "seaLevelData.backup.json");

/**
 * Load existing sea level data from file
 * @returns {Object|null} Existing sea level data or null if doesn't exist
 */
function loadExistingData() {
  try {
    if (fs.existsSync(SEA_LEVEL_DATA_FILE)) {
      const fileContent = fs.readFileSync(SEA_LEVEL_DATA_FILE, "utf-8");
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.warn("⚠ Could not load existing data:", error.message);
  }
  return null;
}

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
 * Fetch sea level data for a single beach
 * @param {string} beachKey - Beach identifier
 * @param {Object} beach - Beach configuration
 * @returns {Promise<Object>} Sea level data for the beach
 */
async function fetchBeachSeaLevel(beachKey, beach) {
  const { start, end } = getTimeRange(7); // 7 days of predictions
  const { lat, lng } = beach.coordinates;

  console.log(`Fetching sea level data for ${beach.name}...`);

  try {
    // Fetch hourly sea level (water heights)
    const seaLevelResponse = await fetchSeaLevelDataFromAPI(
      lat,
      lng,
      start,
      end
    );

    // Extract and format hourly data
    // Stormglass returns { data: [...], meta: {...} }
    // Each data point: { time: "2025-11-03T00:00:00+00:00", waterLevel: { sg: 1.23 } }
    const seaLevel = (seaLevelResponse.data || []).map((hour) => ({
      time: hour.time,
      height: hour.waterLevel?.sg || 0, // Stormglass prediction (not an array)
    }));

    console.log(
      `✓ Fetched ${seaLevel.length} hourly sea level readings for ${beach.name}`
    );

    return {
      beach: beachKey,
      name: beach.name,
      coordinates: beach.coordinates,
      seaLevel: seaLevel,
      hourlyDataPoints: seaLevel.length,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error(
      `✗ Error fetching sea level data for ${beach.name}:`,
      error.message
    );
    return {
      beach: beachKey,
      name: beach.name,
      coordinates: beach.coordinates,
      seaLevel: [],
      hourlyDataPoints: 0,
      error: error.message,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Fetch sea level data for all beaches
 * @param {Object} options - Options for fetching
 * @param {boolean} options.partialUpdates - Allow partial updates if some beaches fail
 * @returns {Promise<Object>} Complete sea level data object
 */
async function fetchAllBeachSeaLevels(options = { partialUpdates: true }) {
  const startTime = new Date();
  console.log("=".repeat(60));
  console.log("🌊 SEA LEVEL FETCH STARTED");
  console.log("=".repeat(60));
  console.log(`Start Time: ${startTime.toISOString()}`);
  console.log(`Local Time: ${startTime.toLocaleString()}`);
  console.log(`Script: fetchSeaLevelData.js`);
  console.log(`Schedule: EVEN DATES (2, 4, 6, 8, etc.)`);
  console.log("=".repeat(60));
  console.log();

  // Load existing data for fallback
  const existingData = loadExistingData();

  const results = {
    lastUpdated: new Date().toISOString(),
    beaches: {},
    meta: {
      totalBeaches: Object.keys(BEACHES).length,
      daysOfPredictions: 7,
      dataPoints: "hourly", // hourly vs extremes
      apiProvider: "Stormglass.io",
      fetchStatus: "complete", // 'complete', 'partial', or 'failed'
      failedBeaches: [],
    },
  };

  let successCount = 0;
  let failCount = 0;

  // Fetch data for each beach sequentially to avoid rate limiting
  for (const [beachKey, beach] of Object.entries(BEACHES)) {
    const seaLevelData = await fetchBeachSeaLevel(beachKey, beach);

    if (seaLevelData.error) {
      failCount++;
      results.meta.failedBeaches.push(beachKey);

      // Use existing data if available and partial updates enabled
      if (options.partialUpdates && existingData?.beaches?.[beachKey]) {
        console.log(
          `  ℹ Using cached data for ${beach.name} (from ${existingData.beaches[beachKey].lastUpdated})`
        );
        results.beaches[beachKey] = {
          ...existingData.beaches[beachKey],
          cachedData: true,
          cacheReason: seaLevelData.error,
        };
      } else {
        results.beaches[beachKey] = seaLevelData;
      }
    } else {
      successCount++;
      results.beaches[beachKey] = seaLevelData;
    }

    // Add small delay between requests to be polite to API
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Update fetch status
  if (failCount === Object.keys(BEACHES).length) {
    results.meta.fetchStatus = "failed";
  } else if (failCount > 0) {
    results.meta.fetchStatus = "partial";
  }

  console.log(`\n📊 Fetch Summary:`);
  console.log(`  ✓ Successful: ${successCount} beaches`);
  console.log(`  ✗ Failed: ${failCount} beaches`);

  // Check if we should save
  if (results.meta.fetchStatus === "failed" && !options.partialUpdates) {
    throw new Error("All beaches failed to fetch and partial updates disabled");
  }

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Create backup of existing data before overwriting
  if (existingData && fs.existsSync(SEA_LEVEL_DATA_FILE)) {
    try {
      fs.copyFileSync(SEA_LEVEL_DATA_FILE, BACKUP_FILE);
      console.log(`\n💾 Backup created: ${BACKUP_FILE}`);
    } catch (error) {
      console.warn("⚠ Could not create backup:", error.message);
    }
  }

  // Save to file (atomic write)
  try {
    const tempFile = SEA_LEVEL_DATA_FILE + ".tmp";
    fs.writeFileSync(tempFile, JSON.stringify(results, null, 2));
    fs.renameSync(tempFile, SEA_LEVEL_DATA_FILE); // Atomic on most systems

    console.log(`\n✓ Sea level data saved to ${SEA_LEVEL_DATA_FILE}`);
    console.log(`✓ Status: ${results.meta.fetchStatus.toUpperCase()}`);
    console.log(`✓ Last updated: ${results.lastUpdated}`);
  } catch (error) {
    console.error("✗ Failed to save sea level data:", error);
    throw error;
  }

  // Print summary
  console.log("\n📋 Beach Details:");
  Object.entries(results.beaches).forEach(([key, data]) => {
    if (data.cachedData) {
      console.log(`  ${data.name}: CACHED (${data.cacheReason})`);
    } else if (data.error) {
      console.log(`  ${data.name}: ERROR - ${data.error}`);
    } else {
      console.log(
        `  ${data.name}: ${data.hourlyDataPoints} hourly data points`
      );
    }
  });

  return results;
}

// Run the script
const startTime = new Date();
fetchAllBeachSeaLevels({ partialUpdates: true })
  .then((results) => {
    console.log("\n✅ Sea level data fetch complete!");

    // Warn about API usage
    const requestsUsed = Object.keys(BEACHES).length;
    console.log(`\n📊 API Usage:`);
    console.log(`  Requests made: ${requestsUsed}`);
    console.log(`  Daily limit: 10 requests`);
    console.log(`  Remaining today: ~${10 - requestsUsed} requests`);

    if (results.meta.fetchStatus === "partial") {
      console.log(
        "\n⚠️  WARNING: Some beaches failed. Using cached data where available."
      );
      console.log(
        `   Failed beaches: ${results.meta.failedBeaches.join(", ")}`
      );
      process.exit(1); // Exit with error code for monitoring
    } else if (results.meta.fetchStatus === "failed") {
      console.log("\n❌ ERROR: All beaches failed to fetch!");
      process.exit(1);
    }

    const endTime = new Date();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log();
    console.log("=".repeat(60));
    console.log("🌊 SEA LEVEL FETCH COMPLETED");
    console.log("=".repeat(60));
    console.log(`End Time: ${endTime.toISOString()}`);
    console.log(`Duration: ${duration} seconds`);
    console.log(`Status: SUCCESS ✓`);
    console.log("=".repeat(60));

    process.exit(0);
  })
  .catch((error) => {
    const endTime = new Date();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log();
    console.log("=".repeat(60));
    console.log("❌ SEA LEVEL FETCH FAILED");
    console.log("=".repeat(60));
    console.log(`End Time: ${endTime.toISOString()}`);
    console.log(`Duration: ${duration} seconds`);
    console.log(`Error: ${error.message}`);
    console.log("=".repeat(60));

    process.exit(1);
  });
