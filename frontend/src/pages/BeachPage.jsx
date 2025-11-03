import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import WaveHeightGraph from "../components/WaveHeightGraph";
import WindCompass from "../components/WindCompass";
import useMarineData from "../hooks/useMarineData";
import useWeatherData from "../hooks/useWeatherData";
import { beaches } from "../config/beachApiConfig.js";
import { beachInfo } from "../data/beachInfo.js";
import "./BeachPage.css";

export default function BeachPage() {
  const { beachName } = useParams();
  const [selectedBeach, setSelectedBeach] = useState(beachName || "muizenberg");

  // Update selectedBeach when route parameter changes
  useEffect(() => {
    if (beachName) {
      setSelectedBeach(beachName);
    }
  }, [beachName]);

  // Fetch marine data for selected beach
  const { data: surfData, loading, error } = useMarineData(selectedBeach);

  // Fetch weather data for selected beach
  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
  } = useWeatherData(selectedBeach);

  const beach = beachInfo[selectedBeach] || beachInfo.muizenberg;
  const beachConfig = beaches[selectedBeach] || beaches.muizenberg;

  return (
    <div className="beach-page">
      {/* Hero Section */}
      <div
        className="beach-hero"
        style={{ backgroundImage: `url(${beach.image})` }}
      >
        <div className="beach-hero-overlay">
          <div className="beach-hero-content">
            <h1 className="beach-title">{beach.name}</h1>
            <p className="beach-description">{beach.description}</p>
          </div>
        </div>
      </div>

      {/* Beach Features */}
      <section className="beach-features">
        <div className="features-container">
          <h2>Beach Features</h2>
          <div className="features-grid">
            {beach.features.map((feature, index) => (
              <div key={index} className="feature-card">
                <span className="feature-icon">🏄‍♂️</span>
                <span className="feature-text">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Surf Forecast */}
      <section className="beach-forecast">
        <WaveHeightGraph
          surfData={surfData}
          loading={loading}
          error={error}
          selectedBeach={selectedBeach}
          onBeachChange={setSelectedBeach}
        />
      </section>

      {/* Wind & Weather */}
      <section className="beach-forecast">
        <WindCompass
          weatherData={weatherData}
          loading={weatherLoading}
          error={weatherError}
          selectedBeach={selectedBeach}
          onBeachChange={setSelectedBeach}
        />
      </section>

      {/* Additional Info */}
      <section className="beach-info-grid">
        <div className="info-card">
          <h3>📍 Location</h3>
          <p>Latitude: {beachConfig.coordinates.lat}</p>
          <p>Longitude: {beachConfig.coordinates.lon}</p>
        </div>
        <div className="info-card">
          <h3>🌊 Best Conditions</h3>
          <p>Check the forecast above for optimal surf times</p>
        </div>
        <div className="info-card">
          <h3>⚠️ Safety</h3>
          <p>Always check local conditions and obey safety flags</p>
        </div>
      </section>
    </div>
  );
}
