import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePostDetail } from "../context/PostDetailContext.jsx";
import { handleCommentSubmit } from "../utils/forumHandlers.js";
import { createComment } from "../services/commentService.js";

export default function CommentForm() {
  const { user, postId, refreshComments, setError, replyTo, setReplyTo } =
    usePostDetail();
  const navigate = useNavigate();

  // Component now owns its form state!
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Prefill comment when replying
  useEffect(() => {
    if (replyTo) {
      setCommentContent(`@${replyTo.username} `);
    }
  }, [replyTo]);

  const onSubmit = (e) => {
    e.preventDefault();

    handleCommentSubmit({
      user,
      navigate,
      content: commentContent,
      createCommentFn: createComment,
      commentData: {
        postId: postId,
        content: commentContent,
        parentCommentId: replyTo?.parentId || null,
      },
      onSuccess: () => {
        setCommentContent("");
        setReplyTo(null);
        refreshComments();
      },
      onError: setError,
      setSubmitting: setSubmittingComment,
    });
  };
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
