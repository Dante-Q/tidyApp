import { Link, useNavigate } from "react-router-dom";
import { usePostDetail } from "../context/PostDetailContext.jsx";
import {
  getUserInitial,
  formatDate,
  getCategoryEmoji,
  getCategoryLabel,
} from "../utils/forumHelpers.js";
import {
  handleLikeAction,
  handleDeleteAction,
} from "../utils/forumHandlers.js";
import { toggleLikePost, deletePost } from "../services/forumService.js";

export default function PostHeader() {
  const { post, setPost, user, setError } = usePostDetail();
  const navigate = useNavigate();
  const isAuthor = user && post && post.author && post.author._id === user.id;

  const onLike = () => {
    handleLikeAction({
      user,
      navigate,
      toggleLikeFn: toggleLikePost,
      itemId: post._id,
      onSuccess: (data) => {
        setPost((prevPost) => ({
          ...prevPost,
          likes: data.likes,
          isLiked: data.isLiked,
          author: prevPost.author,
        }));
      },
    });
  };

  const onDelete = () => {
    handleDeleteAction({
      confirmMessage:
        "Are you sure you want to delete this post? This action cannot be undone.",
      deleteFn: deletePost,
      itemId: post._id,
      onSuccess: () => navigate("/forum"),
      onError: () => setError("Failed to delete post"),
    });
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
            <span className="post-date">{formatDate(post.createdAt)}</span>
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
