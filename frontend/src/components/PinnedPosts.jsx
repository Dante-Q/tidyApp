import { Link } from "react-router-dom";
import {
  getCategoryEmoji,
  getCategoryLabel,
  formatDate,
} from "../utils/forumHelpers.js";
import { getBeachTagBySlug } from "../config/beachTags.js";
import styles from "./PinnedPosts.module.css";

export default function PinnedPosts({ posts, loading }) {
  // Filter only pinned posts
  const pinnedPosts = posts.filter((post) => post.isPinned);

  // Don't render if no pinned posts
  if (!loading && pinnedPosts.length === 0) {
    return null;
  }

  return (
    <div className={styles.pinnedPosts}>
      <h2 className={styles.sectionTitle}>Pinned Posts</h2>
      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#fff" }}>
          Loading pinned posts...
        </div>
      ) : (
        <div className={styles.postsList}>
          {pinnedPosts.map((post) => {
            return (
              <Link
                key={post._id}
                to={`/forum/post/${post._id}`}
                className={styles.postItem}
              >
                <div className={styles.postItemHeader}>
                  <h3 className={styles.postItemTitle}>
                    <span className={styles.titlePinIcon}>📌</span>
                    {post.title}
                  </h3>
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
                        {getCategoryEmoji(post.subcategory || post.category)}{" "}
                        {getCategoryLabel(post.subcategory || post.category)}
                      </span>
                    )}
                  </div>
                </div>
                {/* Post Content Preview */}
                <div className={styles.postContentPreview}>
                  {post.content.length > 300
                    ? `${post.content.substring(0, 300)}...`
                    : post.content}
                </div>
                <div className={styles.postItemMeta}>
                  <span className={styles.postAuthor}>
                    by{" "}
                    {post.author?.displayName || post.author?.name || "Unknown"}{" "}
                    • {formatDate(post.createdAt)}
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
