// src/components/Navbar.jsx
import { Group, Button, Text, Container } from "@mantine/core";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext.js";
import { UIContext } from "../context/UIContext.js";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const { openAuth } = useContext(UIContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [beachesOpen, setBeachesOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileBeachesOpen, setMobileBeachesOpen] = useState(false);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Reset mobile section states when menu opens
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileBeachesOpen(false);
      setMobileInfoOpen(false);
      setMobileToolsOpen(false);
    }
  }, [mobileMenuOpen]);

  const beaches = [
    { id: "muizenberg", name: "Muizenberg" },
    { id: "bloubergstrand", name: "Bloubergstrand" },
    { id: "strand", name: "Strand" },
    { id: "clifton", name: "Clifton" },
    { id: "kalkbay", name: "Kalk Bay" },
    { id: "milnerton", name: "Milnerton" },
  ];

  const infoPages = [
    { id: "tide-times", name: "Tide Times" },
    { id: "weather-forecast", name: "Weather Forecast" },
    { id: "surf-report", name: "Surf Report" },
    { id: "beach-safety", name: "Beach Safety" },
    { id: "water-temperature", name: "Water Temperature" },
    { id: "marine-life", name: "Marine Life" },
  ];

  const toolsPages = [
    { id: "surf-report", name: "Surf Report" },
    { id: "tides", name: "Tides" },
    { id: "wind", name: "Wind" },
    { id: "map", name: "Map" },
    { id: "cams", name: "Cams" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isOnDashboard = location.pathname === "/dashboard";

  return (
    <>
      <div className="navbar-wrapper">
        <Container size="lg" className="navbar-container">
          <Link to="/" className="navbar-link" onClick={closeMobileMenu}>
            <div className="navbar-logo">
              <img
                src="/tidy.svg"
                alt="Tidy Logo"
                className="navbar-logo-emoji"
              />
              <Text className="navbar-logo-text" fw={700} size="xl">
                Tidy
              </Text>
            </div>
          </Link>

          {/* Mobile Right Side - Action Buttons + Hamburger */}
          <div className="navbar-mobile-right">
            {/* Mobile Action Buttons */}
            <div className="navbar-mobile-actions-top">
              {user ? (
                <>
                  <Link
                    to={isOnDashboard ? "/" : "/dashboard"}
                    className="navbar-mobile-btn-small navbar-mobile-btn-small-dashboard"
                  >
                    {isOnDashboard ? "Home" : "Dashboard"}
                  </Link>
                  <button
                    className="navbar-mobile-btn-small navbar-mobile-btn-small-logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="navbar-mobile-btn-small"
                    onClick={() => openAuth("login")}
                  >
                    Login
                  </button>
                </>
              )}
            </div>

            {/* Hamburger Menu Button */}
            <button
              className={`navbar-hamburger ${mobileMenuOpen ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <Group gap="sm" className="navbar-desktop">
            <Group gap="xs" className="navbar-nav-links">
              <Link to="/" className="navbar-link">
                <Button variant="subtle" className="navbar-btn navbar-btn-home">
                  Home
                </Button>
              </Link>

              <div
                className="navbar-dropdown"
                onMouseEnter={() => setBeachesOpen(true)}
                onMouseLeave={() => setBeachesOpen(false)}
              >
                <Button
                  variant="subtle"
                  className="navbar-btn navbar-btn-beaches"
                >
                  Beaches
                </Button>
                {beachesOpen && (
                  <div className="navbar-dropdown-menu">
                    {beaches.map((beach) => (
                      <Link
                        key={beach.id}
                        to={`/beach/${beach.id}`}
                        className="navbar-dropdown-item"
                        onClick={() => setBeachesOpen(false)}
                      >
                        {beach.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="navbar-dropdown"
                onMouseEnter={() => setInfoOpen(true)}
                onMouseLeave={() => setInfoOpen(false)}
              >
                <Button variant="subtle" className="navbar-btn navbar-btn-info">
                  Info
                </Button>
                {infoOpen && (
                  <div className="navbar-dropdown-menu">
                    {infoPages.map((page) => (
                      <Link
                        key={page.id}
                        to={`/info/${page.id}`}
                        className="navbar-dropdown-item"
                        onClick={() => setInfoOpen(false)}
                      >
                        {page.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="navbar-dropdown"
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
              >
                <Button
                  variant="subtle"
                  className="navbar-btn navbar-btn-tools"
                >
                  Tools
                </Button>
                {toolsOpen && (
                  <div className="navbar-dropdown-menu">
                    {toolsPages.map((tool) => (
                      <Link
                        key={tool.id}
                        to={`/tools/${tool.id}`}
                        className="navbar-dropdown-item"
                        onClick={() => setToolsOpen(false)}
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/forum" className="navbar-link">
                <Button
                  variant="subtle"
                  className="navbar-btn navbar-btn-forum"
                >
                  Forum
                </Button>
              </Link>

              <Link to="/about" className="navbar-link">
                <Button
                  variant="subtle"
                  className="navbar-btn navbar-btn-about"
                >
                  About
                </Button>
              </Link>
            </Group>

            {user ? (
              <>
                {isOnDashboard ? (
                  <Link to="/" className="navbar-link">
                    <Button className="navbar-btn navbar-btn-dashboard">
                      Home
                    </Button>
                  </Link>
                ) : (
                  <Link to="/dashboard" className="navbar-link">
                    <Button className="navbar-btn navbar-btn-dashboard">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  className="navbar-btn navbar-btn-logout"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="navbar-btn navbar-btn-login"
                  onClick={() => openAuth("login")}
                >
                  Login
                </Button>
                <Button
                  className="navbar-btn navbar-btn-register"
                  onClick={() => openAuth("register")}
                >
                  Register
                </Button>
              </>
            )}
          </Group>
        </Container>
      </div>

      {/* Mobile Navigation Menu - Outside navbar-wrapper for Full Width */}
      <div className={`navbar-mobile ${mobileMenuOpen ? "active" : ""}`}>
        <div className="navbar-mobile-links">
          <Link
            to="/"
            className="navbar-mobile-link-main"
            onClick={closeMobileMenu}
          >
            Home
          </Link>

          <div className="navbar-mobile-section">
            <div
              className="navbar-mobile-section-title"
              onClick={() => setMobileBeachesOpen(!mobileBeachesOpen)}
            >
              Beaches
              <span className="navbar-mobile-toggle">
                {mobileBeachesOpen ? "▼" : "▶"}
              </span>
            </div>
            {mobileBeachesOpen &&
              beaches.map((beach) => (
                <Link
                  key={beach.id}
                  to={`/beach/${beach.id}`}
                  className="navbar-mobile-link navbar-mobile-sublink"
                  onClick={closeMobileMenu}
                >
                  {beach.name}
                </Link>
              ))}
          </div>

          <div className="navbar-mobile-section">
            <div
              className="navbar-mobile-section-title"
              onClick={() => setMobileInfoOpen(!mobileInfoOpen)}
            >
              Info
              <span className="navbar-mobile-toggle">
                {mobileInfoOpen ? "▼" : "▶"}
              </span>
            </div>
            {mobileInfoOpen &&
              infoPages.map((page) => (
                <Link
                  key={page.id}
                  to={`/info/${page.id}`}
                  className="navbar-mobile-link navbar-mobile-sublink"
                  onClick={closeMobileMenu}
                >
                  {page.name}
                </Link>
              ))}
          </div>

          <div className="navbar-mobile-section">
            <div
              className="navbar-mobile-section-title"
              onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
            >
              Tools
              <span className="navbar-mobile-toggle">
                {mobileToolsOpen ? "▼" : "▶"}
              </span>
            </div>
            {mobileToolsOpen &&
              toolsPages.map((tool) => (
                <Link
                  key={tool.id}
                  to={`/tools/${tool.id}`}
                  className="navbar-mobile-link navbar-mobile-sublink"
                  onClick={closeMobileMenu}
                >
                  {tool.name}
                </Link>
              ))}
          </div>

          <Link
            to="/forum"
            className="navbar-mobile-link-main"
            onClick={closeMobileMenu}
          >
            Forum
          </Link>

          <Link
            to="/about"
            className="navbar-mobile-link-main"
            onClick={closeMobileMenu}
          >
            About
          </Link>

          <div className="navbar-mobile-actions">
            {user ? (
              <>
                <Link
                  to={isOnDashboard ? "/" : "/dashboard"}
                  className="navbar-mobile-btn navbar-mobile-btn-dashboard"
                  onClick={closeMobileMenu}
                >
                  {isOnDashboard ? "Home" : "Dashboard"}
                </Link>
                <button
                  className="navbar-mobile-btn navbar-mobile-btn-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="navbar-mobile-btn navbar-mobile-btn-login"
                  onClick={() => {
                    openAuth("login");
                    closeMobileMenu();
                  }}
                >
                  Login
                </button>
                <button
                  className="navbar-mobile-btn navbar-mobile-btn-register"
                  onClick={() => {
                    openAuth("register");
                    closeMobileMenu();
                  }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
