import { useState } from "react";
import "./BeachMap.css";

export default function BeachMap() {
  const [selectedBeach, setSelectedBeach] = useState(null);

  // Beach locations (placeholder positions - adjust for real coordinates)
  const beaches = [
    {
      id: 1,
      name: "Muizenberg",
      position: { top: "65%", left: "55%" },
      description: "Popular beginner surf spot with gentle waves",
      condition: "Good",
    },
    {
      id: 2,
      name: "Long Beach",
      position: { top: "50%", left: "25%" },
      description: "Consistent waves, great for experienced surfers",
      condition: "Excellent",
    },
    {
      id: 3,
      name: "Big Bay",
      position: { top: "20%", left: "30%" },
      description: "Kitesurfing paradise with strong winds",
      condition: "Fair",
    },
    {
      id: 4,
      name: "Clifton",
      position: { top: "45%", left: "40%" },
      description: "Sheltered beach, perfect for swimming",
      condition: "Good",
    },
    {
      id: 5,
      name: "Camps Bay",
      position: { top: "40%", left: "38%" },
      description: "Beautiful beach with mountain backdrop",
      condition: "Good",
    },
  ];

  const getConditionColor = (condition) => {
    switch (condition) {
      case "Excellent":
        return "#10b981"; // green
      case "Good":
        return "#6dd5ed"; // teal
      case "Fair":
        return "#f59e0b"; // orange
      case "Poor":
        return "#ef4444"; // red
      default:
        return "#6dd5ed";
    }
  };

  return (
    <div className="beach-map">
      <div className="beach-map-header">
        <h2>Beach Locations</h2>
        <p>Select a beach to view details</p>
      </div>

      <div className="beach-map-container">
        {/* Map Background */}
        <div className="beach-map-canvas">
          <div className="map-placeholder">
            <span className="map-placeholder-text">Cape Town Coastline</span>
          </div>

          {/* Beach Markers */}
          {beaches.map((beach) => (
            <button
              key={beach.id}
              className={`beach-marker ${
                selectedBeach?.id === beach.id ? "active" : ""
              }`}
              style={{
                top: beach.position.top,
                left: beach.position.left,
                backgroundColor: getConditionColor(beach.condition),
              }}
              onClick={() => setSelectedBeach(beach)}
              aria-label={`Select ${beach.name}`}
            >
              <span className="beach-marker-dot"></span>
              <span className="beach-marker-label">{beach.name}</span>
            </button>
          ))}
        </div>

        {/* Info Panel */}
        {selectedBeach && (
          <div className="beach-map-info">
            <button
              className="beach-map-info-close"
              onClick={() => setSelectedBeach(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h3>{selectedBeach.name}</h3>
            <div className="beach-map-info-condition">
              <span
                className="condition-indicator"
                style={{
                  backgroundColor: getConditionColor(selectedBeach.condition),
                }}
              ></span>
              <span>{selectedBeach.condition}</span>
            </div>
            <p>{selectedBeach.description}</p>
            <button className="beach-map-info-button">View Details</button>
          </div>
        )}
      </div>
    </div>
  );
}
