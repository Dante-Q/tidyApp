import "./ForumHeroSection.css";

export default function ForumHeroSection() {
  return (
    <div
      className="forum-hero"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1611224885990-ab7363d1f2f3?w=1200)`,
      }}
    >
      <div className="forum-hero-overlay">
        <div className="forum-hero-content">
          <h1 className="forum-title">Community Forum</h1>
          <p className="forum-subtitle">
            Connect with the Tidy community, share experiences, and discuss all
            things surf, tide, and beach-related.
          </p>
        </div>
      </div>
    </div>
  );
}
