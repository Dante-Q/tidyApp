/**
 * Tide Data Routes
 * Serves pre-fetched tide data from static JSON file
 */

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const TIDE_DATA_FILE = path.join(__dirname, "../../data/tideData.json");

/**
 * GET /api/tides
 * Get tide data for all beaches
 */
router.get("/", (req, res) => {
  try {
    // Check if data file exists
    if (!fs.existsSync(TIDE_DATA_FILE)) {
      return res.status(404).json({
        error: "Tide data not available",
        message:
          "Tide data has not been fetched yet. Please run the fetchTideData script.",
      });
    }

    // Read and parse the data file
    const rawData = fs.readFileSync(TIDE_DATA_FILE, "utf-8");
    const tideData = JSON.parse(rawData);

    res.json(tideData);
  } catch (error) {
    console.error("Error reading tide data:", error);
    res.status(500).json({
      error: "Failed to read tide data",
      message: error.message,
    });
  }
});

/**
 * GET /api/tides/:beachName
 * Get tide data for a specific beach
 */
router.get("/:beachName", (req, res) => {
  try {
    const { beachName } = req.params;

    // Check if data file exists
    if (!fs.existsSync(TIDE_DATA_FILE)) {
      return res.status(404).json({
        error: "Tide data not available",
        message: "Tide data has not been fetched yet.",
      });
    }

    // Read and parse the data file
    const rawData = fs.readFileSync(TIDE_DATA_FILE, "utf-8");
    const tideData = JSON.parse(rawData);

    // Find beach data
    const beachKey = beachName.toLowerCase();
    const beachTideData = tideData.beaches?.[beachKey];

    if (!beachTideData) {
      return res.status(404).json({
        error: "Beach not found",
        message: `No tide data available for beach: ${beachName}`,
      });
    }

    res.json({
      ...beachTideData,
      meta: tideData.meta,
      lastUpdated: tideData.lastUpdated,
    });
  } catch (error) {
    console.error("Error reading tide data:", error);
    res.status(500).json({
      error: "Failed to read tide data",
      message: error.message,
    });
  }
});

export default router;
