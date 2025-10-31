import { useState } from "react";
import { Link } from "react-router-dom";
import {
  formatDate,
  getCategoryEmoji,
  getSubcategoryLabel,
} from "../utils/forumHelpers.js";
import styles from "./UserPostsList.module.css";

const POSTS_PER_PAGE = 5;

export default function UserPostsList({ posts, userName, showTitle = true }) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = posts.length > visibleCount;
  const canHide = visibleCount > POSTS_PER_PAGE;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + POSTS_PER_PAGE, posts.length));
  };

  const handleHide = () => {
    setVisibleCount(POSTS_PER_PAGE);
  };

  if (posts.length === 0) {
    return (
      <div className={styles.userPostsSection}>
        {showTitle && <h2 className={styles.sectionTitle}>📝 My Posts</h2>}
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>No posts yet</p>
          <Link to="/forum/create-post" className={styles.createPostLink}>
            Create your first post
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userPostsSection}>
      {showTitle && (
        <h2 className={styles.sectionTitle}>
          📝 {userName ? `Posts by ${userName}` : "My Posts"}
        </h2>
      )}

      <div className={styles.postsList}>
        {visiblePosts.map((post) => (
          <Link
            key={post._id}
            to={`/forum/post/${post._id}`}
            className={styles.postCard}
          >
            <div className={styles.postHeader}>
              <div className={styles.postTitleRow}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                {post.subcategory && (
                  <span className={styles.subcategoryTag}>
                    {getSubcategoryLabel(post.category, post.subcategory)}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.postMeta}>
              <span className={styles.postCategory}>
                {getCategoryEmoji(post.category)}
              </span>
              <span className={styles.postDate}>
                {formatDate(post.createdAt)}
              </span>
              {post.isEdited && post.editedAt && (
                <span className={styles.editedBadge}>
                  ✏️ edited {formatDate(post.editedAt)}
                </span>
              )}
            </div>

            <p className={styles.postPreview}>
              {post.content.length > 120
                ? post.content.substring(0, 120) + "..."
                : post.content}
            </p>

            <div className={styles.postStats}>
              <span className={styles.statItem}>👁️ {post.views}</span>
              <span className={styles.statSeparator}>·</span>
              <span className={styles.statItem}>
                💬 {post.commentCount || 0}
              </span>
              <span className={styles.statSeparator}>·</span>
              <span className={styles.statItem}>❤️ {post.likes.length}</span>
            </div>
          </Link>
        ))}
      </div>

      {(hasMore || canHide) && (
        <div className={styles.showMoreContainer}>
          {hasMore && (
            <button onClick={handleShowMore} className={styles.showMoreBtn}>
              Show More
            </button>
          )}
          {hasMore && canHide && (
            <span className={styles.buttonSeparator}>·</span>
          )}
          {canHide && (
            <button onClick={handleHide} className={styles.showMoreBtn}>
              Hide
            </button>
          )}
          {hasMore && (
            <span className={styles.postsRemaining}>
              ({posts.length - visibleCount} more)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
