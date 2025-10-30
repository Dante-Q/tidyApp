import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import { getPostById, updatePost } from "../services/forumService.js";
import "./CreatePostPage.css";

export default function EditPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { value: "surf-reports", label: "🌊 Surf Reports" },
    { value: "beach-safety", label: "🏖️ Beach Safety" },
    { value: "general-discussion", label: "🌅 General Discussion" },
    { value: "events-meetups", label: "📅 Events & Meetups" },
  ];

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchPost = async () => {
    try {
      const post = await getPostById(postId);

      // Check if user is the author
      if (!user || post.author._id !== user._id) {
        setError("You don't have permission to edit this post");
        setTimeout(() => navigate(`/forum/post/${postId}`), 2000);
        return;
      }

      setFormData({
        category: post.category,
        title: post.title,
        content: post.content,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to edit a post");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await updatePost(postId, formData);
      navigate(`/forum/post/${postId}`);
    } catch (err) {
      console.error("Error updating post:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update post. Please try again."
      );
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="create-post-page">
        <div
          className="loading-container"
          style={{ textAlign: "center", padding: "4rem" }}
        >
          <div className="loading-spinner"></div>
          <p style={{ color: "#ffffff" }}>Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-post-page">
      {/* Hero Section */}
      <div
        className="create-post-hero"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1611224885990-ab7363d1f2f3?w=1200)`,
        }}
      >
        <div className="create-post-hero-overlay">
          <div className="create-post-hero-content">
            <h1 className="create-post-title">Edit Post</h1>
            <p className="create-post-subtitle">
              Update your post with new information
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <section className="create-post-content">
        <div className="create-post-container">
          <form onSubmit={handleSubmit} className="post-form">
            {/* Error Message */}
            {error && (
              <div className="form-error">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Category Selection */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Select Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Choose a category --</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Post Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Post Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter a descriptive title for your post"
                maxLength={100}
                required
              />
              <span className="form-hint">
                {formData.title.length}/100 characters
              </span>
            </div>

            {/* Post Content */}
            <div className="form-group">
              <label htmlFor="content" className="form-label">
                Post Content <span className="required">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                rows={12}
                required
              />
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(`/forum/post/${postId}`)}
                className="btn-cancel"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={submitting}
              >
                <span>{submitting ? "⏳" : "💾"}</span>
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          {/* Guidelines Sidebar */}
          <aside className="post-guidelines">
            <h3 className="guidelines-title">Editing Guidelines</h3>
            <ul className="guidelines-list">
              <li>✓ Keep the original topic and context</li>
              <li>✓ Fix typos and improve clarity</li>
              <li>✓ Add new information if relevant</li>
              <li>✓ Respect existing comments</li>
              <li>✗ Don't change the meaning entirely</li>
              <li>✗ Don't remove content others replied to</li>
              <li>💡 Edits will show an "edited" tag</li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}
