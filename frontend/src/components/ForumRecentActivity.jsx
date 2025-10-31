import { Link } from "react-router-dom";
import { getCategoryEmoji, getCategoryLabel } from "../utils/forumHelpers.js";
import styles from "./ForumRecentActivity.module.css";

export default function ForumRecentActivity({ recentPosts, loading }) {
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
        <div className={styles.postsList}>
          {recentPosts.map((post) => {
            return (
              <Link
                key={post._id}
                to={`/forum/post/${post._id}`}
                className={styles.postItem}
              >
                <div className={styles.postItemHeader}>
                  <h3 className={styles.postItemTitle}>{post.title}</h3>
                  {(post.subcategory || post.category) && (
                    <span className={styles.postSubcategoryTag}>
                      {getCategoryEmoji(post.subcategory || post.category)}{" "}
                      {getCategoryLabel(post.subcategory || post.category)}
                    </span>
                  )}
                </div>
                <div className={styles.postItemMeta}>
                  <span className={styles.postAuthor}>
                    by {post.author?.name || "Unknown"}
                  </span>
                  <span className={styles.postStats}>
                    💬 {post.commentCount || 0} · ❤️ {post.likes?.length || 0} ·
                    👁️ {post.views || 0}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
