import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.js";
import HeroContainer from "../components/HeroContainer";
import FavoritesWatchlist from "../components/FavoritesWatchlist";
import BeachCarousel from "../components/BeachCarousel";
import ApiDataViewer from "../components/ApiDataViewer";
import WaveHeightGraph from "../components/WaveHeightGraph";
import MyForumPosts from "../components/MyForumPosts";
import FriendsManager from "../components/FriendsManager";
import useMarineData from "../hooks/useMarineData";

export default function DashboardPage() {
  const { user } = useContext(UserContext);
  const [selectedBeach, setSelectedBeach] = useState("muizenberg");

  // Fetch marine data for selected beach
  const { data: surfData, loading, error } = useMarineData(selectedBeach);

  return (
    <div className="homepage-wrapper">
      <HeroContainer>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-emoji">👋</span>
            Welcome back, {user.displayName || user.name}!
          </h1>
          <p className="hero-subtitle">Your favorite beaches & conditions</p>
        </div>
      </HeroContainer>

      {/* Dashboard content section */}
      <section className="homepage-content">
        {/* Friends Manager - Unified Component */}
        <FriendsManager />

        {/* My Forum Posts */}
        <MyForumPosts />

        <FavoritesWatchlist />

        {/* Beach Carousel */}
        <BeachCarousel />

        {/* Wave Height Graph with Real Data */}
        <WaveHeightGraph
          surfData={surfData}
          loading={loading}
          error={error}
          selectedBeach={selectedBeach}
          onBeachChange={setSelectedBeach}
        />

        {/* API Testing Section */}
        <ApiDataViewer />
      </section>
    </div>
  );
}
