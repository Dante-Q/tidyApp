/**
 * Fetch Tide Data Script
 *
 * This script fetches tide data from Stormglass API for all beaches
 * and saves it to a JSON file for frontend consumption.
 *
 * Usage: node src/scripts/fetchTideData.js
 *
 * IMPORTANT: Stormglass free tier = 10 requests/day
 * - This script uses 6 requests (one per beach)
 * - Recommended: Run ONCE per day to stay within limits
 * - Best time: Early morning (6am) to get full day ahead
 *
 * Data Strategy:
 * - Fetches 7 days of tide predictions
 * - Overwrites entire file atomically (all beaches or nothing)
 * - Falls back to partial updates if some beaches fail
 * - Preserves old data for failed beaches
 *
 * Recommended Schedule:
 * - Run once daily at 6am: 0 6 * * * (cron)
 * - Or manually when needed
 */

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fetchTideData as fetchTideDataFromAPI } from "../services/stormglassService.js";
import { BEACHES } from "../config/beaches.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Output directory
const DATA_DIR = path.join(__dirname, "../../data");
const TIDE_DATA_FILE = path.join(DATA_DIR, "tideData.json");
const BACKUP_FILE = path.join(DATA_DIR, "tideData.backup.json");

/**
 * Load existing tide data from file
 * @returns {Object|null} Existing tide data or null if doesn't exist
 */
function loadExistingData() {
  try {
    if (fs.existsSync(TIDE_DATA_FILE)) {
      const fileContent = fs.readFileSync(TIDE_DATA_FILE, "utf-8");
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
    const extremes = await fetchTideDataFromAPI(lat, lng, start, end);

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
 * @param {Object} options - Options for fetching
 * @param {boolean} options.partialUpdates - Allow partial updates if some beaches fail
 * @returns {Promise<Object>} Complete tide data object
 */
async function fetchAllBeachTides(options = { partialUpdates: true }) {
  const startTime = new Date();
  console.log("=".repeat(60));
  console.log("🌊 TIDE EXTREMES FETCH STARTED");
  console.log("=".repeat(60));
  console.log(`Start Time: ${startTime.toISOString()}`);
  console.log(`Local Time: ${startTime.toLocaleString()}`);
  console.log(`Script: fetchTideData.js`);
  console.log(`Schedule: ODD DATES (1, 3, 5, 7, etc.)`);
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
      apiProvider: "Stormglass.io",
      fetchStatus: "complete", // 'complete', 'partial', or 'failed'
      failedBeaches: [],
    },
  };

  let successCount = 0;
  let failCount = 0;

  // Fetch data for each beach sequentially to avoid rate limiting
  for (const [beachKey, beach] of Object.entries(BEACHES)) {
    const tideData = await fetchBeachTideData(beachKey, beach);

    if (tideData.error) {
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
          cacheReason: tideData.error,
        };
      } else {
        results.beaches[beachKey] = tideData;
      }
    } else {
      successCount++;
      results.beaches[beachKey] = tideData;
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
  if (existingData && fs.existsSync(TIDE_DATA_FILE)) {
    try {
      fs.copyFileSync(TIDE_DATA_FILE, BACKUP_FILE);
      console.log(`\n💾 Backup created: ${BACKUP_FILE}`);
    } catch (error) {
      console.warn("⚠ Could not create backup:", error.message);
    }
  }

  // Save to file (atomic write)
  try {
    const tempFile = TIDE_DATA_FILE + ".tmp";
    fs.writeFileSync(tempFile, JSON.stringify(results, null, 2));
    fs.renameSync(tempFile, TIDE_DATA_FILE); // Atomic on most systems

    console.log(`\n✓ Tide data saved to ${TIDE_DATA_FILE}`);
    console.log(`✓ Status: ${results.meta.fetchStatus.toUpperCase()}`);
    console.log(`✓ Last updated: ${results.lastUpdated}`);
  } catch (error) {
    console.error("✗ Failed to save tide data:", error);
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
      console.log(`  ${data.name}: ${data.extremes.length} tide extremes`);
    }
  });

  return results;
}

// Run the script
const startTime = new Date();
fetchAllBeachTides({ partialUpdates: true })
  .then((results) => {
    console.log("\n✅ Tide data fetch complete!");

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
    console.log("🌊 TIDE EXTREMES FETCH COMPLETED");
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
    console.log("❌ TIDE EXTREMES FETCH FAILED");
    console.log("=".repeat(60));
    console.log(`End Time: ${endTime.toISOString()}`);
    console.log(`Duration: ${duration} seconds`);
    console.log(`Error: ${error.message}`);
    console.log("=".repeat(60));

    process.exit(1);
  });
