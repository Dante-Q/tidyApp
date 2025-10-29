import { Link } from "react-router-dom";
import "./InfoGrid.css";

export default function InfoGrid() {
  // Info card data linked to InfoPage articles
  const infoCards = [
    {
      id: 1,
      title: "Tide Times",
      description:
        "Check daily high and low tide schedules for all Cape Town beaches.",
      imageUrl:
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80&fit=crop",
      slug: "tide-times",
    },
    {
      id: 2,
      title: "Weather Forecast",
      description:
        "7-day weather outlook including wind speed and temperature.",
      imageUrl:
        "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80&fit=crop",
      slug: "weather-forecast",
    },
    {
      id: 3,
      title: "Surf Report",
      description: "Live wave height, swell direction, and surf conditions.",
      imageUrl:
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80&fit=crop",
      slug: "surf-report",
    },
    {
      id: 4,
      title: "Beach Safety",
      description:
        "Important safety tips and current water quality information.",
      imageUrl:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&fit=crop",
      slug: "beach-safety",
    },
    {
      id: 5,
      title: "Water Temperature",
      description:
        "Current ocean temperatures and seasonal trends for your comfort.",
      imageUrl:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80&fit=crop",
      slug: "water-temperature",
    },
    {
      id: 6,
      title: "Marine Life",
      description:
        "Discover what marine species you might encounter at local beaches.",
      imageUrl:
        "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&q=80&fit=crop",
      slug: "marine-life",
    },
  ];

  return (
    <div className="info-grid">
      <div className="info-grid-header">
        <h2>Beach Information</h2>
        <p>Everything you need to know before you go</p>
      </div>

      <div className="info-grid-container">
        {infoCards.map((card) => (
          <Link key={card.id} to={`/info/${card.slug}`} className="info-card">
            <div
              className="info-card-image"
              style={{ backgroundImage: `url(${card.imageUrl})` }}
            />
            <div className="info-card-content">
              <h3 className="info-card-title">{card.title}</h3>
              <p className="info-card-description">{card.description}</p>
              <div className="info-card-link">
                Learn more
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
