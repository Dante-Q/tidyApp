import { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import ConfirmModal from "./ConfirmModal.jsx";
import {
  getFriendRequests,
  getSentFriendRequests,
  getFriends,
} from "../services/friendService";
import {
  createAcceptFriendRequestMutation,
  createRejectFriendRequestMutation,
  createCancelFriendRequestMutation,
  createRemoveFriendMutation,
} from "../mutations/friendMutations.js";
import { getPosts } from "../services/forumService";
import {
  getUserInitial,
  getCategoryEmoji,
  getCategoryLabel,
} from "../utils/forumHelpers";
import { getBeachTagBySlug } from "../config/beachTags";
import "./FriendsManager.css";

export default function FriendsManager() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("posts"); // 'posts', 'friends', 'received', 'sent'
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [showAllSent, setShowAllSent] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState(null);
  const queryClient = useQueryClient();

  // Fetch user's posts
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", user?.id],
    queryFn: () => getPosts({ author: user.id, limit: 50 }),
    enabled: !!user?.id,
  });

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
  const posts = postsData?.posts || [];

  // Limit items based on show all state
  const displayedPosts = showAllPosts ? posts : posts.slice(0, 5);
  const displayedFriends = showAllFriends ? friends : friends.slice(0, 5);
  const displayedSent = showAllSent ? sentRequests : sentRequests.slice(0, 5);

  const isLoading =
    receivedLoading || sentLoading || friendsLoading || postsLoading;

  // Use centralized friend mutations
  const acceptMutation = useMutation(
    createAcceptFriendRequestMutation(queryClient)
  );

  const rejectMutation = useMutation(
    createRejectFriendRequestMutation(queryClient)
  );

  const cancelMutation = useMutation(
    createCancelFriendRequestMutation(queryClient)
  );

  const removeMutation = useMutation(createRemoveFriendMutation(queryClient));

  const handleRemoveFriend = (friendId, friendName) => {
    setFriendToRemove({ id: friendId, name: friendName });
    setConfirmRemoveOpen(true);
  };

  const handleConfirmRemove = () => {
    if (friendToRemove) {
      removeMutation.mutate(friendToRemove.id);
    }
  };

  return (
    <div className="friends-manager">
      <div className="friends-manager-header">
        <h2 className="section-title">
          <span className="hero-emoji">👥</span>{" "}
          <span className="section-title-text">Profile</span>
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
          className={`tab ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          My Posts
          {posts.length > 0 && (
            <span className="tab-badge">{posts.length}</span>
          )}
        </button>
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
            {/* My Posts Tab */}
            {activeTab === "posts" && (
              <div className="posts-list">
                {posts.length === 0 ? (
                  <div className="empty-state">
                    <p>No posts yet. Share your first thought!</p>
                  </div>
                ) : (
                  <>
                    {displayedPosts.map((post) => (
                      <Link
                        key={post._id}
                        to={`/forum/post/${post._id}`}
                        className="post-card"
                      >
                        <div className="post-header">
                          <h3 className="post-title">{post.title}</h3>
                          <div className="post-tags">
                            {/* Beach Tags */}
                            {post.tags &&
                              post.tags.length > 0 &&
                              post.tags.map((tagSlug) => {
                                const tag = getBeachTagBySlug(tagSlug);
                                return tag ? (
                                  <span
                                    key={tagSlug}
                                    className="post-beach-tag"
                                    style={{
                                      borderColor: tag.color,
                                      color: tag.color,
                                    }}
                                  >
                                    {tag.icon} {tag.name}
                                  </span>
                                ) : null;
                              })}
                            {/* Subcategory Tag */}
                            {(post.subcategory || post.category) && (
                              <span className="post-subcategory-tag">
                                {getCategoryEmoji(
                                  post.subcategory || post.category
                                )}{" "}
                                {getCategoryLabel(
                                  post.subcategory || post.category
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="post-excerpt">
                          {post.content.substring(0, 100)}
                          {post.content.length > 100 ? "..." : ""}
                        </p>
                        <div className="post-meta">
                          <span>💬 {post.commentCount || 0}</span>
                          <span>❤️ {post.likes?.length || 0}</span>
                          <span>👁️ {post.views || 0}</span>
                        </div>
                      </Link>
                    ))}
                    {posts.length > 5 && (
                      <button
                        className="btn-show-more"
                        onClick={() => setShowAllPosts(!showAllPosts)}
                      >
                        {showAllPosts
                          ? "Show Less"
                          : `Show ${posts.length - 5} More`}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Friends List Tab */}
            {activeTab === "friends" && (
              <div className="friends-list">
                {friends.length === 0 ? (
                  <div className="empty-state">
                    <p>No friends yet. Start connecting!</p>
                  </div>
                ) : (
                  <>
                    {displayedFriends.map((friend) => (
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
                    ))}
                    {friends.length > 5 && (
                      <button
                        className="btn-show-more"
                        onClick={() => setShowAllFriends(!showAllFriends)}
                      >
                        {showAllFriends
                          ? "Show Less"
                          : `Show ${friends.length - 5} More`}
                      </button>
                    )}
                  </>
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
                  <>
                    {displayedSent.map((request) => (
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
                            onClick={() =>
                              cancelMutation.mutate(request.to._id)
                            }
                            disabled={cancelMutation.isPending}
                          >
                            {cancelMutation.isPending ? "..." : "Cancel"}
                          </button>
                        </div>
                      </div>
                    ))}
                    {sentRequests.length > 5 && (
                      <button
                        className="btn-show-more"
                        onClick={() => setShowAllSent(!showAllSent)}
                      >
                        {showAllSent
                          ? "Show Less"
                          : `Show ${sentRequests.length - 5} More`}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Remove Friend Confirmation Modal */}
      <ConfirmModal
        opened={confirmRemoveOpen}
        onClose={() => {
          setConfirmRemoveOpen(false);
          setFriendToRemove(null);
        }}
        onConfirm={handleConfirmRemove}
        title="Remove Friend"
        message={
          friendToRemove
            ? `Remove ${friendToRemove.name} from your friends?`
            : "Remove this friend?"
        }
        confirmText="Remove"
        confirmColor="red"
      />
    </div>
  );
}
