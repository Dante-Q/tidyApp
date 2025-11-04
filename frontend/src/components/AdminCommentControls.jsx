import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import { adminEditComment, adminDeleteComment } from "../services/adminService";
import "./AdminCommentControls.css";

export default function AdminCommentControls({ comment, postId }) {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const deleteMutation = useMutation({
    mutationFn: () => adminDeleteComment(comment._id),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
      alert("Comment deleted by admin");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to delete comment");
    },
  });

  const editMutation = useMutation({
    mutationFn: (content) => adminEditComment(comment._id, content),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
      setIsEditing(false);
      alert("Comment updated by admin");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to edit comment");
    },
  });

  // Don't render if not admin
  if (!user?.isAdmin) return null;

  const handleDelete = () => {
    if (
      window.confirm(
        "⚠️ ADMIN: Delete this comment and all its replies? This cannot be undone."
      )
    ) {
      deleteMutation.mutate();
    }
  };

  const handleEdit = () => {
    if (!editContent.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    editMutation.mutate(editContent);
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
    </div>
  );
}
