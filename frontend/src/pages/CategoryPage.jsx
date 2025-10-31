import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../services/forumService.js";
import { getCategoryBySlug } from "../config/forumCategories.js";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const POSTS_PER_PAGE = 10;
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Get category details from config
  const category = getCategoryBySlug(categorySlug);

  // Fetch posts for this category
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["categoryPosts", categorySlug],
    queryFn: () => getPosts({ category: categorySlug, limit: 50 }),
    enabled: !!category,
  });

  const posts = postsData?.posts || [];

  // If category not found, redirect to forum home
  if (!category) {
    setTimeout(() => navigate("/forum"), 2000);
    return (
      <div className="category-page">
        <div className="error-container">
          <h2>⚠️ Category not found</h2>
          <p>Redirecting to forum home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Hero Section */}
      <div
        className="category-hero"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200)`,
        }}
      >
        <div className="category-hero-overlay">
          <div className="category-hero-content">
            <div className="category-breadcrumb">
              <Link to="/forum">Forum</Link>
              <span>/</span>
              <span>{category.name}</span>
            </div>
            <h1 className="category-title">
              <span className="category-icon-large">{category.icon}</span>
              {category.name}
            </h1>
            <p className="category-subtitle">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="category-content">
        <div className="category-container">
          {/* Subcategories Grid */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="subcategories-section">
              <h2 className="section-title">Topics</h2>
              <div className="subcategories-grid">
                {category.subcategories.map((sub) => {
                  // Count posts for this subcategory
                  const postCount = posts.filter(
                    (post) => post.subcategory === sub.slug
                  ).length;

                  return (
                    <Link
                      key={sub.slug}
                      to={`/forum/category/${categorySlug}/${sub.slug}`}
                      className="subcategory-card"
                    >
                      <div className="subcategory-header">
                        <span className="subcategory-icon">{sub.icon}</span>
                        <h3 className="subcategory-name">{sub.name}</h3>
                      </div>
                      <p className="subcategory-description">
                        {sub.description}
                      </p>
                      <div className="subcategory-stats">
                        <span className="stat-badge">
                          {postCount} {postCount === 1 ? "post" : "posts"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Posts in Category */}
          <div className="category-posts-section">
            <div className="section-header">
              <h2 className="section-title">All Posts</h2>
              <Link
                to={`/forum/create-post?category=${categorySlug}`}
                className="btn-create-post"
              >
                ✍️ New Post
              </Link>
            </div>

            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="empty-state">
                <p>No posts in this category yet.</p>
                <Link
                  to={`/forum/create-post?category=${categorySlug}`}
                  className="btn-first-post"
                >
                  Be the first to post!
                </Link>
              </div>
            ) : (
              <>
                <div className="posts-list">
                  {posts.slice(0, visibleCount).map((post) => (
                    <Link
                      key={post._id}
                      to={`/forum/post/${post._id}`}
                      className="post-item"
                    >
                      <div className="post-item-header">
                        <h3 className="post-item-title">{post.title}</h3>
                        {post.subcategory && (
                          <span className="post-subcategory-tag">
                            {
                              category.subcategories.find(
                                (s) => s.slug === post.subcategory
                              )?.icon
                            }{" "}
                            {
                              category.subcategories.find(
                                (s) => s.slug === post.subcategory
                              )?.name
                            }
                          </span>
                        )}
                      </div>
                      <div className="post-item-meta">
                        <span className="post-author">
                          by {post.author?.name || "Unknown"}
                        </span>
                        <span className="post-stats">
                          💬 {post.commentCount || 0} · ❤️{" "}
                          {post.likes?.length || 0} · 👁️ {post.views || 0}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {(posts.length > visibleCount ||
                  visibleCount > POSTS_PER_PAGE) && (
                  <div className="show-more-container">
                    {posts.length > visibleCount && (
                      <>
                        <button
                          onClick={() =>
                            setVisibleCount((prev) => prev + POSTS_PER_PAGE)
                          }
                          className="show-more-btn"
                        >
                          Show More Posts
                        </button>
                        <span className="posts-remaining">
                          {posts.length - visibleCount} more posts
                        </span>
                      </>
                    )}
                    {visibleCount > POSTS_PER_PAGE && (
                      <>
                        {posts.length > visibleCount && (
                          <span className="button-separator">•</span>
                        )}
                        <button
                          onClick={() => setVisibleCount(POSTS_PER_PAGE)}
                          className="show-more-btn"
                        >
                          Hide
                        </button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
