import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategoryStats, getPosts } from "../services/forumService.js";
import ForumHeroSection from "../components/ForumHeroSection.jsx";
import ForumCategories from "../components/ForumCategories.jsx";
import ForumRecentActivity from "../components/ForumRecentActivity.jsx";
import "./ForumHomePage.css";

export default function ForumHomePage() {
  // Fetch categories with React Query
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["forumCategories"],
    queryFn: getCategoryStats,
  });

  // Fetch recent posts with React Query
  const { data: postsData, isLoading: loadingPosts } = useQuery({
    queryKey: ["recentPosts"],
    queryFn: () => getPosts({ limit: 5, sortBy: "createdAt" }),
  });

  const recentPosts = postsData?.posts || [];

  return (
    <div className="forum-page">
      <ForumHeroSection />

      <section className="forum-content">
        <div className="forum-container">
          <ForumCategories
            categories={categories}
            loading={loadingCategories}
          />

          <ForumRecentActivity
            recentPosts={recentPosts}
            loading={loadingPosts}
          />

          {/* Create Post Button */}
          <div className="forum-actions">
            <Link to="/forum/create-post">
              <button className="create-post-btn">
                <span>✍️</span>
                Create New Post
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
