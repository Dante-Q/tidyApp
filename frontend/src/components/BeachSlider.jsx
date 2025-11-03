import { useState } from "react";
import "./BeachSlider.css";

// Import beach images
import muizenbergImg from "../assets/images/hongbin-muizenberg.jpg";
import bloubergImg from "../assets/images/tobie-esterhuyzen-blouberg.jpg";
import cliftonImg from "../assets/images/jean-baptiste-clifton.jpg";
import kalkbayImg from "../assets/images/david-watkis-kalkbay.jpg";

export default function BeachSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Placeholder beach data - replace with real data later
  const beaches = [
    {
      id: 1,
      name: "Muizenberg",
      condition: "Good",
      waveHeight: "1.2m",
      windSpeed: "15 km/h",
      imageUrl: muizenbergImg,
    },
    {
      id: 2,
      name: "Bloubergstrand",
      condition: "Excellent",
      waveHeight: "1.8m",
      windSpeed: "10 km/h",
      imageUrl: bloubergImg,
    },
    {
      id: 3,
      name: "Clifton",
      condition: "Fair",
      waveHeight: "0.9m",
      windSpeed: "20 km/h",
      imageUrl: cliftonImg,
    },
    {
      id: 4,
      name: "Kalk Bay",
      condition: "Good",
      waveHeight: "1.0m",
      windSpeed: "18 km/h",
      imageUrl: kalkbayImg,
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % beaches.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + beaches.length) % beaches.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="beach-slider">
      <div className="beach-slider-header">
        <h2>Beach Conditions</h2>
        <p>Current surf and weather updates</p>
      </div>

      <div className="beach-slider-container">
        {/* Navigation Arrows */}
        <button
          className="beach-slider-arrow beach-slider-arrow-left"
          onClick={prevSlide}
          aria-label="Previous beach"
        >
          ‹
        </button>

        {/* Cards Track */}
        <div className="beach-slider-track">
          <div
            className="beach-slider-cards"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {beaches.map((beach) => (
              <div key={beach.id} className="beach-card">
                <div
                  className="beach-card-image"
                  style={{ backgroundImage: `url(${beach.imageUrl})` }}
                >
                  <div className="beach-card-condition">{beach.condition}</div>
                </div>
                <div className="beach-card-content">
                  <h3 className="beach-card-title">{beach.name}</h3>
                  <div className="beach-card-stats">
                    <div className="beach-stat">
                      <span className="beach-stat-label">Wave Height</span>
                      <span className="beach-stat-value">
                        {beach.waveHeight}
                      </span>
                    </div>
                    <div className="beach-stat">
                      <span className="beach-stat-label">Wind Speed</span>
                      <span className="beach-stat-value">
                        {beach.windSpeed}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrow Right */}
        <button
          className="beach-slider-arrow beach-slider-arrow-right"
          onClick={nextSlide}
          aria-label="Next beach"
        >
          ›
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="beach-slider-dots">
        {beaches.map((_, index) => (
          <button
            key={index}
            className={`beach-slider-dot ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
