import { useContext } from "react";
import { UserContext } from "../context/UserContext.js";
import HeroContainer from "../components/HeroContainer";
import FavoritesWatchlist from "../components/FavoritesWatchlist";
import FriendsManager from "../components/FriendsManager";

export default function DashboardPage() {
  const { user } = useContext(UserContext);

  // Separate crown emoji from displayName if present
  const displayName = user.displayName || user.name;
  const hasCrown = displayName.startsWith("👑");
  const nameWithoutCrown = hasCrown
    ? displayName.substring(2).trim()
    : displayName;

  return (
    <div className="homepage-wrapper">
      <HeroContainer>
        <div className="hero-content">
          <h1 className="hero-title-dashboard dashboard-hero-title">
            <span className="hero-emoji">👋</span>
            <span className="hero-title-text">Welcome back,</span>
          </h1>
          <div className="dashboard-username">
            {hasCrown && <span className="hero-emoji-crown">👑 </span>}
            <span className="username-text">{nameWithoutCrown}!</span>
          </div>
          <p className="hero-subtitle">Your favorite beaches & conditions</p>
        </div>
      </HeroContainer>

      {/* Dashboard content section */}
      <section className="homepage-content">
        {/* Friends Manager - Unified Component */}
        <FriendsManager />

        <FavoritesWatchlist />
      </section>
    </div>
  );
}
