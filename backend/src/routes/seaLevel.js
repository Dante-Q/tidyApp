/**
 * Sea Level Data Routes
 * Serves hourly sea level (tide height) data from static JSON file
 */

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to sea level data file
const SEA_LEVEL_DATA_FILE = path.join(
  __dirname,
  "../../data/seaLevelData.json"
);

/**
 * GET /api/sea-level
 * Returns sea level data for all beaches
 */
router.get("/", (req, res) => {
  try {
    // Check if file exists
    if (!fs.existsSync(SEA_LEVEL_DATA_FILE)) {
      return res.status(404).json({
        error: "Sea level data not found",
        message:
          "Run 'node src/scripts/fetchSeaLevelData.js' to fetch sea level data",
      });
    }

    // Read and parse the JSON file
    const fileContent = fs.readFileSync(SEA_LEVEL_DATA_FILE, "utf-8");
    const seaLevelData = JSON.parse(fileContent);

    res.json(seaLevelData);
  } catch (error) {
    console.error("Error reading sea level data:", error);
    res.status(500).json({
      error: "Failed to read sea level data",
      message: error.message,
    });
  }
});

/**
 * GET /api/sea-level/:beachName
 * Returns sea level data for a specific beach
 */
router.get("/:beachName", (req, res) => {
  try {
    const { beachName } = req.params;

    // Check if file exists
    if (!fs.existsSync(SEA_LEVEL_DATA_FILE)) {
      return res.status(404).json({
        error: "Sea level data not found",
        message:
          "Run 'node src/scripts/fetchSeaLevelData.js' to fetch sea level data",
      });
    }

    // Read and parse the JSON file
    const fileContent = fs.readFileSync(SEA_LEVEL_DATA_FILE, "utf-8");
    const seaLevelData = JSON.parse(fileContent);

    // Get specific beach data
    const beachData = seaLevelData.beaches?.[beachName.toLowerCase()];

    if (!beachData) {
      return res.status(404).json({
        error: "Beach not found",
        message: `No sea level data available for beach: ${beachName}`,
        availableBeaches: Object.keys(seaLevelData.beaches || {}),
      });
    }

    // Return beach data along with metadata
    res.json({
      ...beachData,
      meta: seaLevelData.meta,
      lastUpdated: seaLevelData.lastUpdated,
    });
  } catch (error) {
    console.error("Error reading sea level data:", error);
    res.status(500).json({
      error: "Failed to read sea level data",
      message: error.message,
    });
  }
});

export default router;
