import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext.js";
import { getPosts } from "../services/forumService.js";
import UserPostsList from "./UserPostsList.jsx";
import styles from "./MyForumPosts.module.css";

export default function MyForumPosts() {
  const { user } = useContext(UserContext);

  // Fetch posts by current user using React Query
  const {
    data: postsData,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["userPosts", user?.id],
    queryFn: () => getPosts({ author: user.id, limit: 50 }),
    enabled: !!user?.id,
  });

  const posts = postsData?.posts || [];
  const error = queryError?.message || "";

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.myPostsSection}>
        <h2 className={styles.sectionTitle}>📝 My Posts</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading your posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.myPostsSection}>
        <h2 className={styles.sectionTitle}>📝 My Posts</h2>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.myPostsSection}>
      <UserPostsList posts={posts} showTitle={true} />
    </div>
  );
}
