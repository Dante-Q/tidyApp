import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePostDetail } from "../context/PostDetailContext.js";
import {
  createLikeCommentMutation,
  createDeleteCommentMutation,
} from "../mutations/commentMutations.js";
import {
  formatCommentDate,
  processLikesData,
  pluralize,
  getUserInitial,
} from "../utils/forumHelpers.js";

export default function CommentsList() {
  const { comments, user, postId } = usePostDetail();
  const queryClient = useQueryClient();

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          user={user}
          postId={postId}
          queryClient={queryClient}
        />
      ))}
    </div>
  );
}

function CommentItem({
  comment,
  user,
  postId,
  queryClient,
  parentCommentId = null,
}) {
  const { setReplyTo } = usePostDetail();
  const [showReplies, setShowReplies] = useState(true);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const navigate = useNavigate();

  const INITIAL_REPLIES_SHOWN = 3;

  // Handle likes - convert array to count if needed
  const { count: initialLikeCount, liked: initialIsLiked } = processLikesData(
    comment.likes,
    user,
    comment.isLiked
  );

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // Use centralized mutation configurations
  const likeCommentMutation = useMutation({
    ...createLikeCommentMutation(queryClient, postId),
    onMutate: async () => {
      // Local optimistic update for immediate feedback
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      // Also call the base onMutate
      const result = await createLikeCommentMutation(
        queryClient,
        postId
      ).onMutate(comment._id);
      return result;
    },
    onSuccess: (data) => {
      // Update local state with server response
      setIsLiked(data.isLiked);
      setLikeCount(data.likes);
    },
    onError: (err, variables, context) => {
      // Rollback local state
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      // Call base onError
      if (createLikeCommentMutation(queryClient, postId).onError) {
        createLikeCommentMutation(queryClient, postId).onError(
          err,
          variables,
          context
        );
      }
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation(
    createDeleteCommentMutation(queryClient, postId)
  );

  const handleLikeComment = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    likeCommentMutation.mutate(comment._id);
  };

  const handleDeleteComment = () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    deleteCommentMutation.mutate(comment._id);
  };

  const isAuthor = user && comment.author._id === user.id;

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author">
          <div className="author-avatar-small">
            {getUserInitial(comment.author.name)}
          </div>
          <Link
            to={`/profile/${comment.author._id}`}
            className="author-name-link"
          >
            {comment.author.name}
          </Link>
          <span className="comment-date">
            {formatCommentDate(comment.createdAt)}
          </span>
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
            setReplyTo({
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
            {pluralize(comment.replies.length, "reply", "replies")}
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
                    postId={postId}
                    queryClient={queryClient}
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
                      } more ${pluralize(
                        comment.replies.length - INITIAL_REPLIES_SHOWN,
                        "reply",
                        "replies"
                      )}`}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
