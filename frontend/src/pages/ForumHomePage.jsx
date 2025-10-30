import "./ForumHomePage.css";

export default function ForumHomePage() {
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
            <div className="categories-grid">
              <div className="category-card">
                <div className="category-header">
                  <div className="category-icon">🌊</div>
                  <h3 className="category-name">Surf Reports</h3>
                </div>
                <p className="category-description">
                  Share and discuss surf conditions, wave forecasts, and session
                  reports.
                </p>
                <div className="category-stats">
                  <span className="stat-item">
                    <strong>42</strong> Topics
                  </span>
                  <span className="stat-divider">•</span>
                  <span className="stat-item">
                    <strong>128</strong> Posts
                  </span>
                </div>
              </div>

              <div className="category-card">
                <div className="category-header">
                  <div className="category-icon">🏖️</div>
                  <h3 className="category-name">Beach Safety</h3>
                </div>
                <p className="category-description">
                  Discuss safety tips, current conditions, and best practices
                  for beach activities.
                </p>
                <div className="category-stats">
                  <span className="stat-item">
                    <strong>18</strong> Topics
                  </span>
                  <span className="stat-divider">•</span>
                  <span className="stat-item">
                    <strong>64</strong> Posts
                  </span>
                </div>
              </div>

              <div className="category-card">
                <div className="category-header">
                  <div className="category-icon">🌅</div>
                  <h3 className="category-name">General Discussion</h3>
                </div>
                <p className="category-description">
                  Chat about anything related to Cape Town's beaches, events,
                  and community.
                </p>
                <div className="category-stats">
                  <span className="stat-item">
                    <strong>35</strong> Topics
                  </span>
                  <span className="stat-divider">•</span>
                  <span className="stat-item">
                    <strong>156</strong> Posts
                  </span>
                </div>
              </div>

              <div className="category-card">
                <div className="category-header">
                  <div className="category-icon">📅</div>
                  <h3 className="category-name">Events & Meetups</h3>
                </div>
                <p className="category-description">
                  Organize and join beach cleanups, surf sessions, and community
                  events.
                </p>
                <div className="category-stats">
                  <span className="stat-item">
                    <strong>12</strong> Topics
                  </span>
                  <span className="stat-divider">•</span>
                  <span className="stat-item">
                    <strong>47</strong> Posts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="forum-recent">
            <h2 className="section-title">Recent Activity</h2>
            <div className="recent-posts">
              <div className="post-preview">
                <div className="post-avatar">👤</div>
                <div className="post-info">
                  <h4 className="post-title">
                    Amazing waves at Muizenberg today!
                  </h4>
                  <p className="post-meta">
                    Posted by <strong>SurferDude</strong> • 2 hours ago
                  </p>
                </div>
              </div>

              <div className="post-preview">
                <div className="post-avatar">👤</div>
                <div className="post-info">
                  <h4 className="post-title">Beach cleanup this Saturday?</h4>
                  <p className="post-meta">
                    Posted by <strong>BeachLover</strong> • 5 hours ago
                  </p>
                </div>
              </div>

              <div className="post-preview">
                <div className="post-avatar">👤</div>
                <div className="post-info">
                  <h4 className="post-title">
                    Best time for tides at Clifton?
                  </h4>
                  <p className="post-meta">
                    Posted by <strong>TideWatcher</strong> • 1 day ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Post Button */}
          <div className="forum-actions">
            <button className="create-post-btn">
              <span>✍️</span>
              Create New Post
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
