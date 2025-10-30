import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import {
  getPostById,
  toggleLikePost,
  deletePost,
} from "../services/forumService.js";
import {
  getCommentsByPost,
  createComment,
} from "../services/commentService.js";
import PostHeader from "../components/PostHeader.jsx";
import CommentForm from "../components/CommentForm.jsx";
import CommentsList from "../components/CommentsList.jsx";
import {
  formatDate,
  getCategoryEmoji,
  getCategoryLabel,
} from "../utils/forumHelpers.js";
import "./PostDetailPage.css";

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
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
    try {
      const data = await getPostById(postId);
      // Convert likes array to count if it's an array
      if (Array.isArray(data.likes)) {
        const likesArray = data.likes;
        const likesCount = likesArray.length;
        // Check if current user liked it
        const userLiked =
          user && likesArray.some((userId) => userId === user.id);
        data.likes = likesCount;
        setIsLiked(userLiked);
      } else {
        // If backend already returns count and isLiked
        if (data.isLiked !== undefined) {
          setIsLiked(data.isLiked);
        }
      }
      setPost(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getCommentsByPost(postId);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const data = await toggleLikePost(postId);
      // Update the post and isLiked state
      setPost((prevPost) => ({
        ...prevPost,
        likes: data.likes,
        author: prevPost.author,
      }));
      setIsLiked(data.isLiked);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deletePost(postId);
      navigate("/forum");
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post");
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!commentContent.trim()) return;

    setSubmittingComment(true);

    try {
      const commentData = {
        postId: postId,
        content: commentContent,
        parentCommentId: replyTo?.parentId || null,
      };

      await createComment(commentData);
      setCommentContent("");
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      console.error("Error creating comment:", err);
      setError("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

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
        onLike={handleLike}
        onDelete={handleDelete}
        formatDate={formatDate}
        getCategoryEmoji={getCategoryEmoji}
        getCategoryLabel={getCategoryLabel}
      />

      {/* Comments Section */}
      <div className="comments-section">
        <h2 className="comments-title">
          💬 {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
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
          onSubmit={handleSubmitComment}
        />
      </div>
    </div>
  );
}
