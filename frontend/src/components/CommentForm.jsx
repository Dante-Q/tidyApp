import { Link } from "react-router-dom";

export default function CommentForm({
  user,
  commentContent,
  setCommentContent,
  replyTo,
  setReplyTo,
  submittingComment,
  onSubmit,
}) {
  if (!user) {
    return (
      <div className="login-prompt">
        <Link to="/login">Log in</Link> to join the discussion
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="comment-form">
      {replyTo && (
        <div className="reply-indicator">
          Replying to @{replyTo.username}
          <button
            type="button"
            onClick={() => {
              setReplyTo(null);
              setCommentContent("");
            }}
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
          replyTo
            ? `Reply to @${replyTo.username}...`
            : "Share your thoughts..."
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
  );
}
