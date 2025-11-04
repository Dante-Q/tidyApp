import { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import {
  getFriendRequests,
  getSentFriendRequests,
  getFriends,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
} from "../services/friendService";
import { getUserInitial } from "../utils/forumHelpers";
import "./FriendsManager.css";

export default function FriendsManager() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("friends"); // 'friends', 'received', 'sent'
  const queryClient = useQueryClient();

  // Fetch received friend requests
  const { data: receivedData, isLoading: receivedLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 30000,
  });

  // Fetch sent friend requests
  const { data: sentData, isLoading: sentLoading } = useQuery({
    queryKey: ["sentFriendRequests"],
    queryFn: getSentFriendRequests,
    refetchInterval: 30000,
  });

  // Fetch friends list
  const { data: friendsData, isLoading: friendsLoading } = useQuery({
    queryKey: ["userFriends", "me"],
    queryFn: () => getFriends("me"),
    refetchInterval: 30000,
  });

  const receivedRequests = receivedData?.requests || [];
  const sentRequests = sentData?.requests || [];
  const friends = friendsData?.friends || [];

  // Mutations
  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["friendRequests"]);
      queryClient.invalidateQueries(["userFriends"]);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["friendRequests"]);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["sentFriendRequests"]);
      queryClient.invalidateQueries(["friendshipStatus"]);
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries(["userFriends"]);
    },
  });

  const handleRemoveFriend = (friendId, friendName) => {
    if (window.confirm(`Remove ${friendName} from your friends?`)) {
      removeMutation.mutate(friendId);
    }
  };

  const isLoading = receivedLoading || sentLoading || friendsLoading;

  return (
    <div className="friends-manager">
      <div className="friends-manager-header">
        <h2 className="section-title">
          <span className="hero-emoji">👥</span> Friends
        </h2>
        <div className="header-buttons">
          <Link to={`/profile/${user?.id}`} className="btn-profile">
            <span className="profile-icon">👤</span> Profile
          </Link>
          <Link to="/settings" className="btn-settings">
            <span className="settings-icon">⚙️</span> Settings
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="friends-tabs">
        <button
          className={`tab ${activeTab === "friends" ? "active" : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          Friends
          {friends.length > 0 && (
            <span className="tab-badge">{friends.length}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === "received" ? "active" : ""}`}
          onClick={() => setActiveTab("received")}
        >
          Received
          {receivedRequests.length > 0 && (
            <span className="tab-badge received-badge">
              {receivedRequests.length}
            </span>
          )}
        </button>
        <button
          className={`tab ${activeTab === "sent" ? "active" : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          Sent
          {sentRequests.length > 0 && (
            <span className="tab-badge sent-badge">{sentRequests.length}</span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="friends-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {/* Friends List Tab */}
            {activeTab === "friends" && (
              <div className="friends-list">
                {friends.length === 0 ? (
                  <div className="empty-state">
                    <p>No friends yet. Start connecting!</p>
                  </div>
                ) : (
                  friends.map((friend) => (
                    <div key={friend._id} className="friend-card">
                      <Link
                        to={`/profile/${friend._id}`}
                        className="friend-info"
                      >
                        <div className="friend-avatar">
                          {getUserInitial(friend.displayName || friend.name)}
                        </div>
                        <div className="friend-details">
                          <h3 className="friend-name">
                            {friend.displayName || friend.name}
                          </h3>
                        </div>
                      </Link>
                      <button
                        className="btn-remove"
                        onClick={() =>
                          handleRemoveFriend(
                            friend._id,
                            friend.displayName || friend.name
                          )
                        }
                        disabled={removeMutation.isPending}
                      >
                        {removeMutation.isPending ? "..." : "Remove"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Received Requests Tab */}
            {activeTab === "received" && (
              <div className="requests-list">
                {receivedRequests.length === 0 ? (
                  <div className="empty-state">
                    <p>No pending friend requests</p>
                  </div>
                ) : (
                  receivedRequests.map((request) => (
                    <div key={request._id} className="request-card">
                      <Link
                        to={`/profile/${request.from._id}`}
                        className="request-info"
                      >
                        <div className="request-avatar received-avatar">
                          {getUserInitial(
                            request.from.displayName || request.from.name
                          )}
                        </div>
                        <div className="request-details">
                          <h3 className="request-name">
                            {request.from.displayName || request.from.name}
                          </h3>
                          <p className="request-time">
                            {new Date(request.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </Link>
                      <div className="request-actions">
                        <button
                          className="btn-accept"
                          onClick={() =>
                            acceptMutation.mutate(request.from._id)
                          }
                          disabled={acceptMutation.isPending}
                        >
                          {acceptMutation.isPending ? "..." : "Accept"}
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() =>
                            rejectMutation.mutate(request.from._id)
                          }
                          disabled={rejectMutation.isPending}
                        >
                          {rejectMutation.isPending ? "..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sent Requests Tab */}
            {activeTab === "sent" && (
              <div className="requests-list">
                {sentRequests.length === 0 ? (
                  <div className="empty-state">
                    <p>No pending sent requests</p>
                  </div>
                ) : (
                  sentRequests.map((request) => (
                    <div key={request._id} className="request-card">
                      <Link
                        to={`/profile/${request.to._id}`}
                        className="request-info"
                      >
                        <div className="request-avatar sent-avatar">
                          {getUserInitial(
                            request.to.displayName || request.to.name
                          )}
                        </div>
                        <div className="request-details">
                          <h3 className="request-name">
                            {request.to.displayName || request.to.name}
                          </h3>
                          <p className="request-time">
                            Sent{" "}
                            {new Date(request.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </Link>
                      <div className="request-actions">
                        <button
                          className="btn-cancel"
                          onClick={() => cancelMutation.mutate(request.to._id)}
                          disabled={cancelMutation.isPending}
                        >
                          {cancelMutation.isPending ? "..." : "Cancel"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
