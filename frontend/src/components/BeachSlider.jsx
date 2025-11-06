import { useState } from "react";
import { Link } from "react-router-dom";
import useMarineData from "../hooks/useMarineData";
import useWeatherData from "../hooks/useWeatherData";
import "./BeachSlider.css";

// Import beach images
import muizenbergImg from "../assets/images/hongbin-muizenberg.jpg";
import bloubergImg from "../assets/images/tobie-esterhuyzen-blouberg.jpg";
import cliftonImg from "../assets/images/jean-baptiste-clifton.jpg";
import kalkbayImg from "../assets/images/david-watkis-kalkbay.jpg";
import milnertonImg from "../assets/images/sam-wermut-misc.jpg";
import strandImg from "../assets/images/untitled-photo-misc.jpg";

// Beach configuration with images
const beachConfig = [
  { id: "kalkbay", name: "Kalk Bay", imageUrl: kalkbayImg },
  { id: "clifton", name: "Clifton", imageUrl: cliftonImg },
  { id: "bloubergstrand", name: "Bloubergstrand", imageUrl: bloubergImg },
  { id: "milnerton", name: "Milnerton", imageUrl: milnertonImg },
  { id: "muizenberg", name: "Muizenberg", imageUrl: muizenbergImg },
  { id: "strand", name: "Strand", imageUrl: strandImg },
];

// Component for individual beach card with data fetching
function BeachCard({ beach }) {
  const { current: marineData } = useMarineData(beach.id);
  const { current: weatherData } = useWeatherData(beach.id);

  // Calculate condition based on wave height and wind speed
  const getCondition = () => {
    if (!marineData || !weatherData) return "Loading...";

    const waveHeight = marineData.wave_height || 0;
    const windSpeed = weatherData.wind_speed_10m || 0;

    // Simple condition logic - can be customized
    if (waveHeight > 1.5 && windSpeed < 15) return "Excellent";
    if (waveHeight > 1.0 && windSpeed < 20) return "Good";
    return "Fair";
  };

  const waveHeight = marineData?.wave_height
    ? `${marineData.wave_height.toFixed(1)}m`
    : "...";
  const windSpeed = weatherData?.wind_speed_10m
    ? `${Math.round(weatherData.wind_speed_10m)} km/h`
    : "...";

  return (
    <Link to={`/beach/${beach.id}`} className="conditions-card-link">
      <div className="conditions-card">
        <div
          className="conditions-card-image"
          style={{ backgroundImage: `url(${beach.imageUrl})` }}
        >
          <div className="conditions-card-badge">{getCondition()}</div>
        </div>
        <div className="conditions-card-content">
          <h3 className="conditions-card-title">{beach.name}</h3>
          <div className="conditions-card-stats">
            <div className="conditions-stat">
              <span className="conditions-stat-label">Wave Height</span>
              <span className="conditions-stat-value">{waveHeight}</span>
            </div>
            <div className="conditions-stat">
              <span className="conditions-stat-label">Wind Speed</span>
              <span className="conditions-stat-value">{windSpeed}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BeachSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % beachConfig.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + beachConfig.length) % beachConfig.length
    );
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
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Cards Track */}
        <div className="beach-slider-track">
          <div
            className="beach-slider-cards"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {beachConfig.map((beach) => (
              <BeachCard key={beach.id} beach={beach} />
            ))}
          </div>
        </div>

        {/* Navigation Arrow Right */}
        <button
          className="beach-slider-arrow beach-slider-arrow-right"
          onClick={nextSlide}
          aria-label="Next beach"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="beach-slider-dots">
        {beachConfig.map((_, index) => (
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
