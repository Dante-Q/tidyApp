import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FORUM_CATEGORIES from "../config/forumCategories.js";
import "./ForumCategories.css";

export default function ForumCategories({ posts, loading }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const subCategoryLimit = isMobile ? 1 : 3;

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
            // Count posts for this category
            const postCount = posts.filter(
              (post) => post.category === category.slug
            ).length;

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
                      {category.subcategories
                        .slice(0, subCategoryLimit)
                        .map((sub) => (
                          <span key={sub.slug} className="subcategory-tag">
                            {sub.icon} {sub.name}
                          </span>
                        ))}
                      {category.subcategories.length > subCategoryLimit && (
                        <span className="subcategory-more">
                          +{category.subcategories.length - subCategoryLimit}{" "}
                          more
                        </span>
                      )}
                    </div>
                  )}

                <div className="category-stats">
                  <span className="stat-badge">
                    {postCount} {postCount === 1 ? "post" : "posts"}
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
