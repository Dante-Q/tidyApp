import { Link } from "react-router-dom";

export default function PostHeader({
  post,
  user,
  isLiked,
  onLike,
  onDelete,
  formatDate,
  getCategoryEmoji,
  getCategoryLabel,
}) {
  const isAuthor = user && post && post.author && post.author._id === user.id;

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
          className={`btn-like-post ${isLiked ? "liked" : ""}`}
        >
          {isLiked ? "❤️" : "🤍"} {post.likes || 0}
        </button>
      </div>
      <h1 className="post-title">{post.title}</h1>

      {/* Post Content */}
      <div className="post-body">{post.content}</div>

      <div className="post-meta">
        <Link to={`/profile/${post.author._id}`} className="post-author">
          <div className="author-avatar">
            {post.author.name.charAt(0).toUpperCase()}
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
