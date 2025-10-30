import { createContext, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "./UserContext.js";
import { getPostById } from "../services/forumService.js";
import { getCommentsByPost } from "../services/commentService.js";
import { processLikesData } from "../utils/forumHelpers.js";

export const PostDetailContext = createContext(null);

export function PostDetailProvider({ children }) {
  const { postId } = useParams();
  const { user } = useContext(UserContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyTo, setReplyTo] = useState(null); // { parentId, username }

  const refreshPost = async () => {
    try {
      const data = await getPostById(postId);
      const { count, liked } = processLikesData(data.likes, user, data.isLiked);
      data.likes = count;
      data.isLiked = liked;
      setPost(data);
      setError("");
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
    }
  };

  const refreshComments = async () => {
    try {
      const data = await getCommentsByPost(postId);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([refreshPost(), refreshComments()]);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  return (
    <PostDetailContext.Provider
      value={{
        post,
        setPost,
        comments,
        loading,
        error,
        setError,
        refreshPost,
        refreshComments,
        user,
        postId,
        replyTo,
        setReplyTo,
      }}
    >
      {children}
    </PostDetailContext.Provider>
  );
}

export function usePostDetail() {
  const context = useContext(PostDetailContext);
  if (!context) {
    throw new Error("usePostDetail must be used within PostDetailProvider");
  }
  return context;
}
