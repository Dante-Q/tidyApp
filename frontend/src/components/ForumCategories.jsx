import { Link } from "react-router-dom";
import FORUM_CATEGORIES from "../config/forumCategories.js";
import "./ForumCategories.css";

export default function ForumCategories({ categories, loading }) {
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
          {FORUM_CATEGORIES.map((category) => {
            // Find stats for this category from the API data
            const stats = categories.find(
              (cat) => cat.category === category.slug
            ) || {
              totalPosts: 0,
              totalComments: 0,
            };

            return (
              <Link
                key={category.slug}
                to={`/forum/category/${category.slug}`}
                className="category-card"
              >
                <div className="category-header">
                  <div className="category-icon">{category.icon}</div>
                  <h3 className="category-name">{category.name}</h3>
                </div>
                <p className="category-description">{category.description}</p>

                {/* Show subcategories */}
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <div className="subcategories-list">
                      {category.subcategories.slice(0, 3).map((sub) => (
                        <span key={sub.slug} className="subcategory-tag">
                          {sub.icon} {sub.name}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="subcategory-more">
                          +{category.subcategories.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                <div className="category-stats">
                  <span className="stat-item">
                    <strong>{stats.totalPosts}</strong> Posts
                  </span>
                  <span className="stat-divider">•</span>
                  <span className="stat-item">
                    <strong>{stats.totalComments}</strong> Comments
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
