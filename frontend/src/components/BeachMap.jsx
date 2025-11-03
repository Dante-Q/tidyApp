import { useState, useRef } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";
import { beaches } from "../config/beachApiConfig";
import mapStyle from "../assets/mapStyle.json";
import "maplibre-gl/dist/maplibre-gl.css";
import "./BeachMap.css";

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
  const mapRef = useRef();
  const [popupInfo, setPopupInfo] = useState(null);

  // Cape Town center coordinates
  const initialView = {
    longitude: 18.45,
    latitude: -33.95,
    zoom: 10,
  };

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
        <Map
          ref={mapRef}
          initialViewState={initialView}
          mapStyle={mapStyle}
          attributionControl={true}
        >
          {Object.entries(beaches).map(([beachKey, beach]) => {
            const beachType = BEACH_TYPES[beachKey] || {
              emoji: "📍",
              color: "#6dd5ed",
            };

            return (
              <Marker
                key={beachKey}
                longitude={beach.coordinates.lon}
                latitude={beach.coordinates.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick(beachKey, beach);
                }}
              >
                <div
                  className="custom-marker"
                  style={{ "--marker-color": beachType.color }}
                >
                  <div className="marker-pin">
                    <svg
                      width="32"
                      height="40"
                      viewBox="0 0 32 40"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z"
                        fill="var(--marker-color)"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      <circle cx="16" cy="16" r="6" fill="#fff" />
                    </svg>
                  </div>
                  <div className="marker-emoji">{beachType.emoji}</div>
                </div>
              </Marker>
            );
          })}

          {popupInfo && (
            <Popup
              longitude={popupInfo.beach.coordinates.lon}
              latitude={popupInfo.beach.coordinates.lat}
              anchor="top"
              onClose={() => setPopupInfo(null)}
              closeOnClick={false}
              className="custom-popup-wrapper"
            >
              <div className="custom-popup">
                <div className="popup-emoji">
                  {BEACH_TYPES[popupInfo.beachKey]?.emoji || "📍"}
                </div>
                <h3>{popupInfo.beach.name}</h3>
                <button
                  className="popup-button"
                  onClick={() => handlePopupButtonClick(popupInfo.beachKey)}
                >
                  View Details →
                </button>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}
