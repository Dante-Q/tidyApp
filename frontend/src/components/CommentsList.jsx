import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  toggleLikeComment,
  deleteComment,
} from "../services/commentService.js";

export default function CommentsList({ comments, user, onReply, onUpdate }) {
  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          user={user}
          onReply={onReply}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

function CommentItem({
  comment,
  user,
  onReply,
  onUpdate,
  parentCommentId = null,
}) {
  const [showReplies, setShowReplies] = useState(true);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const INITIAL_REPLIES_SHOWN = 3;

  // Handle likes - convert array to count if needed
  const getLikeData = () => {
    if (Array.isArray(comment.likes)) {
      const likesCount = comment.likes.length;
      const userLiked =
        user && comment.likes.some((userId) => userId === user.id);
      return { count: likesCount, liked: userLiked };
    }
    return { count: comment.likes || 0, liked: comment.isLiked || false };
  };

  const { count: initialLikeCount, liked: initialIsLiked } = getLikeData();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const navigate = useNavigate();

  const handleLikeComment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const data = await toggleLikeComment(comment._id);
      setIsLiked(data.isLiked);
      setLikeCount(data.likes);
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleDeleteComment = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(comment._id);
      onUpdate(); // Refresh comments list
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const isAuthor = user && comment.author._id === user.id;

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
        <button
          onClick={handleLikeComment}
          className={`btn-comment-action ${isLiked ? "liked" : ""}`}
        >
          {isLiked ? "❤️" : "🤍"} {likeCount}
        </button>
        <button
          onClick={() =>
            onReply({
              parentId: parentCommentId || comment._id,
              username: comment.author.name,
            })
          }
          className="btn-comment-action"
        >
          💬 Reply
        </button>
        {isAuthor && !isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="btn-comment-action"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDeleteComment}
              className="btn-comment-action"
            >
              🗑️ Delete
            </button>
          </>
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
              {comment.replies
                .slice(
                  0,
                  showAllReplies
                    ? comment.replies.length
                    : INITIAL_REPLIES_SHOWN
                )
                .map((reply) => (
                  <CommentItem
                    key={reply._id}
                    comment={reply}
                    user={user}
                    onReply={onReply}
                    onUpdate={onUpdate}
                    parentCommentId={parentCommentId || comment._id}
                  />
                ))}
              {comment.replies.length > INITIAL_REPLIES_SHOWN && (
                <button
                  onClick={() => setShowAllReplies(!showAllReplies)}
                  className="btn-show-more-replies"
                >
                  {showAllReplies
                    ? "Show less"
                    : `Show ${
                        comment.replies.length - INITIAL_REPLIES_SHOWN
                      } more ${
                        comment.replies.length - INITIAL_REPLIES_SHOWN === 1
                          ? "reply"
                          : "replies"
                      }`}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
