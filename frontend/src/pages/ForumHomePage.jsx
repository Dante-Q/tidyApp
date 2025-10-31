import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../services/forumService.js";
import ForumHeroSection from "../components/ForumHeroSection.jsx";
import ForumCategories from "../components/ForumCategories.jsx";
import ForumRecentActivity from "../components/ForumRecentActivity.jsx";
import PostFilters from "../components/PostFilters.jsx";
import "./ForumHomePage.css";

export default function ForumHomePage() {
  const [filters, setFilters] = useState({ tags: [], searchText: "" });
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

  const recentPosts = useMemo(
    () => recentPostsData?.posts || [],
    [recentPostsData?.posts]
  );

  // Filter recent posts based on selected tags and search text
  const filteredRecentPosts = useMemo(() => {
    let filtered = recentPosts;

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter((post) =>
        post.tags?.some((tag) => filters.tags.includes(tag))
      );
    }

    // Filter by search text
    if (filters.searchText.trim().length > 0) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [recentPosts, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="forum-page">
      <ForumHeroSection />

      <section className="forum-content">
        <div className="forum-container">
          <ForumCategories posts={allPosts} loading={loadingAllPosts} />

          {/* Post Filters */}
          <div className="forum-filters-section">
            <PostFilters onFilterChange={handleFilterChange} />

            {/* Filtered Results Message */}
            {(filters.tags.length > 0 || filters.searchText.length > 0) && (
              <div className="filter-results-message">
                Showing {filteredRecentPosts.length} of {recentPosts.length}{" "}
                posts
                {filteredRecentPosts.length === 0 && (
                  <span className="no-results"> - No matches found</span>
                )}
              </div>
            )}
          </div>

          <ForumRecentActivity
            recentPosts={filteredRecentPosts}
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
