import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MultiSelect } from "@mantine/core";
import { UserContext } from "../context/UserContext.js";
import { getPostById } from "../services/forumService.js";
import { createUpdatePostMutation } from "../mutations/postMutations.js";
import FORUM_CATEGORIES from "../config/forumCategories.js";
import BEACH_TAGS from "../config/beachTags.js";
import "./EditPostPage.css";

export default function EditPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    title: "",
    content: "",
    tags: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tagLimitError, setTagLimitError] = useState(false);

  // Use centralized mutation configuration with error handling
  const updatePostMutation = useMutation(
    createUpdatePostMutation(queryClient, postId, navigate, setError)
  );

  // Get subcategories for selected category
  const selectedCategory = FORUM_CATEGORIES.find(
    (cat) => cat.slug === formData.category
  );
  const subcategories = selectedCategory?.subcategories || [];

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchPost = async () => {
    try {
      const data = await getPostById(postId);
      // data is now { success: true, post: {...} }
      const post = data.post;

      // Check if user is the author or an admin
      if (!user || (post.author._id !== user.id && !user.isAdmin)) {
        setError("You don't have permission to edit this post");
        setTimeout(() => navigate(`/forum/post/${postId}`), 2000);
        return;
      }

      setFormData({
        category: post.category,
        subcategory: post.subcategory || "",
        title: post.title,
        content: post.content,
        tags: post.tags || [],
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

    updatePostMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If category changes, reset subcategory
    if (name === "category") {
      setFormData({
        ...formData,
        category: value,
        subcategory: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  if (loading) {
    return (
      <div className="create-post-page edit-post-page">
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
    <div className="create-post-page edit-post-page">
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
                {FORUM_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <p className="form-helper">
                {selectedCategory?.description ||
                  "Choose the main category for your post"}
              </p>
            </div>

            {/* Subcategory Selection (conditional) */}
            {formData.category && subcategories.length > 0 && (
              <div className="form-group">
                <label htmlFor="subcategory" className="form-label">
                  Select Topic <span className="required">*</span>
                </label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Choose a topic --</option>
                  {subcategories.map((sub) => (
                    <option key={sub.slug} value={sub.slug}>
                      {sub.icon} {sub.name}
                    </option>
                  ))}
                </select>
                <p className="form-helper">
                  {subcategories.find((s) => s.slug === formData.subcategory)
                    ?.description || "Choose a specific topic for your post"}
                </p>
              </div>
            )}

            {/* Beach Tags Selection */}
            <div
              className={`form-group ${tagLimitError ? "tag-limit-error" : ""}`}
            >
              <label
                htmlFor="tags"
                className="form-label"
                style={{ pointerEvents: "none" }}
              >
                Beach Tags <span className="optional">(optional)</span>{" "}
                <span className="max-limit-text">(max 2)</span>
              </label>
              <MultiSelect
                id="tags"
                placeholder="Select tags related to your post"
                data={BEACH_TAGS.map((tag) => ({
                  value: tag.slug,
                  label: `${tag.icon} ${tag.name}`,
                }))}
                value={formData.tags}
                onChange={(value) => {
                  setFormData({ ...formData, tags: value });
                  setTagLimitError(false);
                }}
                searchable
                clearable
                hidePickedOptions
                maxValues={2}
                comboboxProps={{
                  position: "bottom",
                  middlewares: { flip: false, shift: false },
                }}
                onDropdownClose={() => {}}
                onOptionSubmit={(value) => {
                  // Check if user already has 2 tags and is trying to add another
                  if (
                    formData.tags.length >= 2 &&
                    !formData.tags.includes(value)
                  ) {
                    setTagLimitError(true);
                    setTimeout(() => {
                      setTagLimitError(false);
                    }, 1000);
                  }
                  // Always close dropdown after interaction
                  setTimeout(() => {
                    document.activeElement?.blur();
                  }, 0);
                }}
                classNames={{
                  root: "beach-tags-select-root",
                  input: "beach-tags-select-input",
                  pill: "beach-tags-select-pill",
                  dropdown: "beach-tags-select-dropdown",
                  option: "beach-tags-select-option",
                }}
              />
              <p className="form-helper">
                Tag your post with specific beaches to help others find relevant
                content
              </p>
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
                disabled={updatePostMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={updatePostMutation.isPending}
              >
                <span>{updatePostMutation.isPending ? "⏳" : "💾"}</span>
                {updatePostMutation.isPending ? "Saving..." : "Save Changes"}
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
