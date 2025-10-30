import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePostDetail } from "../context/PostDetailContext.js";
import { createCreateCommentMutation } from "../mutations/commentMutations.js";

export default function CommentForm() {
  const { user, postId, replyTo, setReplyTo } = usePostDetail();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Component now owns its form state!
  const [commentContent, setCommentContent] = useState("");

  // Prefill comment when replying
  useEffect(() => {
    if (replyTo) {
      setCommentContent(`@${replyTo.username} `);
    }
  }, [replyTo]);

  // Use centralized mutation configuration
  const createCommentMutation = useMutation({
    ...createCreateCommentMutation(queryClient, postId),
    onSuccess: () => {
      // Clear form (in addition to cache invalidation from mutation config)
      setCommentContent("");
      setReplyTo(null);

      // Call the base onSuccess from mutation config
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (err) => {
      console.error("Error creating comment:", err);
      alert("Failed to post comment. Please try again.");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!commentContent.trim()) return;

    createCommentMutation.mutate({
      postId: postId,
      content: commentContent,
      parentCommentId: replyTo?.parentId || null,
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
        disabled={createCommentMutation.isPending}
      />
      <button
        type="submit"
        className="btn-submit-comment"
        disabled={createCommentMutation.isPending || !commentContent.trim()}
      >
        {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
