import { useMemo } from "react";
import useTideData from "../hooks/useTideData";
import {
  getNextTides,
  getCurrentTideHeight,
  formatTideTime,
  formatTideDate,
} from "../services/tideService";
import "./TideChart.css";

/**
 * TideChart Component
 * Displays tide predictions with high/low extremes
 * @param {Object} props
 * @param {string} props.selectedBeach - Currently selected beach
 * @param {Function} props.onBeachChange - Callback when beach selection changes
 */
const TideChart = ({
  selectedBeach = "muizenberg",
  onBeachChange = () => {},
}) => {
  const beaches = [
    { value: "muizenberg", label: "Muizenberg" },
    { value: "bloubergstrand", label: "Bloubergstrand" },
    { value: "strand", label: "Strand" },
    { value: "clifton", label: "Clifton" },
    { value: "kalkbay", label: "Kalk Bay" },
    { value: "milnerton", label: "Milnerton" },
  ];

  // Fetch tide data for selected beach
  const { extremes, loading, error } = useTideData(selectedBeach);

  // Get next high and low tides
  const { nextHigh, nextLow } = useMemo(
    () => getNextTides(extremes),
    [extremes]
  );

  // Get current tide height
  const currentHeight = useMemo(
    () => getCurrentTideHeight(extremes),
    [extremes]
  );

  // Get next 24 hours of tides for chart (12 data points)
  const chartData = useMemo(() => {
    if (!extremes || extremes.length === 0) return [];

    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Get extremes within next 24 hours
    const tidesIn24h = extremes.filter((tide) => {
      const tideTime = new Date(tide.time);
      return tideTime >= now && tideTime <= next24Hours;
    });

    return tidesIn24h.slice(0, 12); // Max 12 data points for chart
  }, [extremes]);

  // Calculate max height for scaling
  const maxHeight = useMemo(() => {
    if (chartData.length === 0) return 3.0;
    const max = Math.max(...chartData.map((d) => d.height));
    return Math.ceil(max * 1.2 * 10) / 10; // Round up with 20% padding
  }, [chartData]);

  // Calculate percentage height for bars
  const getBarHeight = (height) => {
    return (height / maxHeight) * 100;
  };

  // Loading state
  if (loading) {
    return (
      <div className="tide-chart">
        <div className="tide-chart-header">
          <h2>Tide Chart</h2>
          <p>Loading tide data...</p>
        </div>
        <div className="tide-chart-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="tide-chart">
        <div className="tide-chart-header">
          <h2>Tide Chart</h2>
          <p style={{ color: "#ef4444" }}>Failed to load tide data</p>
        </div>
        <div className="tide-chart-error">
          <p>{error}</p>
          <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Make sure the backend script has been run to fetch tide data.
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (chartData.length === 0) {
    return (
      <div className="tide-chart">
        <div className="tide-chart-header">
          <h2>Tide Chart</h2>
          <p>No tide data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tide-chart">
      <div className="tide-chart-header">
        <h2>Tide Chart</h2>
        <p>24-Hour Tide Predictions</p>
        {/* Beach selector */}
        <select
          value={selectedBeach}
          onChange={(e) => onBeachChange(e.target.value)}
          className="beach-selector"
        >
          {beaches.map((beach) => (
            <option key={beach.value} value={beach.value}>
              {beach.label}
            </option>
          ))}
        </select>
      </div>

      <div className="tide-chart-container">
        {/* Current tide info */}
        <div className="tide-current-info">
          <div className="tide-info-item">
            <span className="tide-info-label">Current</span>
            <span className="tide-info-value">
              {currentHeight !== null ? `${currentHeight}m` : "N/A"}
            </span>
          </div>
          <div className="tide-info-item">
            <span className="tide-info-label">Next High</span>
            <span className="tide-info-value">
              {nextHigh
                ? `${formatTideTime(nextHigh.time)} (${nextHigh.height}m)`
                : "N/A"}
            </span>
          </div>
          <div className="tide-info-item">
            <span className="tide-info-label">Next Low</span>
            <span className="tide-info-value">
              {nextLow
                ? `${formatTideTime(nextLow.time)} (${nextLow.height}m)`
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Chart area */}
        <div className="tide-chart-graph">
          {/* Y-axis labels */}
          <div className="tide-y-axis">
            <span className="tide-y-label">{maxHeight.toFixed(1)}m</span>
            <span className="tide-y-label">
              {(maxHeight * 0.66).toFixed(1)}m
            </span>
            <span className="tide-y-label">
              {(maxHeight * 0.33).toFixed(1)}m
            </span>
            <span className="tide-y-label">0.0m</span>
          </div>

          {/* Bars container */}
          <div className="tide-bars-container">
            {/* Grid lines */}
            <div className="tide-grid-lines">
              <div className="tide-grid-line"></div>
              <div className="tide-grid-line"></div>
              <div className="tide-grid-line"></div>
              <div className="tide-grid-line"></div>
            </div>

            {/* Tide bars */}
            <div className="tide-bars">
              {chartData.map((tide, index) => (
                <div key={index} className="tide-bar-wrapper">
                  {/* High/Low label */}
                  <div className={`tide-label tide-label-${tide.type}`}>
                    {tide.type === "high" ? "High" : "Low"}
                  </div>

                  {/* Bar */}
                  <div className="tide-bar-container">
                    <div
                      className={`tide-bar tide-bar-${tide.type}`}
                      style={{ height: `${getBarHeight(tide.height)}%` }}
                    >
                      <span className="tide-height">{tide.height}m</span>
                    </div>
                  </div>

                  {/* Time label */}
                  <div className="tide-time">
                    <div className="tide-time-hour">
                      {formatTideTime(tide.time)}
                    </div>
                    <div className="tide-time-date">
                      {formatTideDate(tide.time)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="tide-legend">
          <div className="tide-legend-item">
            <div className="tide-legend-dot high"></div>
            <span>High Tide</span>
          </div>
          <div className="tide-legend-item">
            <div className="tide-legend-dot low"></div>
            <span>Low Tide</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TideChart;
