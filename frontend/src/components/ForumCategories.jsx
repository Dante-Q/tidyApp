import { Link } from "react-router-dom";
import "./ForumCategories.css";

export default function ForumCategories({ categories, loading }) {
  const getCategoryInfo = (category) => {
    const info = {
      "surf-reports": {
        icon: "🌊",
        name: "Surf Reports",
        description:
          "Share and discuss surf conditions, wave forecasts, and session reports.",
      },
      "beach-safety": {
        icon: "🏖️",
        name: "Beach Safety",
        description:
          "Discuss safety tips, current conditions, and best practices for beach activities.",
      },
      "general-discussion": {
        icon: "🌅",
        name: "General Discussion",
        description:
          "Chat about anything related to Cape Town's beaches, events, and community.",
      },
      "events-meetups": {
        icon: "📅",
        name: "Events & Meetups",
        description:
          "Organize and join beach cleanups, surf sessions, and community events.",
      },
    };
    return info[category] || { icon: "📝", name: category, description: "" };
  };

  return (
    <div className="forum-categories">
      <div className="forum-categories-header">
        <h2>Forum Categories</h2>
        <p>Explore topics and join the conversation</p>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#fff" }}>
          Loading categories...
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((cat) => {
            const info = getCategoryInfo(cat.category);
            return (
              <Link
                key={cat.category}
                to={`/forum?category=${cat.category}`}
                className="category-card"
              >
                <div className="category-header">
                  <div className="category-icon">{info.icon}</div>
                  <h3 className="category-name">{info.name}</h3>
                </div>
                <p className="category-description">{info.description}</p>
                <div className="category-stats">
                  <span className="stat-item">
                    <strong>{cat.totalPosts}</strong> Posts
                  </span>
                  <span className="stat-divider">•</span>
                  <span className="stat-item">
                    <strong>{cat.totalComments}</strong> Comments
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
