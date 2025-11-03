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
    enabled: !!user && !!userId && user._id !== userId,
  });

  const friendshipStatus = friendshipData?.status || "none";

  // Fetch friends list to get count
  const { data: friendsData } = useQuery({
    queryKey: ["userFriends", userId],
    queryFn: () => getFriends(userId),
    enabled: !!userId,
  });

  const friendsCount = friendsData?.friends?.length || 0;

  // Send friend request mutation
  const sendRequestMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["friendshipStatus", userId]);
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

            {user && user._id !== userId && (
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
                {sendRequestMutation.isPending || removeFriendMutation.isPending
                  ? "..."
                  : getFriendButtonText()}
              </button>
            )}

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <Link
                to={`/profile/${userId}/friends`}
                className="stat-item stat-item-link"
              >
                <span className="stat-value">{friendsCount}</span>
                <span className="stat-label">Friends</span>
              </Link>
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
