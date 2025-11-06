import { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../services/forumService.js";
import { getSubcategoryBySlug } from "../config/forumCategories.js";
import { getBeachTagBySlug } from "../config/beachTags.js";
import { formatDate } from "../utils/forumHelpers.js";
import PostFilters from "../components/PostFilters.jsx";
import "./SubcategoryPage.css";

export default function SubcategoryPage() {
  const { categorySlug, subcategorySlug } = useParams();
  const navigate = useNavigate();
  const POSTS_PER_PAGE = 10;
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [filters, setFilters] = useState({ tags: [], searchText: "" });

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

  const posts = useMemo(() => postsData?.posts || [], [postsData?.posts]);

  // Filter posts based on selected tags and search text
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter((post) =>
        post.tags?.some((tag) => filters.tags.includes(tag))
      );
    }

    // Filter by search text
    if (filters.searchText.trim().length > 0) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [posts, filters]);

  // Reset visible count when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setVisibleCount(POSTS_PER_PAGE);
  };

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
            <>
              {/* Filters */}
              <PostFilters onFilterChange={handleFilterChange} />

              {/* Filtered Results Message */}
              {(filters.tags.length > 0 || filters.searchText.length > 0) && (
                <div className="filter-results-message">
                  Showing {filteredPosts.length} of {posts.length} posts
                  {filteredPosts.length === 0 && (
                    <span className="no-results"> - No matches found</span>
                  )}
                </div>
              )}

              {filteredPosts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No posts match your filters</h3>
                  <p>Try adjusting your search or tag filters</p>
                </div>
              ) : (
                <>
                  <div className="posts-table">
                    <div className="posts-table-header">
                      <span className="col-title">Discussion</span>
                      <span className="col-author">Author</span>
                      <span className="col-stats">Activity</span>
                    </div>
                    <div className="posts-table-body">
                      {filteredPosts.slice(0, visibleCount).map((post) => (
                        <Link
                          key={post._id}
                          to={`/forum/post/${post._id}`}
                          className="post-row"
                        >
                          <div className="post-col-title">
                            <h3 className="post-row-title">{post.title}</h3>
                            {/* Beach Tags */}
                            {post.tags && post.tags.length > 0 && (
                              <div className="post-beach-tags">
                                {post.tags.map((tagSlug) => {
                                  const tag = getBeachTagBySlug(tagSlug);
                                  return tag ? (
                                    <span
                                      key={tagSlug}
                                      className="post-beach-tag"
                                      style={{
                                        borderColor: tag.color,
                                        color: tag.color,
                                      }}
                                    >
                                      {tag.icon} {tag.name}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                            <p className="post-row-excerpt">
                              {post.content?.substring(0, 120)}
                              {post.content?.length > 120 ? "..." : ""}
                            </p>
                          </div>
                          <div className="post-col-author">
                            <div className="author-info">
                              <div className="author-avatar-small">
                                {(post.author?.displayName || post.author?.name)
                                  ?.charAt(0)
                                  .toUpperCase() || "?"}
                              </div>
                              <div className="author-details">
                                <span className="author-name">
                                  {post.author?.displayName ||
                                    post.author?.name ||
                                    "Unknown"}
                                </span>
                                <span className="post-date">
                                  {formatDate(post.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="post-col-stats">
                            💬 {post.commentCount || 0} · ❤️{" "}
                            {post.likes?.length || 0} · 👁️ {post.views || 0}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {(filteredPosts.length > visibleCount ||
                    visibleCount > POSTS_PER_PAGE) && (
                    <div className="show-more-container">
                      {filteredPosts.length > visibleCount && (
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
                            {filteredPosts.length - visibleCount} more posts
                          </span>
                        </>
                      )}
                      {visibleCount > POSTS_PER_PAGE && (
                        <>
                          {filteredPosts.length > visibleCount && (
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
            </>
          )}
        </div>
      </section>
    </div>
  );
}
