import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import { createPost } from "../services/forumService.js";
import { handleCreatePost } from "../utils/forumHandlers.js";
import "./CreatePostPage.css";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { value: "surf-reports", label: "🌊 Surf Reports" },
    { value: "beach-safety", label: "🏖️ Beach Safety" },
    { value: "general-discussion", label: "🌅 General Discussion" },
    { value: "events-meetups", label: "📅 Events & Meetups" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleCreatePost({
      user,
      navigate,
      formData,
      createPostFn: createPost,
      onSuccess: (post) => {
        console.log("Post created successfully:", post);
        navigate(`/forum/post/${post._id}`);
      },
      onError: setError,
      setLoading,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            <h1 className="create-post-title">Create New Post</h1>
            <p className="create-post-subtitle">
              Share your thoughts, questions, or experiences with the community
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
                onClick={() => navigate("/forum")}
                className="btn-cancel"
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                <span>{loading ? "⏳" : "📝"}</span>
                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </form>

          {/* Guidelines Sidebar */}
          <aside className="post-guidelines">
            <h3 className="guidelines-title">Posting Guidelines</h3>
            <ul className="guidelines-list">
              <li>✓ Be respectful and courteous to others</li>
              <li>✓ Stay on topic for the selected category</li>
              <li>✓ Use clear and descriptive titles</li>
              <li>✓ Check for duplicate posts before submitting</li>
              <li>✓ Share accurate and helpful information</li>
              <li>✗ No spam or self-promotion</li>
              <li>✗ No offensive or inappropriate content</li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}
