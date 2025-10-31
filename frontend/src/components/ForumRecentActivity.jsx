import { Link } from "react-router-dom";
import {
  getUserInitial,
  getCategoryEmoji,
  getCategoryLabel,
} from "../utils/forumHelpers.js";
import styles from "./ForumRecentActivity.module.css";

export default function ForumRecentActivity({ recentPosts, loading }) {
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const truncateText = (text, maxLength = 350) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
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
        <div className={styles.recentPosts}>
          {recentPosts.map((post) => {
            return (
              <Link
                key={post._id}
                to={`/forum/post/${post._id}`}
                className={styles.postPreview}
              >
                <div className={styles.postTopRow}>
                  <div className={styles.postAuthorSection}>
                    <div className={styles.postAvatar}>
                      {getUserInitial(post.author.name)}
                    </div>
                    <span className={styles.postAuthorName}>
                      {post.author.name}
                    </span>
                  </div>
                  <div className={styles.postCategorySection}>
                    <div className={styles.categoryTag}>
                      <span>
                        {getCategoryEmoji(post.subcategory || post.category)}
                      </span>
                      <span>
                        {getCategoryLabel(post.subcategory || post.category)}
                      </span>
                    </div>
                  </div>
                </div>

                <h4 className={styles.postTitle}>{post.title}</h4>

                {post.content && (
                  <p className={styles.postExcerpt}>
                    {truncateText(post.content)}
                  </p>
                )}

                <div className={styles.postFooter}>
                  <div className={styles.postMeta}>
                    <span>{formatTimeAgo(post.createdAt)}</span>
                    {post.editedAt && (
                      <span className={styles.editedIndicator}>(edited)</span>
                    )}
                  </div>
                  <div className={styles.postStats}>
                    <span className={`${styles.stat} ${styles.statViews}`}>
                      👁️ {post.views || 0}
                    </span>
                    <span className={`${styles.stat} ${styles.statComments}`}>
                      💬 {post.commentCount || 0}
                    </span>
                    <span className={`${styles.stat} ${styles.statLikes}`}>
                      ❤️ {post.likes?.length || 0}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
