import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { beaches } from "../config/beachApiConfig";
import mapStyle from "../assets/mapStyle.json";
import "./BeachMap.css";

// Lazy load the entire map component as a single chunk
const LazyMapComponent = lazy(() => import("./BeachMapContent.jsx"));

// Beach type mapping with unique colors and emojis
const BEACH_TYPES = {
  muizenberg: { emoji: "🏄‍♂️", color: "#3b82f6" },
  bloubergstrand: { emoji: "🪁", color: "#06b6d4" },
  strand: { emoji: "🏊‍♂️", color: "#0ea5e9" },
  clifton: { emoji: "🌴", color: "#8b5cf6" },
  kalkbay: { emoji: "⛵", color: "#6366f1" },
  milnerton: { emoji: "🪁", color: "#14b8a6" },
};

export default function BeachMap({ onBeachSelect }) {
  const navigate = useNavigate();
  const [popupInfo, setPopupInfo] = useState(null);

  const handleMarkerClick = (beachKey, beach) => {
    setPopupInfo({ beachKey, beach });
  };

  const handlePopupButtonClick = (beachKey) => {
    if (onBeachSelect) {
      onBeachSelect(beachKey);
    } else {
      navigate(`/beach/${beachKey}`);
    }
    setPopupInfo(null);
  };

  return (
    <div className="beach-map-wrapper">
      <div className="beach-map-header">
        <h2>
          <span className="map-icon">🗺️</span>
          Beach Locations
        </h2>
        <p>Click a marker to view beach details</p>
      </div>

      <div className="beach-map-container">
        <Suspense
          fallback={
            <div className="map-loading">
              <div className="loading-spinner"></div>
              <p>Loading map...</p>
            </div>
          }
        >
          <LazyMapComponent
            beaches={beaches}
            beachTypes={BEACH_TYPES}
            mapStyle={mapStyle}
            popupInfo={popupInfo}
            onMarkerClick={handleMarkerClick}
            onPopupButtonClick={handlePopupButtonClick}
            onPopupClose={() => setPopupInfo(null)}
          />
        </Suspense>
      </div>
    </div>
  );
}
