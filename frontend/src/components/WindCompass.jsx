import { useState } from "react";
import "./WindCompass.css";

const WindCompass = () => {
  // Mock wind data
  const [windData] = useState({
    speed: 18, // km/h
    direction: 225, // degrees (SW)
    gusts: 24, // km/h
    directionName: "SW",
  });

  // Cardinal directions
  const directions = [
    { name: "N", angle: 0 },
    { name: "NE", angle: 45 },
    { name: "E", angle: 90 },
    { name: "SE", angle: 135 },
    { name: "S", angle: 180 },
    { name: "SW", angle: 225 },
    { name: "W", angle: 270 },
    { name: "NW", angle: 315 },
  ];

  // Get wind condition based on speed
  const getWindCondition = (speed) => {
    if (speed < 10) return { label: "Calm", color: "#10b981" };
    if (speed < 20) return { label: "Moderate", color: "#6dd5ed" };
    if (speed < 30) return { label: "Fresh", color: "#f59e0b" };
    if (speed < 40) return { label: "Strong", color: "#ef4444" };
    return { label: "Gale", color: "#dc2626" };
  };

  const condition = getWindCondition(windData.speed);

  return (
    <div className="wind-compass">
      <div className="wind-compass-header">
        <h2>Wind Conditions</h2>
        <p>Current Wind Speed & Direction</p>
      </div>

      <div className="wind-compass-container">
        {/* Wind stats */}
        <div className="wind-stats">
          <div className="wind-stat-card">
            <span className="wind-stat-label">Wind Speed</span>
            <span className="wind-stat-value">{windData.speed} km/h</span>
            <span
              className="wind-stat-condition"
              style={{ color: condition.color }}
            >
              {condition.label}
            </span>
          </div>
          <div className="wind-stat-card">
            <span className="wind-stat-label">Gusts</span>
            <span className="wind-stat-value">{windData.gusts} km/h</span>
          </div>
          <div className="wind-stat-card">
            <span className="wind-stat-label">Direction</span>
            <span className="wind-stat-value">{windData.directionName}</span>
            <span className="wind-stat-degrees">{windData.direction}°</span>
          </div>
        </div>

        {/* Compass */}
        <div className="wind-compass-circle-container">
          <div className="wind-compass-circle">
            {/* Outer ring */}
            <div className="compass-outer-ring"></div>

            {/* Cardinal directions */}
            <div className="compass-directions">
              {directions.map((dir) => (
                <div
                  key={dir.name}
                  className="compass-direction"
                  style={{
                    transform: `rotate(${dir.angle}deg) translateY(-140px)`,
                  }}
                >
                  <span
                    className={`direction-label ${
                      dir.angle === windData.direction ? "active" : ""
                    }`}
                    style={{ transform: `rotate(-${dir.angle}deg)` }}
                  >
                    {dir.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Tick marks */}
            <div className="compass-ticks">
              {[...Array(36)].map((_, i) => {
                const angle = i * 10;
                const isMajor = angle % 45 === 0;
                return (
                  <div
                    key={i}
                    className={`compass-tick ${isMajor ? "major" : "minor"}`}
                    style={{ transform: `rotate(${angle}deg)` }}
                  ></div>
                );
              })}
            </div>

            {/* Wind arrow */}
            <div
              className="wind-arrow"
              style={{ transform: `rotate(${windData.direction}deg)` }}
            >
              <div className="arrow-head"></div>
              <div className="arrow-tail"></div>
            </div>

            {/* Center dot */}
            <div className="compass-center">
              <div className="center-dot"></div>
              <div className="center-pulse"></div>
            </div>
          </div>
        </div>

        {/* Wind strength indicator */}
        <div className="wind-strength-bar">
          <div className="wind-strength-label">Wind Strength</div>
          <div className="wind-strength-track">
            <div
              className="wind-strength-fill"
              style={{
                width: `${Math.min((windData.speed / 50) * 100, 100)}%`,
                background: condition.color,
              }}
            ></div>
            <div className="wind-strength-markers">
              <span>0</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
              <span>50+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindCompass;
