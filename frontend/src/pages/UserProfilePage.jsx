import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../services/forumService.js";
import { getUserInitial } from "../utils/forumHelpers.js";
import UserPostsList from "../components/UserPostsList.jsx";
import "./UserProfilePage.css";

export default function UserProfilePage() {
  const { userId } = useParams();

  // Fetch posts for this user using React Query
  const {
    data: postsData,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => getPosts({ author: userId, limit: 50 }),
    enabled: !!userId,
  });

  const posts = postsData?.posts || [];
  const error = queryError?.message || "";

  // Extract user info from first post's author
  const userInfo = posts.length > 0 ? posts[0].author : null;
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
            {getUserInitial(userInfo?.name)}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{userInfo?.name || "Unknown User"}</h1>

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
          <UserPostsList posts={posts} userName={userInfo?.name} />
        </div>
      </div>
    </div>
  );
}
