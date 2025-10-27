// HomePage.jsx
import { useContext } from "react";
import HeroContainer from "../components/HeroContainer";
import BeachSlider from "../components/BeachSlider";
import InfoGrid from "../components/InfoGrid";
import BeachMap from "../components/BeachMap";
import TideChart from "../components/TideChart";
import WindCompass from "../components/WindCompass";
import WaveHeightGraph from "../components/WaveHeightGraph";
import BeachCam from "../components/BeachCam";
import DashboardPage from "./DashboardPage";
import { UserContext } from "../context/UserContext.jsx";
import { UIContext } from "../context/UIContext.js";

export default function HomePage() {
  const { user } = useContext(UserContext);
  const { openAuth } = useContext(UIContext);

  if (user) return <DashboardPage />;

  return (
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
          <button className="hero-cta-button" onClick={() => openAuth("login")}>
            Get Started
          </button>
        </div>
      </HeroContainer>

      {/* Secondary content section */}
      <section className="homepage-content">
        <BeachSlider />
        <InfoGrid />
        <TideChart />
        <WindCompass />
        <WaveHeightGraph />
        <BeachCam />
        <BeachMap />
      </section>
    </div>
  );
}
