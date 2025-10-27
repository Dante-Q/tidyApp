import "./InfoGrid.css";

export default function InfoGrid() {
  // Placeholder info data - replace with real data later
  const infoCards = [
    {
      id: 1,
      title: "Tide Times",
      description:
        "Check daily high and low tide schedules for all Cape Town beaches.",
      imageUrl:
        "https://via.placeholder.com/300x300/1e293b/6dd5ed?text=Tide+Times",
      link: "#",
    },
    {
      id: 2,
      title: "Weather Forecast",
      description:
        "7-day weather outlook including wind speed and temperature.",
      imageUrl:
        "https://via.placeholder.com/300x300/1e293b/6dd5ed?text=Weather",
      link: "#",
    },
    {
      id: 3,
      title: "Surf Report",
      description: "Live wave height, swell direction, and surf conditions.",
      imageUrl:
        "https://via.placeholder.com/300x300/1e293b/6dd5ed?text=Surf+Report",
      link: "#",
    },
    {
      id: 4,
      title: "Beach Safety",
      description:
        "Important safety tips and current water quality information.",
      imageUrl: "https://via.placeholder.com/300x300/1e293b/6dd5ed?text=Safety",
      link: "#",
    },
    {
      id: 5,
      title: "Water Temperature",
      description:
        "Current ocean temperatures and seasonal trends for your comfort.",
      imageUrl:
        "https://via.placeholder.com/300x300/1e293b/6dd5ed?text=Water+Temp",
      link: "#",
    },
    {
      id: 6,
      title: "Marine Life",
      description:
        "Discover what marine species you might encounter at local beaches.",
      imageUrl:
        "https://via.placeholder.com/300x300/1e293b/6dd5ed?text=Marine+Life",
      link: "#",
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
          <div key={card.id} className="info-card">
            <div
              className="info-card-image"
              style={{ backgroundImage: `url(${card.imageUrl})` }}
            />
            <div className="info-card-content">
              <h3 className="info-card-title">{card.title}</h3>
              <p className="info-card-description">{card.description}</p>
              <a href={card.link} className="info-card-link">
                Learn more →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
