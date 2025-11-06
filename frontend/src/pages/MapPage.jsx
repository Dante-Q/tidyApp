import BeachMap from "../components/BeachMap";
import "./ToolsPage.css";

export default function MapPage() {
  return (
    <div className="tools-page">
      <div className="tools-hero">
        <h1 className="tools-title">
          <span className="hero-emoji">🗺️</span> Beach Map
        </h1>
        <p className="tools-description">
          Interactive map of Cape Town beaches with conditions
        </p>
      </div>

      <div className="tools-content tools-content-map">
        <BeachMap />
      </div>
    </div>
  );
}
