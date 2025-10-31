import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../services/forumService.js";
import { getSubcategoryBySlug } from "../config/forumCategories.js";
import { formatDate } from "../utils/forumHelpers.js";
import "./SubcategoryPage.css";

export default function SubcategoryPage() {
  const { categorySlug, subcategorySlug } = useParams();
  const navigate = useNavigate();

  // Get subcategory details from config
  const result = getSubcategoryBySlug(subcategorySlug);
  const category = result?.category;
  const subcategory = result?.subcategory;

  // Fetch posts for this subcategory
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["subcategoryPosts", categorySlug, subcategorySlug],
    queryFn: () =>
      getPosts({
        category: categorySlug,
        subcategory: subcategorySlug,
        limit: 50,
      }),
    enabled: !!subcategory,
  });

  const posts = postsData?.posts || [];

  // If subcategory not found, redirect
  if (!subcategory || !category) {
    setTimeout(() => navigate("/forum"), 2000);
    return (
      <div className="subcategory-page">
        <div className="error-container">
          <h2>⚠️ Topic not found</h2>
          <p>Redirecting to forum home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subcategory-page">
      {/* Simple Header */}
      <div className="subcategory-header">
        <div className="subcategory-breadcrumb">
          <Link to="/forum">Forum</Link>
          <span>/</span>
          <Link to={`/forum/category/${categorySlug}`}>{category.name}</Link>
          <span>/</span>
          <span>{subcategory.name}</span>
        </div>
        <div className="subcategory-title-section">
          <h1 className="subcategory-title">
            <span className="subcategory-icon-large">{subcategory.icon}</span>
            {subcategory.name}
          </h1>
          <p className="subcategory-description">{subcategory.description}</p>
        </div>
        <div className="subcategory-actions">
          <Link
            to={`/forum/create-post?category=${categorySlug}&subcategory=${subcategorySlug}`}
            className="btn-new-post"
          >
            ✍️ New Post
          </Link>
        </div>
      </div>

      {/* Posts List */}
      <section className="subcategory-content">
        <div className="subcategory-container">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{subcategory.icon}</div>
              <h3>No posts yet in {subcategory.name}</h3>
              <p>Be the first to start a discussion!</p>
              <Link
                to={`/forum/create-post?category=${categorySlug}&subcategory=${subcategorySlug}`}
                className="btn-first-post"
              >
                Create First Post
              </Link>
            </div>
          ) : (
            <div className="posts-table">
              <div className="posts-table-header">
                <span className="col-title">Discussion</span>
                <span className="col-author">Author</span>
                <span className="col-stats">Activity</span>
              </div>
              <div className="posts-table-body">
                {posts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/forum/post/${post._id}`}
                    className="post-row"
                  >
                    <div className="post-col-title">
                      <h3 className="post-row-title">{post.title}</h3>
                      <p className="post-row-excerpt">
                        {post.content?.substring(0, 120)}
                        {post.content?.length > 120 ? "..." : ""}
                      </p>
                    </div>
                    <div className="post-col-author">
                      <div className="author-info">
                        <div className="author-avatar-small">
                          {post.author?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="author-details">
                          <span className="author-name">
                            {post.author?.name || "Unknown"}
                          </span>
                          <span className="post-date">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="post-col-stats">
                      <div className="stat-item">
                        <span className="stat-icon">💬</span>
                        <span className="stat-value">
                          {post.commentCount || 0}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">❤️</span>
                        <span className="stat-value">
                          {post.likes?.length || 0}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">👁️</span>
                        <span className="stat-value">{post.views || 0}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
