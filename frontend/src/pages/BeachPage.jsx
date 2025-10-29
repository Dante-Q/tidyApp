import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import WaveHeightGraph from "../components/WaveHeightGraph";
import useSurfData from "../hooks/useSurfData";
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

  // Fetch surf data for selected beach
  const { data: surfData, loading, error } = useSurfData(selectedBeach);

  // Beach information
  const beachInfo = {
    muizenberg: {
      name: "Muizenberg",
      description:
        "Famous for its long sandy beach and consistent surf, Muizenberg is perfect for beginners and a Cape Town surf icon.",
      image:
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
      features: [
        "Beginner Friendly",
        "Consistent Waves",
        "Surf Schools",
        "Shark Spotters",
      ],
      coordinates: { lat: -34.105, lon: 18.472 },
    },
    bloubergstrand: {
      name: "Bloubergstrand",
      description:
        "Offers spectacular views of Table Mountain and is known for strong winds, making it ideal for kitesurfing and windsurfing.",
      image:
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
      features: [
        "Kitesurfing",
        "Windsurfing",
        "Table Mountain Views",
        "Strong Winds",
      ],
      coordinates: { lat: -33.808, lon: 18.464 },
    },
    strand: {
      name: "Strand",
      description:
        "A long stretch of beach in False Bay, popular with families and surfers alike.",
      image:
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
      features: [
        "Family Friendly",
        "Long Beach",
        "Warm Water",
        "Safe Swimming",
      ],
      coordinates: { lat: -34.11, lon: 18.827 },
    },
    clifton: {
      name: "Clifton",
      description:
        "Four pristine beaches sheltered from wind, known for clear blue water and white sand. Popular with sunbathers.",
      image:
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
      features: ["Sheltered", "Clear Water", "White Sand", "Sunbathing"],
      coordinates: { lat: -33.951, lon: 18.377 },
    },
    kalkbay: {
      name: "Kalk Bay",
      description:
        "A charming harbor town with a tidal pool and rocky coastline, offering unique surf breaks.",
      image:
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
      features: [
        "Tidal Pool",
        "Rocky Breaks",
        "Harbor Views",
        "Fishing Village",
      ],
      coordinates: { lat: -34.127, lon: 18.449 },
    },
    milnerton: {
      name: "Milnerton",
      description:
        "Wide open beach with consistent waves and stunning sunset views over Table Bay.",
      image:
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
      features: ["Consistent Waves", "Sunset Views", "Open Beach", "Table Bay"],
      coordinates: { lat: -33.885, lon: 18.495 },
    },
  };

  const beach = beachInfo[selectedBeach] || beachInfo.muizenberg;

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

      {/* Additional Info */}
      <section className="beach-info-grid">
        <div className="info-card">
          <h3>📍 Location</h3>
          <p>Latitude: {beach.coordinates.lat}</p>
          <p>Longitude: {beach.coordinates.lon}</p>
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
