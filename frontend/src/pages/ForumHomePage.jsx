import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategoryStats, getPosts } from "../services/forumService.js";
import "./ForumHomePage.css";

export default function ForumHomePage() {
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, postsRes] = await Promise.all([
        getCategoryStats(),
        getPosts({ limit: 5, sortBy: "createdAt" }),
      ]);

      console.log("Categories response:", categoriesRes);
      console.log("Posts response:", postsRes);

      setCategories(categoriesRes.data || []);
      setRecentPosts(postsRes.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching forum data:", err);
      setCategories([]);
      setRecentPosts([]);
      setLoading(false);
    }
  };

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

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="forum-page">
      {/* Hero Section */}
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
              Connect with the Tidy community, share experiences, and discuss
              all things surf, tide, and beach-related.
            </p>
          </div>
        </div>
      </div>

      {/* Forum Content */}
      <section className="forum-content">
        <div className="forum-container">
          {/* Categories Section */}
          <div className="forum-categories">
            <div className="forum-categories-header">
              <h2>Forum Categories</h2>
              <p>Explore topics and join the conversation</p>
            </div>
            {loading ? (
              <div
                style={{ textAlign: "center", padding: "2rem", color: "#fff" }}
              >
                Loading categories...
              </div>
            ) : (
              <div className="categories-grid">
                {categories && categories.length > 0 ? (
                  categories.map((cat) => {
                    const info = getCategoryInfo(cat._id);
                    return (
                      <Link
                        key={cat._id}
                        to={`/forum?category=${cat._id}`}
                        className="category-card"
                      >
                        <div className="category-header">
                          <div className="category-icon">{info.icon}</div>
                          <h3 className="category-name">{info.name}</h3>
                        </div>
                        <p className="category-description">{info.description}</p>
                        <div className="category-stats">
                          <span className="stat-item">
                            <strong>{cat.postCount}</strong> Posts
                          </span>
                          <span className="stat-divider">•</span>
                          <span className="stat-item">
                            <strong>{cat.totalComments}</strong> Comments
                          </span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#fff" }}>
                    No categories available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Activity Section */}
          <div className="forum-recent">
            <h2 className="section-title">Recent Activity</h2>
            {loading ? (
              <div
                style={{ textAlign: "center", padding: "2rem", color: "#fff" }}
              >
                Loading posts...
              </div>
            ) : recentPosts.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "2rem", color: "#fff" }}
              >
                No posts yet. Be the first to start a discussion!
              </div>
            ) : (
              <div className="recent-posts">
                {recentPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/forum/post/${post._id}`}
                    className="post-preview"
                  >
                    <div className="post-avatar">
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="post-info">
                      <h4 className="post-title">{post.title}</h4>
                      <p className="post-meta">
                        Posted by <strong>{post.author.name}</strong> •{" "}
                        {formatTimeAgo(post.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Create Post Button */}
          <div className="forum-actions">
            <Link to="/forum/create-post">
              <button className="create-post-btn">
                <span>✍️</span>
                Create New Post
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
