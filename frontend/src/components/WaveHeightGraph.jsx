import { useMemo } from "react";
import "./WaveHeightGraph.css";
import {
  transformWaveData,
  findPeakWave,
  getCurrentConditions,
} from "../utils/marineDataTransform";

// Mock data as constant to avoid dependency warning
const MOCK_DATA = [
  { time: "00:00", height: 1.2, period: 8, rating: "poor" },
  { time: "02:00", height: 1.5, period: 9, rating: "poor" },
  { time: "04:00", height: 1.8, period: 10, rating: "fair" },
  { time: "06:00", height: 2.1, period: 11, rating: "fair" },
  { time: "08:00", height: 2.5, period: 12, rating: "good" },
  { time: "10:00", height: 2.8, period: 13, rating: "good" },
  { time: "12:00", height: 3.2, period: 14, rating: "excellent" },
  { time: "14:00", height: 3.5, period: 14, rating: "excellent" },
  { time: "16:00", height: 3.0, period: 13, rating: "good" },
  { time: "18:00", height: 2.6, period: 12, rating: "good" },
  { time: "20:00", height: 2.2, period: 11, rating: "fair" },
  { time: "22:00", height: 1.9, period: 10, rating: "fair" },
];

// Convert degrees to cardinal direction
const getCardinalDirection = (degrees) => {
  if (degrees === null || degrees === undefined) return "";
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((degrees % 360) / 45) % 8;
  return directions[index];
};

export default function WaveHeightGraph({
  surfData,
  loading,
  error,
  selectedBeach,
  onBeachChange,
}) {
  const beaches = [
    { value: "muizenberg", label: "Muizenberg" },
    { value: "bloubergstrand", label: "Bloubergstrand" },
    { value: "strand", label: "Strand" },
    { value: "clifton", label: "Clifton" },
    { value: "kalkbay", label: "Kalk Bay" },
    { value: "milnerton", label: "Milnerton" },
  ];
  // Transform API data or use mock data
  const waveData = useMemo(() => {
    if (surfData?.hourly) {
      return transformWaveData(surfData, 24);
    }
    return MOCK_DATA;
  }, [surfData]);

  // Get current conditions
  const currentConditions = useMemo(() => {
    if (surfData) {
      return getCurrentConditions(surfData);
    }
    // Fallback to mock current time
    const now = new Date();
    const currentHour = now.getHours();
    const nearestData =
      MOCK_DATA.find((d) => parseInt(d.time) === currentHour) || MOCK_DATA[6];
    return {
      height: nearestData.height,
      period: nearestData.period,
      rating: nearestData.rating,
    };
  }, [surfData]);

  // Find peak wave
  const peakWave = useMemo(() => findPeakWave(waveData), [waveData]);

  // Calculate max height for graph scaling (add 20% padding)
  const maxHeight = useMemo(() => {
    const max = Math.max(...waveData.map((d) => d.height));
    return Math.ceil(max * 1.2);
  }, [waveData]);

  const currentTime = useMemo(() => {
    if (surfData?.hourly?.time?.[0]) {
      // Get current time in South Africa timezone to match API data
      const now = new Date();
      return now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Africa/Johannesburg",
      });
    }
    return "12:00"; // Fallback
  }, [surfData]);

  // Get color based on rating
  const getRatingColor = (rating) => {
    const colors = {
      poor: "#ef4444",
      fair: "#f59e0b",
      good: "#6dd5ed",
      excellent: "#10b981",
    };
    return colors[rating] || "#6dd5ed";
  };

  // Get wave rating info
  const getRatingInfo = (rating) => {
    const info = {
      poor: { label: "Poor", emoji: "😕" },
      fair: { label: "Fair", emoji: "🙂" },
      good: { label: "Good", emoji: "😊" },
      excellent: { label: "Excellent", emoji: "🤩" },
    };
    return info[rating] || info.fair;
  };

  const currentWave = useMemo(() => {
    return waveData.find((w) => w.time === currentTime) || waveData[0];
  }, [waveData, currentTime]);

  const currentRating = getRatingInfo(currentWave.rating);

  // Loading state
  if (loading) {
    return (
      <div className="wave-height-graph">
        <div className="wave-height-header">
          <h2>Wave Height Forecast</h2>
          <p>Loading surf conditions...</p>
        </div>
        <div
          className="wave-height-container"
          style={{
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌊</div>
            <div>Fetching wave data...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="wave-height-graph">
        <div className="wave-height-header">
          <h2>Wave Height Forecast</h2>
          <p style={{ color: "#ef4444" }}>Error loading data</p>
        </div>
        <div
          className="wave-height-container"
          style={{
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", color: "#ef4444" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
            <div>{error}</div>
            <div
              style={{
                marginTop: "0.5rem",
                fontSize: "0.875rem",
                color: "var(--color-text-secondary)",
              }}
            >
              Showing mock data for demo purposes
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wave-height-graph">
      <div className="wave-height-container">
        {/* Header */}
        <div className="wave-height-header">
          <div className="header-title-section">
            <h2>Wave Height Forecast</h2>
            <p>24-Hour Surf Conditions{!surfData ? " (Demo Data)" : ""}</p>
          </div>
          <div className="header-beach-selector">
            <select
              value={selectedBeach}
              onChange={(e) => onBeachChange(e.target.value)}
              className="beach-dropdown"
            >
              {beaches.map((beach) => (
                <option key={beach.value} value={beach.value}>
                  {beach.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current conditions */}
        <div className="wave-current-conditions">
          <div className="wave-condition-card highlight">
            <span className="wave-condition-emoji">{currentRating.emoji}</span>
            <span className="wave-condition-label">Current Conditions</span>
            <span
              className="wave-condition-value"
              style={{ color: getRatingColor(currentWave.rating) }}
            >
              {currentRating.label}
            </span>
          </div>
          <div className="wave-condition-card">
            <span className="wave-condition-label">Wave Height</span>
            <span className="wave-condition-value">
              {currentConditions.height}m
            </span>
          </div>
          <div className="wave-condition-card">
            <span className="wave-condition-label">Period</span>
            <span className="wave-condition-value">
              {currentConditions.period}s
            </span>
          </div>
          {currentConditions.direction !== undefined && (
            <div className="wave-condition-card">
              <span className="wave-condition-label">Direction</span>
              <span className="wave-condition-value">
                {currentConditions.direction}°
              </span>
              <span className="wave-condition-cardinal">
                {getCardinalDirection(currentConditions.direction)}
              </span>
            </div>
          )}
          <div className="wave-condition-card">
            <span className="wave-condition-label">Peak</span>
            <span className="wave-condition-value">
              {peakWave.height}m @ {peakWave.time}
            </span>
          </div>
        </div>

        {/* Graph area */}
        <div className="wave-graph-area">
          {/* Y-axis */}
          <div className="wave-y-axis">
            <span className="wave-y-label">{maxHeight.toFixed(1)}m</span>
            <span className="wave-y-label">
              {(maxHeight * 0.75).toFixed(1)}m
            </span>
            <span className="wave-y-label">
              {(maxHeight * 0.5).toFixed(1)}m
            </span>
            <span className="wave-y-label">
              {(maxHeight * 0.25).toFixed(1)}m
            </span>
            <span className="wave-y-label">0.0m</span>
          </div>

          {/* Graph container */}
          <div className="wave-graph-container">
            {/* Grid lines */}
            <div className="wave-grid-lines">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="wave-grid-line"></div>
              ))}
            </div>

            {/* Wave line and area */}
            <svg
              className="wave-graph-svg"
              viewBox="0 0 1000 300"
              preserveAspectRatio="none"
            >
              {/* Gradient definition */}
              <defs>
                <linearGradient
                  id="waveGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="rgba(109, 213, 237, 0.6)" />
                  <stop offset="100%" stopColor="rgba(109, 213, 237, 0.1)" />
                </linearGradient>
              </defs>

              {/* Area under the line */}
              <path
                d={`
                  M 0,300
                  ${waveData
                    .map((d, i) => {
                      const x =
                        waveData.length > 1
                          ? (i / (waveData.length - 1)) * 1000
                          : 500;
                      const y = 300 - (d.height / maxHeight) * 300;
                      return `L ${x},${y}`;
                    })
                    .join(" ")}
                  L 1000,300
                  Z
                `}
                fill="url(#waveGradient)"
              />

              {/* Wave line */}
              <path
                d={`
                  M ${waveData
                    .map((d, i) => {
                      const x =
                        waveData.length > 1
                          ? (i / (waveData.length - 1)) * 1000
                          : 500;
                      const y = 300 - (d.height / maxHeight) * 300;
                      return `${x},${y}`;
                    })
                    .join(" L ")}
                `}
                fill="none"
                stroke="#6dd5ed"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {waveData.map((d, i) => {
                const x =
                  waveData.length > 1
                    ? (i / (waveData.length - 1)) * 1000
                    : 500;
                const y = 300 - (d.height / maxHeight) * 300;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={5}
                    fill={getRatingColor(d.rating)}
                    stroke="rgba(15, 23, 42, 0.8)"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>

            {/* Time labels - show every 2nd hour to prevent crowding */}
            <div className="wave-time-labels">
              {waveData.map((d, i) => {
                // Show every 2nd label, or if it's the current time
                const shouldShow = i % 2 === 0 || d.time === currentTime;
                return (
                  <div
                    key={i}
                    className={`wave-time-label ${
                      d.time === currentTime ? "current" : ""
                    }`}
                    style={{ visibility: shouldShow ? "visible" : "hidden" }}
                  >
                    {d.time}
                    {d.time === currentTime && (
                      <span className="current-marker">▲</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rating legend */}
        <div className="wave-rating-legend">
          <div className="wave-legend-title">
            Surf Rating (Height × Period Score)
          </div>
          <div className="wave-legend-items">
            <div className="wave-legend-item">
              <div
                className="wave-legend-dot"
                style={{ background: "#ef4444" }}
              ></div>
              <span>Poor</span>
            </div>
            <div className="wave-legend-item">
              <div
                className="wave-legend-dot"
                style={{ background: "#f59e0b" }}
              ></div>
              <span>Fair</span>
            </div>
            <div className="wave-legend-item">
              <div
                className="wave-legend-dot"
                style={{ background: "#6dd5ed" }}
              ></div>
              <span>Good</span>
            </div>
            <div className="wave-legend-item">
              <div
                className="wave-legend-dot"
                style={{ background: "#10b981" }}
              ></div>
              <span>Excellent</span>
            </div>
          </div>
          <div className="wave-legend-formula">
            Score = Wave Height (m) × Wave Period (s) ÷ 10
          </div>
        </div>
      </div>
    </div>
  );
}
