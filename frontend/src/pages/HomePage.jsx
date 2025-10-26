// HomePage.jsx
import { useState, useContext } from "react";
import HeroContainer from "../components/HeroContainer";
import DashboardPage from "./DashboardPage";
import AuthOverlayDrawer from "../components/AuthOverlayDrawer";
import { UserContext } from "../context/UserContext.jsx";

export default function HomePage() {
  const { user } = useContext(UserContext);
  const [showAuth, setShowAuth] = useState(false);

  console.log("HomePage rendered:", { showAuth, hasUser: !!user }); // Debug log

  if (user) return <DashboardPage />;

  return (
    <>
      <div className="homepage-wrapper">
        <HeroContainer>
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-emoji">🌊</span>
              Welcome to Tidy
            </h1>
            <p className="hero-subtitle">
              Stay in sync with tides, surf reports, and weather in Cape Town.
            </p>
            <button
              className="hero-cta-button"
              onClick={() => setShowAuth(true)}
            >
              Get Started
            </button>
          </div>
        </HeroContainer>
      </div>

      {/* Render the Drawer outside the wrapper div */}
      <AuthOverlayDrawer opened={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
