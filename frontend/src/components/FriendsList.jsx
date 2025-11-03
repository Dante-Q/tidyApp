import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getFriends } from "../services/friendService";
import { getUserInitial } from "../utils/forumHelpers";
import "./FriendsList.css";

export default function FriendsList() {
  // Fetch friends list - the backend will use the authenticated user's ID
  const { data, isLoading, error } = useQuery({
    queryKey: ["myFriends"],
    queryFn: () => getFriends("me"), // Use "me" to indicate current user
  });

  const friends = data?.friends || [];

  console.log("FriendsList - Data:", data);
  console.log("FriendsList - Friends:", friends);
  console.log("FriendsList - Loading:", isLoading);
  console.log("FriendsList - Error:", error);

  if (isLoading) {
    return (
      <div className="friends-list-section">
        <h2 className="section-title">
          <span className="hero-emoji">👥</span> My Friends
        </h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading friends...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friends-list-section">
        <h2 className="section-title">
          <span className="hero-emoji">👥</span> My Friends
        </h2>
        <div className="error-container">
          <p>⚠️ {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="friends-list-section">
      <h2 className="section-title">
        <span className="hero-emoji">👥</span> My Friends
        {friends.length > 0 && (
          <span className="friends-count">{friends.length}</span>
        )}
      </h2>

      {friends.length === 0 ? (
        <div className="empty-state">
          <p className="empty-message">
            No friends yet. Visit user profiles to add friends!
          </p>
        </div>
      ) : (
        <div className="friends-grid">
          {friends.map((friend) => (
            <Link
              key={friend._id}
              to={`/user/${friend._id}`}
              className="friend-card"
            >
              <div className="friend-avatar">{getUserInitial(friend.name)}</div>
              <div className="friend-info">
                <h3 className="friend-name">{friend.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
