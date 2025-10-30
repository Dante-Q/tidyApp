import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostsByUser } from "../services/forumService.js";
import "./UserProfilePage.css";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchUserPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUserPosts = async () => {
    try {
      const data = await getPostsByUser(userId);
      const postsArray = data.posts || [];
      setPosts(postsArray);

      // Get user info from first post
      if (postsArray.length > 0) {
        setUserInfo(postsArray[0].author);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching user posts:", err);
      setError("Failed to load user profile");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      "surf-reports": "🌊",
      "beach-safety": "🏖️",
      "general-discussion": "🌅",
      "events-meetups": "📅",
    };
    return emojis[category] || "📝";
  };

  const getCategoryLabel = (category) => {
    const labels = {
      "surf-reports": "Surf Reports",
      "beach-safety": "Beach Safety",
      "general-discussion": "General Discussion",
      "events-meetups": "Events & Meetups",
    };
    return labels[category] || category;
  };

  const getTotalLikes = () => {
    return posts.reduce((total, post) => total + post.likes.length, 0);
  };

  const getTotalComments = () => {
    return posts.reduce((total, post) => total + (post.commentCount || 0), 0);
  };

  const getTotalViews = () => {
    return posts.reduce((total, post) => total + post.views, 0);
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-page">
        <div className="error-container">
          <h2>⚠️ {error}</h2>
          <Link to="/forum" className="btn-back">
            ← Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-container">
          <div className="profile-avatar-large">
            {userInfo ? userInfo.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{userInfo?.name || "Unknown User"}</h1>
            <p className="profile-email">{userInfo?.email || ""}</p>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{getTotalLikes()}</span>
                <span className="stat-label">Likes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{getTotalComments()}</span>
                <span className="stat-label">Comments</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{getTotalViews()}</span>
                <span className="stat-label">Views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="profile-content">
        <div className="content-container">
          <h2 className="posts-title">📝 Posts by {userInfo?.name}</h2>

          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  to={`/forum/post/${post._id}`}
                  className="post-card"
                >
                  <div className="post-card-header">
                    <span className="post-category">
                      {getCategoryEmoji(post.category)}{" "}
                      {getCategoryLabel(post.category)}
                    </span>
                    <span className="post-date">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>

                  <h3 className="post-card-title">{post.title}</h3>

                  <p className="post-card-preview">
                    {post.content.length > 150
                      ? post.content.substring(0, 150) + "..."
                      : post.content}
                  </p>

                  <div className="post-card-footer">
                    <span className="post-stat">👁️ {post.views}</span>
                    <span className="post-stat">
                      💬 {post.commentCount || 0}
                    </span>
                    <span className="post-stat">❤️ {post.likes.length}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
