import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import HeroContainer from "../components/HeroContainer";
import FavoritesWatchlist from "../components/FavoritesWatchlist";
import ApiDataViewer from "../components/ApiDataViewer";
import WaveHeightGraph from "../components/WaveHeightGraph";
import useSurfData from "../hooks/useSurfData";

export default function DashboardPage() {
  const { user } = useContext(UserContext);
  const [selectedBeach, setSelectedBeach] = useState("muizenberg");

  // Fetch surf data for selected beach
  const { data: surfData, loading, error } = useSurfData(selectedBeach);

  return (
    <div className="homepage-wrapper">
      <HeroContainer>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-emoji">👋</span>
            Welcome back, {user.name}!
          </h1>
          <p className="hero-subtitle">Your favorite beaches & conditions</p>
        </div>
      </HeroContainer>

      {/* Dashboard content section */}
      <section className="homepage-content">
        <FavoritesWatchlist />

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
        <ApiDataViewer />
      </section>
    </div>
  );
}
