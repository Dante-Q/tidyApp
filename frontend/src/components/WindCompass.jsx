import "./WindCompass.css";

/**
 * WindCompass Component
 * Displays real-time wind speed, direction, gusts, and temperature with visual compass
 * @param {Object} props
 * @param {Object} props.weatherData - Current weather data from Open-Meteo API
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message if fetch failed
 * @param {string} props.selectedBeach - Currently selected beach
 * @param {Function} props.onBeachChange - Callback when beach selection changes
 */
const WindCompass = ({
  weatherData = null,
  loading = false,
  error = null,
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

  // Default/fallback data
  const defaultWindData = {
    speed: 0,
    direction: 0,
    gusts: 0,
    directionName: "N",
    temperature: 0,
    feelsLike: 0,
  };

  // Extract wind and temperature data from API response or use defaults
  const getWindData = () => {
    if (!weatherData?.current) return defaultWindData;

    const current = weatherData.current;
    const speed = Math.round(current.wind_speed_10m || 0);
    const direction = current.wind_direction_10m || 0;
    const gusts = Math.round(current.wind_gusts_10m || 0);
    const temperature = Math.round(current.temperature_2m || 0);
    const feelsLike = Math.round(current.apparent_temperature || 0);

    return {
      speed,
      direction,
      gusts,
      directionName: getDirectionName(direction),
      temperature,
      feelsLike,
    };
  };

  const windData = getWindData();

  // Convert degrees to cardinal direction
  function getDirectionName(degrees) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
  }

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

  // Get temperature color based on celsius
  const getTempColor = (temp) => {
    if (temp < 10) return "#6dd5ed"; // Cold - blue
    if (temp < 20) return "#10b981"; // Mild - green
    if (temp < 25) return "#f59e0b"; // Warm - orange
    return "#ef4444"; // Hot - red
  };

  const tempColor = getTempColor(windData.temperature);

  // Loading state
  if (loading) {
    return (
      <div className="wind-compass">
        <div className="wind-compass-header">
          <h2>Wind & Weather</h2>
          <p>Loading weather data...</p>
        </div>
        <div className="wind-compass-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="wind-compass">
        <div className="wind-compass-header">
          <h2>Wind & Weather</h2>
          <p style={{ color: "#ef4444" }}>Failed to load weather data</p>
        </div>
        <div className="wind-compass-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wind-compass">
      <div className="wind-compass-header">
        <h2>Wind & Weather</h2>
        <p>Current Conditions</p>
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

      <div className="wind-compass-container">
        {/* Wind & Temperature stats */}
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
          <div className="wind-stat-card">
            <span className="wind-stat-label">Temperature</span>
            <span className="wind-stat-value" style={{ color: tempColor }}>
              {windData.temperature}°C
            </span>
            <span className="wind-stat-degrees">
              Feels like {windData.feelsLike}°C
            </span>
          </div>
        </div>

        {/* Compass and Thermometer Grid */}
        <div className="compass-thermometer-grid">
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

          {/* Thermometer */}
          <div className="thermometer-container">
            <div className="thermometer-header">
              <h3>Temperature</h3>
              <div className="temp-display" style={{ color: tempColor }}>
                {windData.temperature}°C
              </div>
            </div>
            <div className="thermometer">
              <div className="thermometer-bulb">
                <div
                  className="thermometer-fill"
                  style={{
                    height: `${Math.min(
                      Math.max(((windData.temperature + 10) / 50) * 100, 0),
                      100
                    )}%`,
                    background: tempColor,
                  }}
                ></div>
              </div>
              <div className="thermometer-scale">
                <span className="temp-mark">40°</span>
                <span className="temp-mark">30°</span>
                <span className="temp-mark">20°</span>
                <span className="temp-mark">10°</span>
                <span className="temp-mark">0°</span>
                <span className="temp-mark">-10°</span>
              </div>
            </div>
            <div className="feels-like">
              Feels like <strong>{windData.feelsLike}°C</strong>
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
