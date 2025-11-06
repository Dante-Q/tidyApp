import { useState } from "react";
import TideChart from "../components/TideChart";
import WaveHeightGraph from "../components/WaveHeightGraph";
import useMarineData from "../hooks/useMarineData";
import "./ToolsPage.css";

export default function TidesPage() {
  const [selectedBeach, setSelectedBeach] = useState("muizenberg");

  // Fetch marine data for wave height chart
  const {
    hourly: surfData,
    loading: surfLoading,
    error: surfError,
  } = useMarineData(selectedBeach);

  return (
    <div className="tools-page">
      <div className="tools-hero">
        <h1 className="tools-title">
          <span className="hero-emoji">🌊</span> Tides & Wave Heights
        </h1>
        <p className="tools-description">
          Understanding ocean patterns for Cape Town beaches
        </p>
      </div>

      <div className="tools-content">
        {/* Tide Chart */}
        <div className="chart-section">
          <h2>Tide Predictions</h2>
          <TideChart
            selectedBeach={selectedBeach}
            onBeachChange={setSelectedBeach}
          />
        </div>

        {/* Wave Height Chart */}
        <div className="chart-section">
          <h2>Wave Height Forecast</h2>
          <WaveHeightGraph
            surfData={surfData}
            loading={surfLoading}
            error={surfError}
            selectedBeach={selectedBeach}
            onBeachChange={setSelectedBeach}
          />
        </div>

        {/* Educational Content */}
        <div className="tide-education-section">
          <h2>Understanding Tides and Wave Heights</h2>

          <div className="education-grid">
            <div className="education-card">
              <h3>🌙 What Are Tides?</h3>
              <p>
                Tides are the periodic rise and fall of sea levels caused by the
                gravitational forces exerted by the Moon and Sun on Earth's
                oceans. As the Earth rotates, different areas experience these
                gravitational pulls, creating a predictable pattern of high and
                low tides.
              </p>
            </div>

            <div className="education-card">
              <h3>🔄 The Tidal Cycle</h3>
              <p>
                Most coastal areas experience two high tides and two low tides
                each day, approximately 12 hours and 25 minutes apart. This
                semi-diurnal pattern occurs because the Earth rotates beneath
                two tidal "bulges" created by the Moon's gravitational pull on
                opposite sides of the planet.
              </p>
            </div>

            <div className="education-card">
              <h3>🌕 Monthly Variations</h3>
              <p>
                <strong>Spring Tides:</strong> Occur during new and full moons
                when the Sun, Moon, and Earth align. These produce the highest
                high tides and lowest low tides, with a tidal range of
                approximately 1.5-2.0 meters in Cape Town.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                <strong>Neap Tides:</strong> Happen during quarter moons when
                the Sun and Moon are at right angles. These create more moderate
                tides with smaller ranges of about 0.8-1.2 meters, occurring
                roughly every two weeks.
              </p>
            </div>

            <div className="education-card">
              <h3>🌊 Wave Height vs Tides</h3>
              <p>
                Wave height and tides are separate phenomena. While tides change
                the water level at the beach, wave height is determined by wind
                speed, fetch (distance wind blows over water), and swell period.
                The best surf conditions often occur when wave swells coincide
                with optimal tide levels for each specific break.
              </p>
            </div>

            <div className="education-card">
              <h3>⏰ Tidal Influence on Surfing</h3>
              <p>
                Different surf breaks work best at different tide stages. Some
                spots perform better at high tide when deeper water allows waves
                to break cleanly, while others need low tide to expose reefs or
                sandbars. Mid-tide transitions often provide the most consistent
                conditions as water flows create optimal wave formation.
              </p>
            </div>

            <div className="education-card">
              <h3>📊 Reading the Data</h3>
              <p>
                <strong>Tide Heights:</strong> Measured in meters above chart
                datum (a reference point below the lowest astronomical tide).
                Heights above 1.5m indicate high tide, while below 0.5m
                indicates low tide for Cape Town.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                <strong>Wave Period:</strong> The time between successive wave
                crests. Longer periods (12+ seconds) typically indicate powerful
                ocean swells, while shorter periods suggest local wind-generated
                waves.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
