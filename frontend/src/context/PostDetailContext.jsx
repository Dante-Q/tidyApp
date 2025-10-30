import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "./UserContext.js";
import { PostDetailContext } from "./PostDetailContext.js";
import { getPostById } from "../services/forumService.js";
import { getCommentsByPost } from "../services/commentService.js";
import { processLikesData } from "../utils/forumHelpers.js";

export function PostDetailProvider({ children }) {
  const { postId } = useParams();
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();

  const [replyTo, setReplyTo] = useState(null); // { parentId, username }

  // Fetch post with React Query
  const {
    data: rawPost,
    isLoading: loadingPost,
    error: postError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      console.log("Fetching post from server for postId:", postId);
      const data = await getPostById(postId);
      console.log("Received post data:", {
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        timeDiff: new Date(data.updatedAt) - new Date(data.createdAt),
      });
      const { count, liked } = processLikesData(data.likes, user, data.isLiked);
      return { ...data, likes: count, isLiked: liked };
    },
    enabled: !!postId, // Only fetch if we have a postId
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache at all for testing
  });

  // Fetch comments with React Query
  const { data: commentsData, isLoading: loadingComments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const data = await getCommentsByPost(postId);
      return data.comments || [];
    },
    enabled: !!postId,
  });

  const post = rawPost || null;
  const comments = commentsData || [];
  const loading = loadingPost || loadingComments;
  const error = postError ? "Failed to load post" : "";

  // Helper function to update post in cache
  const setPost = (updater) => {
    queryClient.setQueryData(["post", postId], (old) => {
      if (typeof updater === "function") {
        return updater(old);
      }
      return updater;
    });
  };

  // Helper to set error (for backward compatibility)
  const setError = () => {
    // Error handling is now done by React Query
    // This is kept for backward compatibility but does nothing
  };

  // Refresh functions - invalidate queries to refetch
  const refreshPost = () => {
    queryClient.invalidateQueries({ queryKey: ["post", postId] });
  };

  const refreshComments = () => {
    queryClient.invalidateQueries({ queryKey: ["comments", postId] });
  };

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
