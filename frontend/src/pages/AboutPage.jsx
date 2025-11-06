import { Link } from "react-router-dom";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div
        className="about-hero"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200)`,
        }}
      >
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <h1 className="about-title">About Tidy</h1>
            <p className="about-subtitle">
              Your comprehensive guide to Cape Town's beaches and coastal
              information
            </p>
          </div>
        </div>
      </div>

      {/* About Content */}
      <article className="about-article">
        <section className="about-section">
          <h2>🌊 What is Tidy?</h2>
          <p>
            Tidy is a comprehensive beach information platform dedicated to Cape
            Town's stunning coastline. We provide real-time updates, safety
            information, and a community-driven forum for beach lovers, surfers,
            and coastal enthusiasts.
          </p>
        </section>

        <section className="about-section">
          <h2>🎯 Our Mission</h2>
          <p>
            Our mission is to make Cape Town's beaches more accessible and safer
            for everyone. We believe that informed beachgoers are safer
            beachgoers, and that sharing local knowledge creates a stronger
            coastal community.
          </p>
        </section>

        <section className="about-section">
          <h2>✨ What We Offer</h2>
          <ul className="about-list">
            <li>
              <strong>Beach Information:</strong> Detailed guides for Cape
              Town's most popular beaches including Muizenberg, Bloubergstrand,
              Clifton, and more
            </li>
            <li>
              <strong>Real-time Data:</strong> Live tide times, weather
              forecasts, water temperature, and surf conditions
            </li>
            <li>
              <strong>Safety First:</strong> Beach safety information, marine
              life awareness, and emergency contact details
            </li>
            <li>
              <strong>Community Forum:</strong> Connect with other beach
              enthusiasts, share experiences, and get local insights
            </li>
            <li>
              <strong>Favorites & Watchlist:</strong> Save your favorite beaches
              and track conditions at a glance
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>🏖️ Featured Beaches</h2>
          <p>
            We cover Cape Town's most popular beaches, each with its own unique
            character and conditions:
          </p>
          <ul className="about-list">
            <li>
              <strong>Muizenberg:</strong> Perfect for beginner surfers and
              families
            </li>
            <li>
              <strong>Bloubergstrand:</strong> Stunning Table Mountain views and
              kitesurfing
            </li>
            <li>
              <strong>Clifton:</strong> Four beautiful beaches with calm waters
            </li>
            <li>
              <strong>Kalk Bay:</strong> Charming tidal pool and coastal walks
            </li>
            <li>
              <strong>Strand:</strong> Long sandy beach with warm waters
            </li>
            <li>
              <strong>Milnerton:</strong> Popular for windsurfing and dog walks
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>🤝 Join Our Community</h2>
          <p>
            Tidy is more than just a website—it's a community of people who love
            Cape Town's beaches. Join our forum to share your experiences, ask
            questions, and connect with fellow beachgoers. Whether you're a
            local or a visitor, everyone is welcome!
          </p>
        </section>

        <section className="about-section">
          <h2>📧 Get in Touch</h2>
          <p>
            Have questions, suggestions, or feedback? We'd love to hear from
            you. Connect with us through our forum or reach out directly.
          </p>
        </section>
      </article>

      {/* Quick Links */}
      <div className="about-links">
        <h3>Quick Links</h3>
        <div className="about-links-grid">
          <Link to="/forum" className="about-link-card">
            <span className="about-link-icon">💬</span>
            <span className="about-link-text">Community Forum</span>
          </Link>
          <Link to="/beach/muizenberg" className="about-link-card">
            <span className="about-link-icon">🏄</span>
            <span className="about-link-text">Explore Beaches</span>
          </Link>
          <Link to="/info/beach-safety" className="about-link-card">
            <span className="about-link-icon">⚠️</span>
            <span className="about-link-text">Safety Info</span>
          </Link>
          <Link to="/info/tide-times" className="about-link-card">
            <span className="about-link-icon">🌊</span>
            <span className="about-link-text">Tide Times</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
