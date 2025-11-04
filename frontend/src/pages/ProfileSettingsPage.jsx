import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import "./ProfileSettingsPage.css";

export default function ProfileSettingsPage() {
  const { user, logout, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState(
    user?.displayName?.replace("👑 ", "") || ""
  );
  const [avatarColor, setAvatarColor] = useState(
    user?.avatarColor || "#6dd5ed"
  );
  // For admins: default to true if showAdminBadge is true or undefined
  // For non-admins: this value doesn't matter (won't be sent to backend)
  const [showAdminBadge, setShowAdminBadge] = useState(
    user?.isAdmin ? user?.showAdminBadge !== false : true
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.patch(
        API_ENDPOINTS.auth.profile,
        { displayName, showAdminBadge, avatarColor },
        { withCredentials: true }
      );

      setMessage(response.data.message);

      // Update user context with new data
      const baseDisplayName = response.data.user.displayName;
      const shouldShowCrown =
        response.data.user.isAdmin && response.data.user.showAdminBadge;
      const finalDisplayName = shouldShowCrown
        ? `👑 ${baseDisplayName}`
        : baseDisplayName;

      setUser((prevUser) => ({
        ...prevUser,
        displayName: finalDisplayName,
        avatarColor: response.data.user.avatarColor,
        showAdminBadge: response.data.user.showAdminBadge,
      }));

      // Invalidate all queries to refetch posts/comments with new avatar color
      queryClient.invalidateQueries();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setError("");

    try {
      await axios.delete(API_ENDPOINTS.auth.deleteAccount, {
        withCredentials: true,
      });

      // Logout and redirect
      await logout();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
      setDeleteLoading(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="profile-settings-page">
      <div className="settings-container">
        <h1 className="settings-title">
          <span className="hero-emoji">⚙️</span> Profile Settings
        </h1>

        {/* Update Display Name Section */}
        <div className="settings-section">
          <h2 className="section-heading">Display Name</h2>
          <p className="section-description">
            This is how your name appears to other users
          </p>

          <form onSubmit={handleUpdateProfile} className="settings-form">
            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter display name"
                minLength={2}
                maxLength={50}
                required
              />
              <small className="form-hint">
                Current: <strong>{user.displayName}</strong>
              </small>
            </div>

            {/* Avatar Color Picker */}
            <div className="form-group">
              <label htmlFor="avatarColor">Avatar Color</label>
              <div className="color-picker-container">
                <input
                  type="color"
                  id="avatarColor"
                  value={avatarColor}
                  onChange={(e) => setAvatarColor(e.target.value)}
                  className="color-input"
                />
                <div
                  className="color-preview"
                  style={{ backgroundColor: avatarColor }}
                >
                  <span className="preview-initial">
                    {user.displayName
                      ?.replace("👑 ", "")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <input
                  type="text"
                  value={avatarColor}
                  onChange={(e) => setAvatarColor(e.target.value)}
                  placeholder="#6dd5ed"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="color-text-input"
                />
              </div>
              <small className="form-hint">
                Choose a color for your profile avatar
              </small>
            </div>

            {/* Admin Badge Toggle - Only for admins */}
            {user.isAdmin && (
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showAdminBadge}
                    onChange={(e) => setShowAdminBadge(e.target.checked)}
                  />
                  <span>Show admin badge (👑) next to my name</span>
                </label>
                <small className="form-hint">
                  When unchecked, you'll appear as a regular user
                </small>
              </div>
            )}

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Danger Zone - Delete Account */}
        <div className="settings-section danger-zone">
          <h2 className="section-heading danger-heading">Danger Zone</h2>
          <p className="section-description">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>

          {!showDeleteConfirm ? (
            <button
              className="btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </button>
          ) : (
            <div className="delete-confirm">
              <p className="confirm-text">
                Are you absolutely sure? This action cannot be undone. All your
                posts, comments, and friends will be permanently deleted.
              </p>
              <div className="confirm-actions">
                <button
                  className="btn-cancel-delete"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn-confirm-delete"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Yes, Delete My Account"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
