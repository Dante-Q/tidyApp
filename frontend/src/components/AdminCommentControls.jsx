import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import ConfirmModal from "./ConfirmModal.jsx";
import {
  createAdminDeleteCommentMutation,
  createAdminEditCommentMutation,
} from "../mutations/adminMutations.js";
import "./AdminCommentControls.css";

export default function AdminCommentControls({ comment, postId }) {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Use centralized admin mutations
  const deleteMutation = useMutation(
    createAdminDeleteCommentMutation(queryClient, postId)
  );

  const editMutation = useMutation({
    ...createAdminEditCommentMutation(queryClient, postId),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  // Don't render if not admin
  if (!user?.isAdmin) return null;

  const handleDelete = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(comment._id);
  };

  const handleEdit = () => {
    if (!editContent.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    editMutation.mutate({ commentId: comment._id, content: editContent });
  };

  return (
    <div className="admin-comment-controls">
      <span className="admin-label">👑 Admin</span>
      <div className="admin-comment-actions">
        <button
          className="admin-comment-btn admin-btn-edit"
          onClick={() => {
            setIsEditing(!isEditing);
            setEditContent(comment.content);
          }}
          disabled={editMutation.isPending}
        >
          ✏️ Edit
        </button>
        <button
          className="admin-comment-btn admin-btn-delete"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          🗑️ Delete
        </button>
      </div>

      {isEditing && (
        <div className="admin-edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            placeholder="Edit comment..."
          />
          <div className="edit-actions">
            <button
              className="btn-cancel-edit"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              className="btn-save-edit"
              onClick={handleEdit}
              disabled={editMutation.isPending}
            >
              {editMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        opened={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Admin: Delete Comment"
        message="⚠️ ADMIN: Delete this comment and all its replies? This cannot be undone."
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
}
