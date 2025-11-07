import { useMemo } from "react";
import useTideData from "../hooks/useTideData";
import useSeaLevelData from "../hooks/useSeaLevelData";
import {
  getNextTides,
  getCurrentTideHeight,
  formatTideTime,
  formatTideDate,
} from "../services/tideService";
import {
  getCurrentSeaLevel,
  getNextHoursSeaLevel,
} from "../services/seaLevelService";
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

  // Fetch sea level data for selected beach (hourly data for smooth curves)
  // Sea level is optional - gracefully degrades to extremes if unavailable
  const { seaLevel } = useSeaLevelData(selectedBeach);

  // Determine if we're using sea level data or extremes
  const hasSeaLevelData = seaLevel && seaLevel.length > 0;

  // Get next high and low tides (always from extremes)
  const { nextHigh, nextLow } = useMemo(
    () => getNextTides(extremes),
    [extremes]
  );

  // Get current tide height (prefer sea level if available)
  const currentHeight = useMemo(() => {
    if (hasSeaLevelData) {
      return getCurrentSeaLevel(seaLevel);
    }
    return getCurrentTideHeight(extremes);
  }, [hasSeaLevelData, seaLevel, extremes]);

  // Get next 24 hours of tides for chart
  const chartData = useMemo(() => {
    // Prefer sea level data for smooth curve
    if (hasSeaLevelData) {
      const next24Hours = getNextHoursSeaLevel(seaLevel, 24);
      // Convert to format that matches extremes structure
      return next24Hours.map((reading) => ({
        time: reading.time,
        height: reading.height,
        type: "sea-level", // Mark as sea level data
      }));
    }

    // Fallback to extremes (discrete high/low points)
    if (!extremes || extremes.length === 0) return [];

    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Get extremes within next 24 hours
    const tidesIn24h = extremes.filter((tide) => {
      const tideTime = new Date(tide.time);
      return tideTime >= now && tideTime <= next24Hours;
    });

    return tidesIn24h.slice(0, 12); // Max 12 data points for chart
  }, [hasSeaLevelData, seaLevel, extremes]);

  // Calculate max and min heights for scaling
  const { maxHeight, minHeight, heightRange } = useMemo(() => {
    if (chartData.length === 0)
      return { maxHeight: 3.0, minHeight: 0, heightRange: 3.0 };

    const heights = chartData.map((d) => d.height);
    const max = Math.max(...heights);
    const min = Math.min(...heights);

    // Add 10% padding to both ends
    const padding = (max - min) * 0.1;
    const paddedMax = max + padding;
    const paddedMin = min - padding;
    const range = paddedMax - paddedMin;

    return {
      maxHeight: paddedMax,
      minHeight: paddedMin,
      heightRange: range,
    };
  }, [chartData]);

  // Calculate percentage height for bars (accounting for negative values)
  const getBarHeight = (height) => {
    return ((height - minHeight) / heightRange) * 100;
  };

  // Loading state (wait for both if needed)
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

  // Error state (tide extremes are required, sea level is optional)
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
        <p>
          24-Hour Tide Predictions
          {hasSeaLevelData && (
            <span
              style={{
                fontSize: "0.75rem",
                marginLeft: "0.5rem",
                opacity: 0.7,
              }}
            >
              (Hourly Data)
            </span>
          )}
        </p>
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
              {currentHeight !== null ? `${currentHeight.toFixed(2)}m` : "N/A"}
            </span>
          </div>
          <div className="tide-info-item">
            <span className="tide-info-label">Next High</span>
            <span className="tide-info-value">
              {nextHigh
                ? `${formatTideTime(nextHigh.time)} (${nextHigh.height.toFixed(
                    2
                  )}m)`
                : "N/A"}
            </span>
          </div>
          <div className="tide-info-item">
            <span className="tide-info-label">Next Low</span>
            <span className="tide-info-value">
              {nextLow
                ? `${formatTideTime(nextLow.time)} (${nextLow.height.toFixed(
                    2
                  )}m)`
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
              {(minHeight + heightRange * 0.66).toFixed(1)}m
            </span>
            <span className="tide-y-label">
              {(minHeight + heightRange * 0.33).toFixed(1)}m
            </span>
            <span className="tide-y-label">{minHeight.toFixed(1)}m</span>
          </div>

          {/* Chart container - smooth curve for sea level, bars for extremes */}
          <div className="tide-bars-container">
            {/* Grid lines */}
            <div className="tide-grid-lines">
              <div className="tide-grid-line"></div>
              <div className="tide-grid-line"></div>
              <div className="tide-grid-line"></div>
              <div className="tide-grid-line"></div>
            </div>

            {hasSeaLevelData ? (
              /* Smooth curve for sea level data */
              <svg
                className="tide-curve-svg"
                viewBox="0 0 1000 400"
                preserveAspectRatio="none"
              >
                {/* Grid reference lines */}
                <line
                  x1="0"
                  y1="0"
                  x2="1000"
                  y2="0"
                  stroke="rgba(109, 213, 237, 0.1)"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="133"
                  x2="1000"
                  y2="133"
                  stroke="rgba(109, 213, 237, 0.1)"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="266"
                  x2="1000"
                  y2="266"
                  stroke="rgba(109, 213, 237, 0.1)"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="400"
                  x2="1000"
                  y2="400"
                  stroke="rgba(109, 213, 237, 0.1)"
                  strokeWidth="1"
                />

                {/* Generate smooth curve path */}
                <path
                  d={chartData
                    .map((point, i) => {
                      const x = (i / (chartData.length - 1)) * 1000;
                      // Map height to Y coordinate (0-400, inverted because SVG Y goes down)
                      const normalizedHeight =
                        (point.height - minHeight) / heightRange;
                      const y = 400 - normalizedHeight * 400;
                      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="url(#tideGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Fill area under curve */}
                <path
                  d={[
                    chartData
                      .map((point, i) => {
                        const x = (i / (chartData.length - 1)) * 1000;
                        const normalizedHeight =
                          (point.height - minHeight) / heightRange;
                        const y = 400 - normalizedHeight * 400;
                        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                      })
                      .join(" "),
                    `L 1000 400 L 0 400 Z`,
                  ].join(" ")}
                  fill="url(#tideAreaGradient)"
                  opacity="0.2"
                />

                {/* Data points */}
                {chartData.map((point, i) => {
                  const x = (i / (chartData.length - 1)) * 1000;
                  const normalizedHeight =
                    (point.height - minHeight) / heightRange;
                  const y = 400 - normalizedHeight * 400;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#6dd5ed"
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                  );
                })}

                {/* Gradient definitions */}
                <defs>
                  <linearGradient
                    id="tideGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#6dd5ed" />
                    <stop offset="50%" stopColor="#2193b0" />
                    <stop offset="100%" stopColor="#6dd5ed" />
                  </linearGradient>
                  <linearGradient
                    id="tideAreaGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#6dd5ed" />
                    <stop offset="100%" stopColor="#2193b0" />
                  </linearGradient>
                </defs>
              </svg>
            ) : (
              /* Bar chart for extremes data */
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
                        <span className="tide-height">
                          {typeof tide.height === "number"
                            ? tide.height.toFixed(2)
                            : tide.height}
                          m
                        </span>
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
            )}

            {/* Time labels for curve (shown below the chart) */}
            {hasSeaLevelData && (
              <div className="tide-curve-time-labels">
                {chartData
                  .filter((_, i) => i % 4 === 0)
                  .map((point, i) => (
                    <div key={i} className="tide-curve-time-label">
                      <div className="tide-time-hour">
                        {formatTideTime(point.time)}
                      </div>
                      <div className="tide-time-date">
                        {formatTideDate(point.time)}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="tide-legend">
          {hasSeaLevelData ? (
            <div className="tide-legend-item">
              <div className="tide-legend-dot sea-level"></div>
              <span>Hourly Sea Level</span>
            </div>
          ) : (
            <>
              <div className="tide-legend-item">
                <div className="tide-legend-dot high"></div>
                <span>High Tide</span>
              </div>
              <div className="tide-legend-item">
                <div className="tide-legend-dot low"></div>
                <span>Low Tide</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TideChart;
