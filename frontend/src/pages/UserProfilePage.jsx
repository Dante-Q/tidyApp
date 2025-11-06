import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.js";
import { getPosts } from "../services/forumService.js";
import { getUserInitial } from "../utils/forumHelpers.js";
import { getFriendshipStatus, getFriends } from "../services/friendService.js";
import {
  createSendFriendRequestMutation,
  createAcceptFriendRequestMutation,
  createRemoveFriendMutation,
} from "../mutations/friendMutations.js";
import UserPostsList from "../components/UserPostsList.jsx";
import ProfileDetails from "../components/ProfileDetails.jsx";
import "./UserProfilePage.css";

export default function UserProfilePage() {
  const { userId } = useParams();
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("posts"); // 'posts', 'about', 'friends'

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

  // Always fetch friends data to get user profile info (bio, location, interests)
  const isOwnProfile = user && String(user.id) === String(userId);

  const { data: friendsData } = useQuery({
    queryKey: ["userFriends", userId],
    queryFn: () => getFriends(userId),
    enabled: !!userId,
  });

  const friendsCount = friendsData?.friends?.length || 0;
  const canViewFriends = friendsData?.canViewFriends || isOwnProfile;

  // Use centralized friend mutations
  const sendRequestMutation = useMutation(
    createSendFriendRequestMutation(queryClient, userId)
  );

  const acceptRequestMutation = useMutation(
    createAcceptFriendRequestMutation(queryClient, userId)
  );

  const removeFriendMutation = useMutation(
    createRemoveFriendMutation(queryClient, userId)
  );

  const handleFriendAction = () => {
    if (friendshipStatus === "friends") {
      if (window.confirm("Are you sure you want to remove this friend?")) {
        removeFriendMutation.mutate(userId);
      }
    } else if (friendshipStatus === "pending_received") {
      // Accept the friend request
      acceptRequestMutation.mutate(userId);
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

  // Extract user info - prioritize friends data (has full profile) over posts data
  const userInfo = friendsData?.user
    ? friendsData.user
    : posts.length > 0
    ? posts[0].author
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

  // Check if this is a deleted user account
  if (
    userInfo &&
    (userInfo.displayName === "[Deleted User]" ||
      userInfo.name === "[Deleted User]" ||
      userInfo.email === "deleted@system.local")
  ) {
    return (
      <div className="user-profile-page">
        <div className="error-container">
          <h2>⚠️ This account has been deleted</h2>
          <p>This user's profile is no longer available.</p>
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
          <div
            className="profile-avatar-large"
            style={{ backgroundColor: userInfo?.avatarColor || "#6dd5ed" }}
          >
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
                    sendRequestMutation.isPending ||
                    acceptRequestMutation.isPending ||
                    removeFriendMutation.isPending
                  }
                >
                  {sendRequestMutation.isPending ||
                  acceptRequestMutation.isPending ||
                  removeFriendMutation.isPending
                    ? "..."
                    : getFriendButtonText()}
                </button>
              )}

            <div className="profile-stats">
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

      {/* Profile Content with Tabs */}
      <div className="profile-content">
        <div className="content-container">
          {/* Tabs */}
          <div className="profile-tabs">
            <button
              className={`tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
              {posts.length > 0 && (
                <span className="tab-badge">{posts.length}</span>
              )}
            </button>
            <button
              className={`tab ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
            {canViewFriends && (
              <button
                className={`tab ${activeTab === "friends" ? "active" : ""}`}
                onClick={() => setActiveTab("friends")}
              >
                Friends
                {friendsCount > 0 && (
                  <span className="tab-badge">{friendsCount}</span>
                )}
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "posts" && (
              <UserPostsList
                posts={posts}
                userName={userInfo?.displayName || userInfo?.name}
              />
            )}

            {activeTab === "about" && <ProfileDetails userInfo={userInfo} />}

            {activeTab === "friends" && canViewFriends && (
              <div className="friends-tab-content">
                {friendsData?.friends && friendsData.friends.length > 0 ? (
                  <div className="friends-grid">
                    {friendsData.friends.map((friend) => (
                      <Link
                        key={friend._id}
                        to={`/profile/${friend._id}`}
                        className="friend-card"
                      >
                        <div
                          className="friend-avatar"
                          style={{
                            backgroundColor: friend.avatarColor || "#6dd5ed",
                          }}
                        >
                          {getUserInitial(friend.displayName || friend.name)}
                        </div>
                        <div className="friend-info">
                          <h3 className="friend-name">
                            {friend.displayName || friend.name}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No friends yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
