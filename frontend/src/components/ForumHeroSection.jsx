import forumHeroImage from "../assets/images/forum-hero.webp";
import "./ForumHeroSection.css";

export default function ForumHeroSection() {
  return (
    <div
      className="forum-hero"
      style={{
        backgroundImage: `url(${forumHeroImage})`,
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
