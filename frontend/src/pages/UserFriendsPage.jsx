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
    return (
      <div className="user-friends-page">
        <div className="error-container">
          <p>⚠️ {error.message}</p>
          <Link to={`/profile/${userId}`} className="btn-back">
            ← Back to Profile
          </Link>
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
