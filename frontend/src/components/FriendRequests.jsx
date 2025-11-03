import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../services/friendService";
import { getUserInitial } from "../utils/forumHelpers";
import "./FriendRequests.css";

export default function FriendRequests() {
  const queryClient = useQueryClient();

  // Fetch friend requests
  const { data, isLoading, error } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Accept request mutation
  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["friendRequests"]);
    },
  });

  // Reject request mutation
  const rejectMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["friendRequests"]);
    },
  });

  const requests = data?.requests || [];

  if (isLoading) {
    return (
      <div className="friend-requests-section">
        <h2 className="section-title">
          <span className="hero-emoji">👥</span> Friend Requests
        </h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friend-requests-section">
        <h2 className="section-title">
          <span className="hero-emoji">👥</span> Friend Requests
        </h2>
        <div className="error-container">
          <p>⚠️ {error.message}</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="friend-requests-section">
        <h2 className="section-title">
          <span className="hero-emoji">👥</span> Friend Requests
        </h2>
        <div className="empty-state">
          <p className="empty-message">No pending friend requests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="friend-requests-section">
      <h2 className="section-title">
        <span className="hero-emoji">👥</span> Friend Requests
        <span className="requests-badge">{requests.length}</span>
      </h2>

      <div className="requests-list">
        {requests.map((request) => (
          <div key={request._id} className="request-card">
            <Link
              to={`/user/${request.from._id}`}
              className="request-user-info"
            >
              <div className="request-avatar">
                {getUserInitial(request.from.name)}
              </div>
              <div className="request-details">
                <h3 className="request-name">{request.from.name}</h3>
                <p className="request-time">
                  {new Date(request.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </Link>

            <div className="request-actions">
              <button
                className="btn-accept"
                onClick={() => acceptMutation.mutate(request.from._id)}
                disabled={acceptMutation.isPending}
              >
                {acceptMutation.isPending ? "..." : "Accept"}
              </button>
              <button
                className="btn-reject"
                onClick={() => rejectMutation.mutate(request.from._id)}
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? "..." : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
