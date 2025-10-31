import { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext.js";
import { createCreatePostMutation } from "../mutations/postMutations.js";
import FORUM_CATEGORIES, {
  getCategoryBySlug,
  getSubcategoryBySlug,
} from "../config/forumCategories.js";
import "./CreatePostPage.css";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    title: "",
    content: "",
  });
  const [error, setError] = useState("");

  // Pre-fill category and subcategory from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const subcategoryParam = searchParams.get("subcategory");

    if (categoryParam || subcategoryParam) {
      setFormData((prev) => ({
        ...prev,
        ...(categoryParam && { category: categoryParam }),
        ...(subcategoryParam && { subcategory: subcategoryParam }),
      }));
    }
  }, [searchParams]);

  // Use centralized mutation configuration with error handling
  const createPostMutation = useMutation(
    createCreatePostMutation(queryClient, navigate, setError)
  );

  // Get subcategories for selected category
  const selectedCategory = FORUM_CATEGORIES.find(
    (cat) => cat.slug === formData.category
  );
  const subcategories = selectedCategory?.subcategories || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to create a post");
      navigate("/login");
      return;
    }

    createPostMutation.mutate(formData);
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

  // Get category and subcategory info for breadcrumb
  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");
  const category = categoryParam ? getCategoryBySlug(categoryParam) : null;
  const subcategoryResult = subcategoryParam
    ? getSubcategoryBySlug(subcategoryParam)
    : null;
  const subcategory = subcategoryResult?.subcategory;

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
            {/* Breadcrumb */}
            <div className="create-post-breadcrumb">
              <Link to="/forum">Forum</Link>
              <span>/</span>
              {category && (
                <>
                  <Link to={`/forum/category/${category.slug}`}>
                    {category.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              {subcategory && categoryParam && (
                <>
                  <Link
                    to={`/forum/category/${categoryParam}/${subcategory.slug}`}
                  >
                    {subcategory.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span>Create Post</span>
            </div>
            <h1 className="create-post-title">
              <span className="create-post-icon-large">✍️</span>
              Create New Post
            </h1>
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
                disabled={createPostMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={createPostMutation.isPending}
              >
                <span>{createPostMutation.isPending ? "⏳" : "📝"}</span>
                {createPostMutation.isPending
                  ? "Publishing..."
                  : "Publish Post"}
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
