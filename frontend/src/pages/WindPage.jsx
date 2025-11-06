import { useState } from "react";
import WindCompass from "../components/WindCompass";
import useWeatherData from "../hooks/useWeatherData";
import "./ToolsPage.css";

export default function WindPage() {
  const [selectedBeach, setSelectedBeach] = useState("muizenberg");
  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
  } = useWeatherData(selectedBeach);

  return (
    <div className="tools-page">
      <div className="tools-hero">
        <h1 className="tools-title">
          <span className="hero-emoji">💨</span> Wind Conditions
        </h1>
        <p className="tools-description">
          Live wind speed, direction, and gusts for Cape Town beaches
        </p>
      </div>

      <div className="tools-content">
        <WindCompass
          weatherData={weatherData}
          loading={weatherLoading}
          error={weatherError}
          selectedBeach={selectedBeach}
          onBeachChange={setSelectedBeach}
        />
      </div>
    </div>
  );
}
