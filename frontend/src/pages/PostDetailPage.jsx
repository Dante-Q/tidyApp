import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import { getPostById } from "../services/forumService.js";
import { getCommentsByPost } from "../services/commentService.js";
import PostHeader from "../components/PostHeader.jsx";
import CommentForm from "../components/CommentForm.jsx";
import CommentsList from "../components/CommentsList.jsx";
import {
  formatDate,
  getCategoryEmoji,
  getCategoryLabel,
  processLikesData,
  pluralize,
} from "../utils/forumHelpers.js";
import { fetchPostData, fetchCommentsData } from "../utils/forumHandlers.js";
import "./PostDetailPage.css";

export default function PostDetailPage() {
  const { postId } = useParams();
  const { user } = useContext(UserContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyTo, setReplyTo] = useState(null); // { parentId, username }
  const [isLiked, setIsLiked] = useState(false);

  const fetchPost = async () => {
    await fetchPostData({
      getPostFn: getPostById,
      postId,
      user,
      processLikesDataFn: processLikesData,
      onSuccess: (data, liked) => {
        setPost(data);
        setIsLiked(liked);
      },
      onError: setError,
      setLoading,
    });
  };

  const fetchComments = async () => {
    await fetchCommentsData({
      getCommentsFn: getCommentsByPost,
      postId,
      onSuccess: setComments,
      onError: setComments,
    });
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

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
      <PostHeader
        post={post}
        user={user}
        isLiked={isLiked}
        setPost={setPost}
        setIsLiked={setIsLiked}
        setError={setError}
        formatDate={formatDate}
        getCategoryEmoji={getCategoryEmoji}
        getCategoryLabel={getCategoryLabel}
      />

      {/* Comments Section */}
      <div className="comments-section">
        <h2 className="comments-title">
          💬 {comments.length} {pluralize(comments.length, "Comment")}
        </h2>

        {/* Comments List */}
        <CommentsList
          comments={comments}
          user={user}
          onReply={(replyData) => {
            setReplyTo(replyData);
            setCommentContent(`@${replyData.username} `);
          }}
          onUpdate={fetchComments}
        />

        {/* Comment Form */}
        <CommentForm
          user={user}
          commentContent={commentContent}
          setCommentContent={setCommentContent}
          replyTo={replyTo}
          setReplyTo={setReplyTo}
          submittingComment={submittingComment}
          setSubmittingComment={setSubmittingComment}
          postId={postId}
          onSuccess={fetchComments}
          setError={setError}
        />
      </div>
    </div>
  );
}
