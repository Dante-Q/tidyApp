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

export default function PostHeader() {
  const { post, user, postId } = usePostDetail();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthor = user && post && post.author && post.author._id === user.id;

  // Check if post was edited (updatedAt is more than 1 second after createdAt)
  const isEdited =
    post?.updatedAt &&
    new Date(post.updatedAt) - new Date(post.createdAt) > 1000;

  console.log("PostHeader render:", {
    postId,
    createdAt: post?.createdAt,
    updatedAt: post?.updatedAt,
    timeDiff:
      post?.updatedAt && post?.createdAt
        ? new Date(post.updatedAt) - new Date(post.createdAt)
        : 0,
    isEdited,
  });

  // Use centralized mutation configurations
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
    <div className="post-header">
      <div className="post-category">
        <div className="category-info">
          <span className="category-emoji">
            {getCategoryEmoji(post.category)}
          </span>
          <span className="category-name">
            {getCategoryLabel(post.category)}
          </span>
        </div>
        <button
          onClick={onLike}
          className={`btn-like-post ${post.isLiked ? "liked" : ""}`}
        >
          {post.isLiked ? "❤️" : "🤍"} {post.likes || 0}
        </button>
      </div>
      <h1 className="post-title">{post.title}</h1>

      {/* Post Content */}
      <div className="post-body">{post.content}</div>

      <div className="post-meta">
        <Link to={`/profile/${post.author._id}`} className="post-author">
          <div className="author-avatar">
            {getUserInitial(post.author.name)}
          </div>
          <div className="author-info">
            <span className="author-name">{post.author.name}</span>
            <span className="post-date">
              {formatDate(post.createdAt)}
              {isEdited && (
                <span
                  className="edited-tag"
                  title={`Last edited: ${formatDate(post.updatedAt)}`}
                >
                  {" "}
                  (edited)
                </span>
              )}
            </span>
          </div>
        </Link>

        <div className="post-stats">
          <span className="stat">👁️ {post.views} views</span>
          <span className="stat">💬 {post.commentCount || 0} comments</span>
          <span className="stat">❤️ {post.likes || 0} likes</span>
        </div>
      </div>

      {/* Post Actions */}
      {isAuthor && (
        <div className="post-actions">
          <Link to={`/forum/edit/${post._id}`} className="btn-action">
            ✏️ Edit
          </Link>
          <button onClick={onDelete} className="btn-action btn-danger">
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}
