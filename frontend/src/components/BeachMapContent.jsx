import { useRef, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function BeachMapContent({
  beaches,
  beachTypes,
  mapStyle,
  popupInfo,
  onMarkerClick,
  onPopupButtonClick,
  onPopupClose,
}) {
  const mapRef = useRef();

  // Cape Town center coordinates
  const initialView = {
    longitude: 18.45,
    latitude: -33.95,
    zoom: 10,
  };

  // Fix tile rendering issues
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();

        const handleLoad = () => {
          // Wait a bit for tiles to start loading, then force re-render
          setTimeout(() => {
            map.resize();
            // Invalidate tiles by triggering a small zoom change
            const currentZoom = map.getZoom();
            map.easeTo({ zoom: currentZoom - 1.7, duration: 0.2 });
          }, 200);
        };

        if (map.loaded()) {
          handleLoad();
        } else {
          map.once("load", handleLoad);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Map
      ref={mapRef}
      initialViewState={initialView}
      mapStyle={mapStyle}
      attributionControl={true}
    >
      {Object.entries(beaches).map(([beachKey, beach]) => {
        const beachType = beachTypes[beachKey] || {
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
              onMarkerClick(beachKey, beach);
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
          onClose={onPopupClose}
          closeOnClick={false}
          className="custom-popup-wrapper"
        >
          <div className="custom-popup">
            <div className="popup-emoji">
              {beachTypes[popupInfo.beachKey]?.emoji || "📍"}
            </div>
            <h3>{popupInfo.beach.name}</h3>
            <button
              className="popup-button"
              onClick={() => onPopupButtonClick(popupInfo.beachKey)}
            >
              View Details →
            </button>
          </div>
        </Popup>
      )}
    </Map>
  );
}
