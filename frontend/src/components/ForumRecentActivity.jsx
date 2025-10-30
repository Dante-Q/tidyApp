import { Link } from "react-router-dom";
import { getUserInitial } from "../utils/forumHelpers.js";
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
                <div className="post-avatar">
                  {getUserInitial(post.author.name)}
                </div>
                <div className="post-info">
                  <h4 className="post-title">{post.title}</h4>
                  <p className="post-meta">
                    Posted by <strong>{post.author.name}</strong> •{" "}
                    {formatTimeAgo(post.createdAt)}
                    {post.editedAt && (
                      <span
                        className="edited-tag"
                        title={`Last edited: ${formatTimeAgo(post.editedAt)}`}
                      >
                        {" "}
                        (edited)
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
