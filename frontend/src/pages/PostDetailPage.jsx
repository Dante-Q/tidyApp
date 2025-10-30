import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import {
  getPostById,
  toggleLikePost,
  deletePost,
} from "../services/forumService.js";
import {
  getCommentsByPost,
  createComment,
} from "../services/commentService.js";
import "./PostDetailPage.css";

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const fetchPost = async () => {
    try {
      const data = await getPostById(postId);
      setPost(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getCommentsByPost(postId);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const data = await toggleLikePost(postId);
      setPost(data);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deletePost(postId);
      navigate("/forum");
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post");
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!commentContent.trim()) return;

    setSubmittingComment(true);

    try {
      const commentData = {
        post: postId,
        content: commentContent,
        parentComment: replyTo,
      };

      await createComment(commentData);
      setCommentContent("");
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      console.error("Error creating comment:", err);
      setError("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      "surf-reports": "🌊",
      "beach-safety": "🏖️",
      "general-discussion": "🌅",
      "events-meetups": "📅",
    };
    return emojis[category] || "📝";
  };

  const getCategoryLabel = (category) => {
    const labels = {
      "surf-reports": "Surf Reports",
      "beach-safety": "Beach Safety",
      "general-discussion": "General Discussion",
      "events-meetups": "Events & Meetups",
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="post-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-page">
        <div className="error-container">
          <h2>⚠️ {error || "Post not found"}</h2>
          <Link to="/forum" className="btn-back">
            ← Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && post.author._id === user._id;
  const isLiked = user && post.likes.includes(user._id);

  return (
    <div className="post-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/forum">Forum</Link>
        <span>/</span>
        <Link to="/forum">{getCategoryLabel(post.category)}</Link>
        <span>/</span>
        <span>{post.title}</span>
      </div>

      {/* Post Header */}
      <div className="post-header">
        <div className="post-category">
          <span className="category-emoji">
            {getCategoryEmoji(post.category)}
          </span>
          <span className="category-name">
            {getCategoryLabel(post.category)}
          </span>
        </div>
        <h1 className="post-title">{post.title}</h1>

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
            <span className="stat">❤️ {post.likes.length} likes</span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="post-content">
        <div className="post-body">{post.content}</div>

        {/* Post Actions */}
        <div className="post-actions">
          <button
            onClick={handleLike}
            className={`btn-action ${isLiked ? "liked" : ""}`}
          >
            {isLiked ? "❤️" : "🤍"} {post.likes.length}
          </button>

          {isAuthor && (
            <>
              <Link to={`/forum/edit/${post._id}`} className="btn-action">
                ✏️ Edit
              </Link>
              <button onClick={handleDelete} className="btn-action btn-danger">
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2 className="comments-title">
          💬 {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h2>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="comment-form">
            {replyTo && (
              <div className="reply-indicator">
                Replying to comment
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="btn-cancel-reply"
                >
                  ✕
                </button>
              </div>
            )}
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder={
                replyTo ? "Write a reply..." : "Share your thoughts..."
              }
              className="comment-input"
              rows={3}
              disabled={submittingComment}
            />
            <button
              type="submit"
              className="btn-submit-comment"
              disabled={submittingComment || !commentContent.trim()}
            >
              {submittingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <div className="login-prompt">
            <Link to="/login">Log in</Link> to join the discussion
          </div>
        )}

        {/* Comments List */}
        <div className="comments-list">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              user={user}
              onReply={(commentId) => setReplyTo(commentId)}
              onUpdate={fetchComments}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Comment Component
function CommentItem({ comment, user, onReply, onUpdate }) {
  const [showReplies, setShowReplies] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isAuthor = user && comment.author._id === user._id;

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author">
          <div className="author-avatar-small">
            {comment.author.name.charAt(0).toUpperCase()}
          </div>
          <Link
            to={`/profile/${comment.author._id}`}
            className="author-name-link"
          >
            {comment.author.name}
          </Link>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
          {comment.isEdited && <span className="edited-tag">(edited)</span>}
        </div>
      </div>

      <div className="comment-content">
        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="edit-input"
            />
            <div className="edit-actions">
              <button
                onClick={() => setIsEditing(false)}
                className="btn-cancel-edit"
              >
                Cancel
              </button>
              <button className="btn-save-edit">Save</button>
            </div>
          </div>
        ) : (
          <p>{comment.content}</p>
        )}
      </div>

      <div className="comment-actions">
        <button className="btn-comment-action">
          🤍 {comment.likes.length}
        </button>
        <button
          onClick={() => onReply(comment._id)}
          className="btn-comment-action"
        >
          💬 Reply
        </button>
        {isAuthor && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-comment-action"
          >
            ✏️ Edit
          </button>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-section">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="toggle-replies"
          >
            {showReplies ? "−" : "+"} {comment.replies.length}{" "}
            {comment.replies.length === 1 ? "reply" : "replies"}
          </button>
          {showReplies && (
            <div className="replies-list">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  user={user}
                  onReply={onReply}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
