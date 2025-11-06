import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  getCategoryEmoji,
  getCategoryLabel,
  formatDate,
} from "../utils/forumHelpers.js";
import { getBeachTagBySlug } from "../config/beachTags.js";
import PostFilters from "./PostFilters.jsx";
import styles from "./ForumRecentActivity.module.css";

export default function ForumRecentActivity({ recentPosts, loading }) {
  const POSTS_PER_PAGE = 5;
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [filters, setFilters] = useState({ tags: [], searchText: "" });

  // Filter posts based on selected tags and search text
  const filteredPosts = useMemo(() => {
    let filtered = recentPosts;

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
  }, [recentPosts, filters]);

  const hasMore = filteredPosts.length > visibleCount;
  const isExpanded = visibleCount > POSTS_PER_PAGE;
  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  const handleHide = () => {
    setVisibleCount(POSTS_PER_PAGE);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setVisibleCount(POSTS_PER_PAGE); // Reset visible count when filters change
  };

  return (
    <div className={styles.forumRecent}>
      <h2 className={styles.sectionTitle}>Recent Activity</h2>
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#fff" }}>
          Loading posts...
        </div>
      ) : recentPosts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#fff" }}>
          No posts yet. Be the first to start a discussion!
        </div>
      ) : (
        <>
          {/* Post Filters */}
          <PostFilters onFilterChange={handleFilterChange} />

          {/* Filtered Results Message */}
          {(filters.tags.length > 0 || filters.searchText.length > 0) && (
            <div className={styles.filterResultsMessage}>
              Showing {filteredPosts.length} of {recentPosts.length} posts
              {filteredPosts.length === 0 && (
                <span className={styles.noResults}> - No matches found</span>
              )}
            </div>
          )}

          {filteredPosts.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#fff" }}
            >
              No posts match your filters. Try adjusting your search or tag
              filters.
            </div>
          ) : (
            <>
              <div className={styles.postsList}>
                {visiblePosts.map((post) => {
                  return (
                    <Link
                      key={post._id}
                      to={`/forum/post/${post._id}`}
                      className={styles.postItem}
                    >
                      <div className={styles.postItemHeader}>
                        <h3 className={styles.postItemTitle}>{post.title}</h3>
                        <div className={styles.postTags}>
                          {/* Beach Tags */}
                          {post.tags &&
                            post.tags.length > 0 &&
                            post.tags.map((tagSlug) => {
                              const tag = getBeachTagBySlug(tagSlug);
                              return tag ? (
                                <span
                                  key={tagSlug}
                                  className={styles.postBeachTag}
                                  style={{
                                    borderColor: tag.color,
                                    color: tag.color,
                                  }}
                                >
                                  {tag.icon} {tag.name}
                                </span>
                              ) : null;
                            })}
                          {/* Subcategory Tag */}
                          {(post.subcategory || post.category) && (
                            <span className={styles.postSubcategoryTag}>
                              {getCategoryEmoji(
                                post.subcategory || post.category
                              )}{" "}
                              {getCategoryLabel(
                                post.subcategory || post.category
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={styles.postItemMeta}>
                        <span className={styles.postAuthor}>
                          by {post.author?.name || "Unknown"} •{" "}
                          {formatDate(post.createdAt)}
                        </span>
                        <span className={styles.postStats}>
                          💬 {post.commentCount || 0} · ❤️{" "}
                          {post.likes?.length || 0} · 👁️ {post.views || 0}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {(hasMore || isExpanded) && (
                <div className={styles.showMoreContainer}>
                  {hasMore && (
                    <>
                      <button
                        onClick={handleShowMore}
                        className={styles.showMoreBtn}
                      >
                        Show More Posts
                      </button>
                      <span className={styles.postsRemaining}>
                        {filteredPosts.length - visibleCount} more posts
                      </span>
                    </>
                  )}
                  {isExpanded && (
                    <>
                      {hasMore && (
                        <span className={styles.buttonSeparator}>•</span>
                      )}
                      <button
                        onClick={handleHide}
                        className={styles.showMoreBtn}
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
  );
}
