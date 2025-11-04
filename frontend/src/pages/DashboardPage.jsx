import { useContext } from "react";
import { UserContext } from "../context/UserContext.js";
import HeroContainer from "../components/HeroContainer";
import FavoritesWatchlist from "../components/FavoritesWatchlist";
import ApiDataViewer from "../components/ApiDataViewer";
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
          <h1 className="hero-title">
            <span className="hero-emoji">👋</span>
            <span className="hero-greeting">Welcome back,</span>
            <br />
            {hasCrown && <span className="hero-emoji-crown">👑 </span>}
            <span className="hero-username">{nameWithoutCrown}!</span>
          </h1>
          <p className="hero-subtitle">Your favorite beaches & conditions</p>
        </div>
      </HeroContainer>

      {/* Dashboard content section */}
      <section className="homepage-content">
        {/* Friends Manager - Unified Component */}
        <FriendsManager />

        <FavoritesWatchlist />

        {/* API Testing Section */}
        <ApiDataViewer />
      </section>
    </div>
  );
}
