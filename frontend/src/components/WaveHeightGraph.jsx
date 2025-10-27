import { useState } from "react";
import "./WaveHeightGraph.css";

const WaveHeightGraph = () => {
  // Mock wave height data for 24 hours
  const [waveData] = useState([
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
  ]);

  const currentTime = "12:00";
  const maxHeight = 4.0;

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

  const currentWave =
    waveData.find((w) => w.time === currentTime) || waveData[0];
  const currentRating = getRatingInfo(currentWave.rating);

  return (
    <div className="wave-height-graph">
      <div className="wave-height-header">
        <h2>Wave Height Forecast</h2>
        <p>24-Hour Surf Conditions</p>
      </div>

      <div className="wave-height-container">
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
            <span className="wave-condition-value">{currentWave.height}m</span>
          </div>
          <div className="wave-condition-card">
            <span className="wave-condition-label">Period</span>
            <span className="wave-condition-value">{currentWave.period}s</span>
          </div>
          <div className="wave-condition-card">
            <span className="wave-condition-label">Peak</span>
            <span className="wave-condition-value">3.5m @ 14:00</span>
          </div>
        </div>

        {/* Graph area */}
        <div className="wave-graph-area">
          {/* Y-axis */}
          <div className="wave-y-axis">
            <span className="wave-y-label">4.0m</span>
            <span className="wave-y-label">3.0m</span>
            <span className="wave-y-label">2.0m</span>
            <span className="wave-y-label">1.0m</span>
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
                      const x = (i / (waveData.length - 1)) * 1000;
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
                      const x = (i / (waveData.length - 1)) * 1000;
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
                const x = (i / (waveData.length - 1)) * 1000;
                const y = 300 - (d.height / maxHeight) * 300;
                const isCurrent = d.time === currentTime;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={isCurrent ? 8 : 5}
                    fill={isCurrent ? "#fbbf24" : getRatingColor(d.rating)}
                    stroke="rgba(15, 23, 42, 0.8)"
                    strokeWidth="2"
                    className={isCurrent ? "current-point" : ""}
                  />
                );
              })}
            </svg>

            {/* Time labels */}
            <div className="wave-time-labels">
              {waveData.map((d, i) => (
                <div
                  key={i}
                  className={`wave-time-label ${
                    d.time === currentTime ? "current" : ""
                  }`}
                >
                  {d.time}
                  {d.time === currentTime && (
                    <span className="current-marker">▲</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rating legend */}
        <div className="wave-rating-legend">
          <div className="wave-legend-title">Surf Rating</div>
          <div className="wave-legend-items">
            <div className="wave-legend-item">
              <div
                className="wave-legend-dot"
                style={{ background: "#ef4444" }}
              ></div>
              <span>Poor (0-1.5m)</span>
            </div>
            <div className="wave-legend-item">
              <div
                className="wave-legend-dot"
                style={{ background: "#f59e0b" }}
              ></div>
              <span>Fair (1.5-2.5m)</span>
            </div>
            <div className="wave-legend-item">
              <div
                className="wave-legend-dot"
                style={{ background: "#6dd5ed" }}
              ></div>
              <span>Good (2.5-3.5m)</span>
            </div>
            <div className="wave-legend-item">
              <div
                className="wave-legend-dot"
                style={{ background: "#10b981" }}
              ></div>
              <span>Excellent (3.5m+)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveHeightGraph;
