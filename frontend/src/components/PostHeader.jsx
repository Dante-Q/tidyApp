import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePostDetail } from "../context/PostDetailContext.js";
import {
  getUserInitial,
  formatDate,
  getCategoryEmoji,
  getCategoryLabel,
} from "../utils/forumHelpers.js";
import {
  createLikePostMutation,
  createDeletePostMutation,
} from "../mutations/postMutations.js";

import styles from "./PostHeader.module.css";

export default function PostHeader() {
  const { post, user, postId } = usePostDetail();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthor = user && post && post.author && post.author._id === user.id;

  const likeMutation = useMutation(createLikePostMutation(queryClient, postId));
  const deleteMutation = useMutation(
    createDeletePostMutation(queryClient, navigate)
  );

  const onLike = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    likeMutation.mutate(post._id);
  };

  const onDelete = () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }
    deleteMutation.mutate(post._id);
  };

  return (
    <div className={styles.postHeader}>
      <div className={styles.postCategory}>
        <div className={styles.categoryInfo}>
          <span className={styles.categoryEmoji}>
            {getCategoryEmoji(post.category)}
          </span>
          <span className={styles.categoryName}>
            {getCategoryLabel(post.category)}
          </span>
        </div>
        <button
          onClick={onLike}
          className={`${styles.btnLikePost} ${
            post.isLiked ? styles.liked : ""
          }`}
        >
          {post.isLiked ? "❤️" : "🤍"} {post.likes || 0}
        </button>
      </div>
      <h1 className={styles.postTitle}>{post.title}</h1>

      {/* Post Content */}
      <div className={styles.postBody}>{post.content}</div>

      <div className={styles.postMeta}>
        <Link to={`/profile/${post.author._id}`} className={styles.postAuthor}>
          <div className={styles.authorAvatar}>
            {getUserInitial(post.author.name)}
          </div>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{post.author.name}</span>
            <span className={styles.postDate}>
              {formatDate(post.createdAt)}
              {post.editedAt && (
                <span
                  className={styles.editedTag}
                  title={`Last edited: ${formatDate(post.editedAt)}`}
                >
                  {" "}
                  (edited)
                </span>
              )}
            </span>
          </div>
        </Link>

        <div className={styles.postStats}>
          <span className={styles.stat}>👁️ {post.views} views</span>
          <span className={styles.stat}>
            💬 {post.commentCount || 0} comments
          </span>
          <span className={styles.stat}>❤️ {post.likes || 0} likes</span>
        </div>
      </div>

      {/* Post Actions */}
      {isAuthor && (
        <div className={styles.postActions}>
          <Link to={`/forum/edit/${post._id}`} className={styles.btnAction}>
            ✏️ Edit
          </Link>
          <button
            onClick={onDelete}
            className={`${styles.btnAction} ${styles.btnDanger}`}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}
