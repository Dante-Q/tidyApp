import { useState } from "react";
import "./FavoritesWatchlist.css";

const FavoritesWatchlist = () => {
  // Mock favorite beaches data
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Muizenberg Beach",
      condition: "excellent",
      waveHeight: "1.8m",
      wind: "12 km/h SW",
      tide: "Rising",
      temp: "18°C",
      image:
        "https://via.placeholder.com/400x300/1e293b/6dd5ed?text=Muizenberg",
    },
    {
      id: 2,
      name: "Clifton 4th",
      condition: "good",
      waveHeight: "1.2m",
      wind: "8 km/h W",
      tide: "High",
      temp: "20°C",
      image: "https://via.placeholder.com/400x300/1e293b/6dd5ed?text=Clifton",
    },
    {
      id: 3,
      name: "Camps Bay",
      condition: "fair",
      waveHeight: "1.5m",
      wind: "18 km/h NW",
      tide: "Falling",
      temp: "19°C",
      image: "https://via.placeholder.com/400x300/1e293b/6dd5ed?text=Camps+Bay",
    },
  ]);

  const getConditionColor = (condition) => {
    const colors = {
      excellent: "#10b981",
      good: "#6dd5ed",
      fair: "#f59e0b",
      poor: "#ef4444",
    };
    return colors[condition] || "#6dd5ed";
  };

  const getConditionLabel = (condition) => {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  return (
    <div className="favorites-watchlist">
      <div className="favorites-header">
        <h2>My Favorites</h2>
        <p>Your watched beaches at a glance</p>
      </div>

      <div className="favorites-container">
        {favorites.length === 0 ? (
          <div className="favorites-empty">
            <span className="empty-icon">⭐</span>
            <h3>No favorites yet</h3>
            <p>Start adding beaches to your watchlist to see them here</p>
            <button className="add-favorites-btn">Browse Beaches</button>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((beach) => (
              <div key={beach.id} className="favorite-card">
                {/* Beach image */}
                <div
                  className="favorite-image"
                  style={{ backgroundImage: `url(${beach.image})` }}
                >
                  <div
                    className="favorite-condition-badge"
                    style={{ background: getConditionColor(beach.condition) }}
                  >
                    {getConditionLabel(beach.condition)}
                  </div>
                  <button
                    className="favorite-remove-btn"
                    onClick={() => handleRemoveFavorite(beach.id)}
                    title="Remove from favorites"
                  >
                    ✕
                  </button>
                </div>

                {/* Beach info */}
                <div className="favorite-content">
                  <h3 className="favorite-name">{beach.name}</h3>

                  <div className="favorite-stats">
                    <div className="favorite-stat">
                      <span className="stat-icon">🌊</span>
                      <div className="stat-info">
                        <span className="stat-label">Waves</span>
                        <span className="stat-value">{beach.waveHeight}</span>
                      </div>
                    </div>

                    <div className="favorite-stat">
                      <span className="stat-icon">💨</span>
                      <div className="stat-info">
                        <span className="stat-label">Wind</span>
                        <span className="stat-value">{beach.wind}</span>
                      </div>
                    </div>

                    <div className="favorite-stat">
                      <span className="stat-icon">🌡️</span>
                      <div className="stat-info">
                        <span className="stat-label">Temp</span>
                        <span className="stat-value">{beach.temp}</span>
                      </div>
                    </div>

                    <div className="favorite-stat">
                      <span className="stat-icon">📊</span>
                      <div className="stat-info">
                        <span className="stat-label">Tide</span>
                        <span className="stat-value">{beach.tide}</span>
                      </div>
                    </div>
                  </div>

                  <div className="favorite-actions">
                    <button className="favorite-action-btn primary">
                      View Details
                    </button>
                    <button className="favorite-action-btn secondary">
                      📷 Cam
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new button */}
        {favorites.length > 0 && (
          <div className="favorites-add-more">
            <button className="add-more-btn">
              <span className="add-icon">+</span>
              Add More Beaches
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesWatchlist;
