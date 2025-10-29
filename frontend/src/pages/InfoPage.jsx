import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { infoArticles } from "../data/infoArticles.js";
import "./InfoPage.css";

export default function InfoPage() {
  const { infoSlug } = useParams();
  const [currentInfo, setCurrentInfo] = useState(null);

  // Update content when slug changes
  useEffect(() => {
    if (infoSlug && infoArticles[infoSlug]) {
      setCurrentInfo(infoArticles[infoSlug]);
    } else {
      setCurrentInfo(null);
    }
  }, [infoSlug]);

  if (!currentInfo) {
    return (
      <div className="info-page">
        <div className="info-page-error">
          <h1>Article Not Found</h1>
          <p>The article you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="info-page">
      {/* Hero Section */}
      <div
        className="info-hero"
        style={{ backgroundImage: `url(${currentInfo.image})` }}
      >
        <div className="info-hero-overlay">
          <div className="info-hero-content">
            <h1 className="info-title">{currentInfo.title}</h1>
            <p className="info-subtitle">{currentInfo.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="info-article">
        {currentInfo.content.map((section, index) => (
          <section key={`section-${index}`} className="info-section">
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </article>

      {/* Related Info */}
      <div className="info-related">
        <h3>Related Information</h3>
        <div className="info-related-links">
          {Object.keys(infoArticles)
            .filter((key) => key !== infoSlug)
            .slice(0, 3)
            .map((key) => (
              <Link key={key} to={`/info/${key}`} className="info-related-link">
                {infoArticles[key].title} →
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
