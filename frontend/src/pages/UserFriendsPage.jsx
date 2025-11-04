import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../services/friendService";
import { getUserInitial } from "../utils/forumHelpers";
import "./UserFriendsPage.css";

export default function UserFriendsPage() {
  const { userId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userFriends", userId],
    queryFn: () => getFriends(userId),
    enabled: !!userId,
  });

  const friends = data?.friends || [];

  if (isLoading) {
    return (
      <div className="user-friends-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading friends...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Check if it's a 401 authentication error
    const isAuthError =
      error.response?.status === 401 || error.message.includes("401");

    // Check if it's a 403 forbidden error (not friends)
    const isForbidden = error.response?.status === 403;

    return (
      <div className="user-friends-page">
        <div className="error-container">
          {isAuthError ? (
            <>
              <div className="lock-icon">🔒</div>
              <h2>Login Required</h2>
              <p>You need to be logged in to view friends lists.</p>
              <div className="error-actions">
                <Link to="/login" className="btn-login">
                  Login
                </Link>
                <Link to="/register" className="btn-register">
                  Create Account
                </Link>
              </div>
              <Link to={`/profile/${userId}`} className="btn-back-link">
                ← Back to Profile
              </Link>
            </>
          ) : isForbidden ? (
            <>
              <div className="lock-icon">👥</div>
              <h2>Friends Only</h2>
              <p>
                You must be friends with this user to view their friends list.
              </p>
              <Link to={`/profile/${userId}`} className="btn-back">
                ← Back to Profile
              </Link>
            </>
          ) : (
            <>
              <p>⚠️ {error.message}</p>
              <Link to={`/profile/${userId}`} className="btn-back">
                ← Back to Profile
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="user-friends-page">
      <div className="friends-header">
        <Link to={`/profile/${userId}`} className="back-link">
          ← Back to Profile
        </Link>
        <h1 className="page-title">
          <span className="hero-emoji">👥</span> Friends
          <span className="friends-count-badge">{friends.length}</span>
        </h1>
      </div>

      <div className="friends-content">
        {friends.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">This user has no friends yet.</p>
          </div>
        ) : (
          <div className="friends-grid">
            {friends.map((friend) => (
              <Link
                key={friend._id}
                to={`/profile/${friend._id}`}
                className="friend-card"
              >
                <div className="friend-avatar">
                  {getUserInitial(friend.name)}
                </div>
                <div className="friend-info">
                  <h3 className="friend-name">{friend.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
