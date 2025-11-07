import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { UserContext } from "../context/UserContext";
import ConfirmModal from "./ConfirmModal.jsx";
import {
  createAdminDeletePostMutation,
  createMovePostMutation,
  createTogglePinPostMutation,
  createToggleCommentsPostMutation,
} from "../mutations/adminMutations.js";
import { FORUM_CATEGORIES } from "../config/forumCategories";
import "./AdminPostControls.css";

export default function AdminPostControls({ post }) {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(post.category);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    post.subcategory || ""
  );

  // Use centralized admin mutations
  const deleteMutation = useMutation(
    createAdminDeletePostMutation(queryClient, post._id, navigate)
  );

  const moveMutation = useMutation({
    ...createMovePostMutation(queryClient, post._id),
    onSuccess: (data) => {
      setShowMoveModal(false);
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["post", post._id]);
      alert(data.message);
    },
  });

  const pinMutation = useMutation(
    createTogglePinPostMutation(queryClient, post._id)
  );

  const commentsMutation = useMutation(
    createToggleCommentsPostMutation(queryClient, post._id)
  );

  // Don't render if not admin
  if (!user?.isAdmin) return null;

  const handleDelete = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
  };

  const handleMove = () => {
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }

    const moveData = {
      category: selectedCategory,
      subcategory: selectedSubcategory || undefined, // Send undefined instead of null
    };

    console.log("Moving post to:", moveData);
    moveMutation.mutate(moveData);
  };

  const handleTogglePin = () => {
    pinMutation.mutate();
  };

  const handleToggleComments = () => {
    commentsMutation.mutate();
  };

  const currentCategory = FORUM_CATEGORIES.find(
    (cat) => cat.slug === selectedCategory
  );
  const subcategories = currentCategory?.subcategories || [];

  return (
    <div className="admin-post-controls">
      <div className="admin-badge">
        <span className="admin-icon">👑</span> Admin Controls
      </div>
      <div className="admin-actions">
        <Link
          to={`/forum/edit/${post._id}`}
          className="admin-btn admin-btn-edit"
        >
          ✏️ Edit
        </Link>
        <button
          className="admin-btn admin-btn-move"
          onClick={() => setShowMoveModal(true)}
          disabled={moveMutation.isPending}
        >
          📁 Move
        </button>
        <button
          className="admin-btn admin-btn-pin"
          onClick={handleTogglePin}
          disabled={pinMutation.isPending}
        >
          {post.isPinned ? "📌 Unpin" : "📍 Pin"}
        </button>
        <button
          className="admin-btn admin-btn-comments"
          onClick={handleToggleComments}
          disabled={commentsMutation.isPending}
        >
          {post.commentsDisabled ? "✅ Enable" : "🚫 Disable"}
        </button>
        <button
          className="admin-btn admin-btn-delete"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          🗑️ Delete
        </button>
      </div>

      {/* Move Post Modal - rendered via portal to ensure proper centering */}
      {showMoveModal &&
        createPortal(
          <div
            className="admin-modal-overlay"
            onClick={() => setShowMoveModal(false)}
          >
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Move Post to Different Category</h3>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory("");
                  }}
                >
                  {FORUM_CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {subcategories.length > 0 && (
                <div className="form-group">
                  <label>Subcategory (Optional)</label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                  >
                    <option value="">None</option>
                    {subcategories.map((sub) => (
                      <option key={sub.slug} value={sub.slug}>
                        {sub.icon} {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowMoveModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-confirm"
                  onClick={handleMove}
                  disabled={moveMutation.isPending}
                >
                  {moveMutation.isPending ? "Moving..." : "Move Post"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        opened={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Admin: Delete Post"
        message="⚠️ ADMIN: Delete this post permanently? This cannot be undone."
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
}
