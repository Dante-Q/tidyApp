import { useState } from "react";
import "./TideChart.css";

const TideChart = () => {
  // Mock tide data for 24 hours (every 2 hours)
  const [tideData] = useState([
    { time: "00:00", height: 1.2, label: "Low" },
    { time: "02:00", height: 1.8, label: "" },
    { time: "04:00", height: 2.4, label: "" },
    { time: "06:00", height: 2.8, label: "High" },
    { time: "08:00", height: 2.3, label: "" },
    { time: "10:00", height: 1.6, label: "" },
    { time: "12:00", height: 1.1, label: "Low" },
    { time: "14:00", height: 1.5, label: "" },
    { time: "16:00", height: 2.1, label: "" },
    { time: "18:00", height: 2.7, label: "High" },
    { time: "20:00", height: 2.2, label: "" },
    { time: "22:00", height: 1.7, label: "" },
    { time: "24:00", height: 1.3, label: "" },
  ]);

  const maxHeight = 3.0; // Maximum tide height for scaling
  const currentTime = "12:00"; // Mock current time

  // Calculate percentage height for each data point
  const getBarHeight = (height) => {
    return (height / maxHeight) * 100;
  };

  return (
    <div className="tide-chart">
      <div className="tide-chart-header">
        <h2>Tide Chart</h2>
        <p>24-Hour Tide Predictions</p>
      </div>

      <div className="tide-chart-container">
        {/* Current tide info */}
        <div className="tide-current-info">
          <div className="tide-info-item">
            <span className="tide-info-label">Current</span>
            <span className="tide-info-value">1.1m</span>
          </div>
          <div className="tide-info-item">
            <span className="tide-info-label">Next High</span>
            <span className="tide-info-value">18:00 (2.7m)</span>
          </div>
          <div className="tide-info-item">
            <span className="tide-info-label">Next Low</span>
            <span className="tide-info-value">00:00 (1.2m)</span>
          </div>
        </div>

        {/* Chart area */}
        <div className="tide-chart-graph">
          {/* Y-axis labels */}
          <div className="tide-y-axis">
            <span className="tide-y-label">3.0m</span>
            <span className="tide-y-label">2.0m</span>
            <span className="tide-y-label">1.0m</span>
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
              {tideData.map((data, index) => (
                <div key={index} className="tide-bar-wrapper">
                  {/* High/Low label */}
                  {data.label && (
                    <div
                      className={`tide-label tide-label-${data.label.toLowerCase()}`}
                    >
                      {data.label}
                    </div>
                  )}

                  {/* Bar */}
                  <div className="tide-bar-container">
                    <div
                      className={`tide-bar ${
                        data.time === currentTime ? "current" : ""
                      }`}
                      style={{ height: `${getBarHeight(data.height)}%` }}
                    >
                      <span className="tide-height">{data.height}m</span>
                    </div>
                  </div>

                  {/* Time label */}
                  <div className="tide-time">
                    {data.time}
                    {data.time === currentTime && (
                      <span className="current-marker">●</span>
                    )}
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
          <div className="tide-legend-item">
            <div className="tide-legend-dot current"></div>
            <span>Current Time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TideChart;
