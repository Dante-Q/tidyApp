import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePostDetail } from "../context/PostDetailContext.js";
import { UIContext } from "../context/UIContext.js";
import { createCreateCommentMutation } from "../mutations/commentMutations.js";

export default function CommentForm() {
  const { user, postId, post } = usePostDetail();
  const { openAuth } = useContext(UIContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Component owns its form state
  const [commentContent, setCommentContent] = useState("");

  // Get the base mutation configuration
  const baseMutation = createCreateCommentMutation(queryClient, postId);

  // Use centralized mutation configuration
  const createCommentMutation = useMutation({
    ...baseMutation,
    onSuccess: (data, variables, context) => {
      // Call the original onSuccess first (invalidates queries)
      baseMutation.onSuccess(data, variables, context);

      // Then clear form after successful comment creation
      setCommentContent("");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!commentContent.trim()) return;

    // Main form only creates top-level comments (no parentCommentId)
    createCommentMutation.mutate({
      postId: postId,
      content: commentContent,
      parentCommentId: null,
    });
  };

  // Check if comments are disabled
  if (post?.commentsDisabled) {
    return (
      <div className="comments-disabled-message">
        <span className="disabled-icon">🔒</span>
        <p>Comments have been disabled for this post</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="login-prompt">
        <button
          onClick={() => openAuth("login")}
          style={{
            background: "none",
            border: "none",
            color: "#6dd5ed",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
            font: "inherit",
          }}
        >
          Log in
        </button>{" "}
        to join the discussion
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="comment-form">
      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Share your thoughts..."
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
