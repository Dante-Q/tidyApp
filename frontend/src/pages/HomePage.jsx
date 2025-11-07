// HomePage.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import HeroContainer from "../components/HeroContainer";
import BeachSlider from "../components/BeachSlider";
import BeachCarousel from "../components/BeachCarousel";
import InfoGrid from "../components/InfoGrid";
import TideChart from "../components/TideChart";
import WaveHeightGraph from "../components/WaveHeightGraph";
import BeachCam from "../components/BeachCam";
import { UserContext } from "../context/UserContext.js";
import { UIContext } from "../context/UIContext.js";

export default function HomePage() {
  const { user } = useContext(UserContext);
  const { openAuth } = useContext(UIContext);

  return (
    <div className="homepage-wrapper">
      <HeroContainer>
        <div className="hero-content">
          <h1 className="hero-title">
            <img src="/tidy.svg" alt="Tidy Logo" className="hero-emoji" />
            <span className="hero-title-text">Welcome to Tidy</span>
          </h1>
          <p className="hero-subtitle">
            Stay in sync with tides, surf reports, and weather in Cape Town.
          </p>
          {user ? (
            <Link to="/dashboard">
              <button className="hero-cta-button">Go to Dashboard</button>
            </Link>
          ) : (
            <button
              className="hero-cta-button"
              onClick={() => openAuth("login")}
            >
              Get Started
            </button>
          )}
        </div>
      </HeroContainer>

      {/* Secondary content section */}
      <section className="homepage-content">
        <BeachCarousel />
        <BeachSlider />
        <InfoGrid />
        <TideChart />
        <WaveHeightGraph />
        <BeachCam />
      </section>

      {/* Gradient overlay - mobile only */}
      <div className="homepage-gradient-overlay"></div>
    </div>
  );
}
