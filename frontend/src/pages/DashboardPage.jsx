import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import HeroContainer from "../components/HeroContainer";

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
        {/* Widgets will go here */}
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          Dashboard widgets coming soon...
        </div>
      </section>
    </div>
  );
}
