import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.js";
import { getPosts } from "../services/forumService.js";
import { getUserInitial } from "../utils/forumHelpers.js";
import {
  getFriendshipStatus,
  sendFriendRequest,
  removeFriend,
  getFriends,
} from "../services/friendService.js";
import UserPostsList from "../components/UserPostsList.jsx";
import "./UserProfilePage.css";

export default function UserProfilePage() {
  const { userId } = useParams();
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();

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

  // Fetch friendship status (only if user is logged in and not viewing own profile)
  const { data: friendshipData } = useQuery({
    queryKey: ["friendshipStatus", userId],
    queryFn: () => getFriendshipStatus(userId),
    enabled: !!user && !!userId && user.id !== userId,
  });

  const friendshipStatus = friendshipData?.status || "none";

  // Fetch friends list to get count (only if viewing own profile or if friends)
  const isOwnProfile = user && String(user.id) === String(userId);
  const canViewFriends = isOwnProfile || friendshipStatus === "friends";

  const { data: friendsData } = useQuery({
    queryKey: ["userFriends", userId],
    queryFn: () => getFriends(userId),
    enabled: !!userId && canViewFriends,
  });

  const friendsCount = friendsData?.friends?.length || 0;

  // Send friend request mutation
  const sendRequestMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["friendshipStatus", userId]);
      queryClient.invalidateQueries(["friendRequests"]); // Refresh dashboard requests
      queryClient.invalidateQueries(["sentFriendRequests"]); // Refresh sent requests
    },
  });

  // Remove friend mutation
  const removeFriendMutation = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries(["friendshipStatus", userId]);
    },
  });

  const handleFriendAction = () => {
    if (friendshipStatus === "friends") {
      if (window.confirm("Are you sure you want to remove this friend?")) {
        removeFriendMutation.mutate(userId);
      }
    } else if (friendshipStatus === "none") {
      sendRequestMutation.mutate(userId);
    }
  };

  const getFriendButtonText = () => {
    switch (friendshipStatus) {
      case "friends":
        return "Remove Friend";
      case "pending_sent":
        return "Request Pending";
      case "pending_received":
        return "Accept Request";
      default:
        return "Add Friend";
    }
  };

  const getFriendButtonClass = () => {
    switch (friendshipStatus) {
      case "friends":
        return "btn-remove-friend";
      case "pending_sent":
        return "btn-pending";
      default:
        return "btn-add-friend";
    }
  };

  // Extract user info from first post's author, or from friends API response
  const userInfo =
    posts.length > 0
      ? posts[0].author
      : friendsData?.user
      ? friendsData.user
      : null;

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
            {getUserInitial(userInfo?.displayName || userInfo?.name)}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">
              {userInfo?.displayName || userInfo?.name || "Unknown User"}
            </h1>

            {/* Settings Button - Only shown on own profile */}
            {isOwnProfile && (
              <Link to="/settings" className="settings-link-button">
                ⚙️ Settings
              </Link>
            )}

            {/* Friend Button - Only shown on other users' profiles */}
            {user &&
              user.id &&
              userId &&
              String(user.id) !== String(userId) && (
                <button
                  className={`friend-button ${getFriendButtonClass()}`}
                  onClick={handleFriendAction}
                  disabled={
                    friendshipStatus === "pending_sent" ||
                    friendshipStatus === "pending_received" ||
                    sendRequestMutation.isPending ||
                    removeFriendMutation.isPending
                  }
                >
                  {sendRequestMutation.isPending ||
                  removeFriendMutation.isPending
                    ? "..."
                    : getFriendButtonText()}
                </button>
              )}

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              {canViewFriends ? (
                <Link
                  to={`/profile/${userId}/friends`}
                  className="stat-item stat-item-link"
                >
                  <span className="stat-value">{friendsCount}</span>
                  <span className="stat-label">Friends</span>
                </Link>
              ) : (
                <div className="stat-item stat-item-locked">
                  <span className="stat-value">🔒</span>
                  <span className="stat-label">Friends</span>
                </div>
              )}
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
          <UserPostsList
            posts={posts}
            userName={userInfo?.displayName || userInfo?.name}
          />
        </div>
      </div>
    </div>
  );
}
