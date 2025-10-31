import { Link } from "react-router-dom";
import { usePostDetail } from "../context/PostDetailContext.js";
import { PostDetailProvider } from "../context/PostDetailContext.jsx";
import PostHeader from "../components/PostHeader.jsx";
import CommentForm from "../components/CommentForm.jsx";
import CommentsList from "../components/CommentsList.jsx";
import { getCategoryLabel, pluralize } from "../utils/forumHelpers.js";
import "./PostDetailPage.css";

function PostDetailContent() {
  const { post, comments, loading, error } = usePostDetail();

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
      <PostHeader />

      {/* Comments Section */}
      <div className="comments-section">
        {/* Comment Form */}
        <CommentForm />

        <h2 className="comments-title">
          💬 {comments.length} {pluralize(comments.length, "Comment")}
        </h2>

        {/* Comments List */}
        <CommentsList />
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  return (
    <PostDetailProvider>
      <PostDetailContent />
    </PostDetailProvider>
  );
}
