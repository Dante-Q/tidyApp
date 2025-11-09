import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../services/forumService.js";
import ForumHeroSection from "../components/ForumHeroSection.jsx";
import ForumCategories from "../components/ForumCategories.jsx";
import PinnedPosts from "../components/PinnedPosts.jsx";
import ForumRecentActivity from "../components/ForumRecentActivity.jsx";
import "./ForumHomePage.css";

export default function ForumHomePage() {
  // Fetch all posts for counting by category
  const { data: allPostsData, isLoading: loadingAllPosts } = useQuery({
    queryKey: ["allPosts"],
    queryFn: () => getPosts({ limit: 1000 }), // Get all posts for counting
  });

  // Fetch recent posts for activity section
  const { data: recentPostsData, isLoading: loadingRecentPosts } = useQuery({
    queryKey: ["recentPosts"],
    queryFn: () => getPosts({ limit: 50, sortBy: "createdAt" }), // Fetch more posts for show more functionality
  });

  const allPosts = allPostsData?.posts || [];
  const recentPosts = recentPostsData?.posts || [];

  // Filter out pinned posts from recent activity
  const nonPinnedPosts = recentPosts.filter((post) => !post.isPinned);

  return (
    <div className="forum-page">
      <ForumHeroSection />

      <section className="forum-content">
        <div className="forum-container">
          <ForumCategories posts={allPosts} loading={loadingAllPosts} />

          <PinnedPosts posts={allPosts} loading={loadingAllPosts} />

          <ForumRecentActivity
            recentPosts={nonPinnedPosts}
            loading={loadingRecentPosts}
          />
        </div>
      </section>
    </div>
  );
}
