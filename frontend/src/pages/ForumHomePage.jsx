import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../services/forumService.js";
import ForumHeroSection from "../components/ForumHeroSection.jsx";
import ForumCategories from "../components/ForumCategories.jsx";
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

  return (
    <div className="forum-page">
      <ForumHeroSection />

      <section className="forum-content">
        <div className="forum-container">
          <ForumCategories posts={allPosts} loading={loadingAllPosts} />

          <ForumRecentActivity
            recentPosts={recentPosts}
            loading={loadingRecentPosts}
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
