import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import HeroContainer from "../components/HeroContainer";
import FavoritesWatchlist from "../components/FavoritesWatchlist";
import ApiDataViewer from "../components/ApiDataViewer";

export default function DashboardPage() {
  const { user } = useContext(UserContext);

  return (
    <div className="homepage-wrapper">
      <HeroContainer>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-emoji">👋</span>
            Welcome back, {user.name}!
          </h1>
          <p className="hero-subtitle">Your personalized beach dashboard</p>
        </div>
      </HeroContainer>

      {/* Dashboard content section */}
      <section className="homepage-content">
        <FavoritesWatchlist />

        {/* API Testing Section */}
        <ApiDataViewer />
      </section>
    </div>
  );
}
