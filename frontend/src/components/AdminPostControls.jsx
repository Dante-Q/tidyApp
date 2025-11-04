import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { adminDeletePost, adminMovePost } from "../services/adminService";
import { togglePinPost } from "../services/forumService";
import { FORUM_CATEGORIES } from "../config/forumCategories";
import "./AdminPostControls.css";

export default function AdminPostControls({ post }) {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(post.category);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    post.subcategory || ""
  );

  const deleteMutation = useMutation({
    mutationFn: () => adminDeletePost(post._id),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["post", post._id]);
      alert("Post deleted by admin");
      window.location.href = "/forum";
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to delete post");
    },
  });

  const moveMutation = useMutation({
    mutationFn: ({ category, subcategory }) =>
      adminMovePost(post._id, category, subcategory),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["post", post._id]);
      setShowMoveModal(false);
      alert(data.message);
    },
    onError: (error) => {
      console.error("Move post error:", error);
      console.error("Error response:", error.response?.data);
      const errorMsg = error.response?.data?.message || "Failed to move post";
      alert(`Error: ${errorMsg}`);
    },
  });

  const pinMutation = useMutation({
    mutationFn: () => togglePinPost(post._id),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["post", post._id]);
      queryClient.invalidateQueries(["allPosts"]);
      queryClient.invalidateQueries(["recentPosts"]);
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to toggle pin status");
    },
  });

  // Don't render if not admin
  if (!user?.isAdmin) return null;

  const handleDelete = () => {
    if (
      window.confirm(
        "⚠️ ADMIN: Delete this post permanently? This cannot be undone."
      )
    ) {
      deleteMutation.mutate();
    }
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
          ✏️ Edit Post
        </Link>
        <button
          className="admin-btn admin-btn-pin"
          onClick={handleTogglePin}
          disabled={pinMutation.isPending}
        >
          {post.isPinned ? "📌 Unpin Post" : "📍 Pin Post"}
        </button>
        <button
          className="admin-btn admin-btn-move"
          onClick={() => setShowMoveModal(true)}
          disabled={moveMutation.isPending}
        >
          📁 Move Post
        </button>
        <button
          className="admin-btn admin-btn-delete"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          🗑️ Delete Post
        </button>
      </div>

      {/* Move Post Modal */}
      {showMoveModal && (
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
        </div>
      )}
    </div>
  );
}
