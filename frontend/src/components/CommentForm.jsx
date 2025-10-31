import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePostDetail } from "../context/PostDetailContext.js";
import { createCreateCommentMutation } from "../mutations/commentMutations.js";

export default function CommentForm() {
  const { user, postId } = usePostDetail();
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
  if (!user) {
    return (
      <div className="login-prompt">
        <Link to="/login">Log in</Link> to join the discussion
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
