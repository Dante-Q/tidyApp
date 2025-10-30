import { Link } from "react-router-dom";
import {
  getUserInitial,
  getCategoryEmoji,
  getCategoryLabel,
} from "../utils/forumHelpers.js";
import "./ForumRecentActivity.css";

export default function ForumRecentActivity({ recentPosts, loading }) {
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const truncateText = (text, maxLength = 350) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  return (
    <div className="forum-recent">
      <h2 className="section-title">Recent Activity</h2>
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#fff" }}>
          Loading posts...
        </div>
      ) : recentPosts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#fff" }}>
          No posts yet. Be the first to start a discussion!
        </div>
      ) : (
        <div className="recent-posts">
          {recentPosts.map((post) => {
            return (
              <Link
                key={post._id}
                to={`/forum/post/${post._id}`}
                className="post-preview"
              >
                <div className="post-top-row">
                  <div className="post-author-section">
                    <div className="post-avatar">
                      {getUserInitial(post.author.name)}
                    </div>
                    <span className="post-author-name">{post.author.name}</span>
                  </div>
                  <div className="post-category-section">
                    <div className="category-tag">
                      <span>{getCategoryEmoji(post.category)}</span>
                      <span>{getCategoryLabel(post.category)}</span>
                    </div>
                  </div>
                </div>

                <h4 className="post-title">{post.title}</h4>

                {post.content && (
                  <p className="post-excerpt">{truncateText(post.content)}</p>
                )}

                <div className="post-footer">
                  <div className="post-meta">
                    <span>{formatTimeAgo(post.createdAt)}</span>
                    {post.editedAt && (
                      <span className="edited-indicator">(edited)</span>
                    )}
                  </div>
                  <div className="post-stats">
                    <span className="stat stat-views">
                      👁️ {post.views || 0}
                    </span>
                    <span className="stat stat-comments">
                      💬 {post.commentCount || 0}
                    </span>
                    <span className="stat stat-likes">
                      ❤️ {post.likes?.length || 0}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
