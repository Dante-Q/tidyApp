import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePostDetail } from "../context/PostDetailContext.js";
import { createCreateCommentMutation } from "../mutations/commentMutations.js";

export default function InlineCommentForm({
  replyToUsername,
  parentCommentId,
}) {
  const { user, postId, setReplyTo } = usePostDetail();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const textareaRef = useRef(null);

  const [commentContent, setCommentContent] = useState(`@${replyToUsername} `);

  // Auto-focus when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Place cursor at end
      const len = commentContent.length;
      textareaRef.current.setSelectionRange(len, len);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const createCommentMutation = useMutation({
    ...createCreateCommentMutation(queryClient, postId),
    onSuccess: () => {
      setCommentContent("");
      setReplyTo(null); // Close the inline form
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
      parentCommentId: parentCommentId,
    });
  };

  const handleCancel = () => {
    setReplyTo(null);
  };

  return (
    <form onSubmit={onSubmit} className="inline-comment-form">
      <div className="inline-form-header">
        <span className="replying-to">Replying to @{replyToUsername}</span>
        <button
          type="button"
          onClick={handleCancel}
          className="btn-cancel-inline-reply"
          aria-label="Cancel reply"
        >
          ✕
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder={`Reply to @${replyToUsername}...`}
        className="inline-comment-input"
        rows={3}
        disabled={createCommentMutation.isPending}
      />
      <div className="inline-form-actions">
        <button
          type="button"
          onClick={handleCancel}
          className="btn-cancel-inline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-submit-inline"
          disabled={createCommentMutation.isPending || !commentContent.trim()}
        >
          {createCommentMutation.isPending ? "Posting..." : "Reply"}
        </button>
      </div>
    </form>
  );
}
