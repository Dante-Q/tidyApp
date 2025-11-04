import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import "./ProfileSettingsPage.css";

export default function ProfileSettingsPage() {
  const { user, logout, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
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
        { displayName },
        { withCredentials: true }
      );

      setMessage(response.data.message);

      // Update user context with new display name
      setUser((prevUser) => ({
        ...prevUser,
        displayName: response.data.user.displayName,
      }));

      // Show success message for a moment before redirecting
      setTimeout(() => {
        navigate(`/profile/${user.id}`);
      }, 1500);
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

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="btn-save"
              disabled={loading || displayName === user.displayName}
            >
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
