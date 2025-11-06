import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  getSentFriendRequests,
  cancelFriendRequest,
} from "../services/friendService";
import { getUserInitial } from "../utils/forumHelpers";
import "./SentFriendRequests.css";

export default function SentFriendRequests() {
  const queryClient = useQueryClient();

  // Fetch sent friend requests
  const { data, isLoading, error } = useQuery({
    queryKey: ["sentFriendRequests"],
    queryFn: getSentFriendRequests,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Cancel request mutation
  const cancelMutation = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["sentFriendRequests"]);
      queryClient.invalidateQueries(["friendshipStatus"]); // Update status on user profiles
    },
  });

  const requests = data?.requests || [];

  if (isLoading) {
    return (
      <div className="sent-requests-section">
        <h2 className="section-title">
          <span className="hero-emoji">📤</span> Sent Friend Requests
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
      <div className="sent-requests-section">
        <h2 className="section-title">
          <span className="hero-emoji">📤</span> Sent Friend Requests
        </h2>
        <div className="error-container">
          <p>⚠️ {error.message}</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="sent-requests-section">
        <h2 className="section-title">
          <span className="hero-emoji">📤</span> Sent Friend Requests
        </h2>
        <div className="empty-state">
          <p className="empty-message">No pending sent requests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sent-requests-section">
      <h2 className="section-title">
        <span className="hero-emoji">📤</span> Sent Friend Requests
        <span className="requests-badge">{requests.length}</span>
      </h2>

      <div className="requests-list">
        {requests.map((request) => (
          <div key={request._id} className="request-card">
            <Link
              to={`/profile/${request.to._id}`}
              className="request-user-info"
            >
              <div className="request-avatar">
                {getUserInitial(request.to.displayName || request.to.name)}
              </div>
              <div className="request-details">
                <h3 className="request-name">
                  {request.to.displayName || request.to.name}
                </h3>
                <p className="request-time">
                  Sent{" "}
                  {new Date(request.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year:
                      new Date(request.createdAt).getFullYear() !==
                      new Date().getFullYear()
                        ? "numeric"
                        : undefined,
                  })}
                </p>
              </div>
            </Link>

            <div className="request-actions">
              <button
                className="btn-cancel"
                onClick={() => cancelMutation.mutate(request.to._id)}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? "Cancelling..." : "Cancel"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
