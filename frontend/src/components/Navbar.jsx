// src/components/Navbar.jsx
import { Group, Button, Text, Container } from "@mantine/core";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { UIContext } from "../context/UIContext.js";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const { openAuth } = useContext(UIContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [beachesOpen, setBeachesOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isOnDashboard = location.pathname === "/dashboard";

  return (
    <div className="navbar-wrapper">
      <Container size="lg" className="navbar-container">
        <Link to="/" className="navbar-link">
          <div className="navbar-logo">
            <span className="navbar-logo-emoji">🌊</span>
            <Text className="navbar-logo-text" fw={700} size="xl">
              Tidy
            </Text>
          </div>
        </Link>

        <Group gap="sm">
          <div
            className="navbar-dropdown"
            onMouseEnter={() => setBeachesOpen(true)}
            onMouseLeave={() => setBeachesOpen(false)}
          >
            <Button variant="subtle" className="navbar-btn navbar-btn-beaches">
              Beaches
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginLeft: "4px" }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
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
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginLeft: "4px" }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
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

          <Link to="/forum" className="navbar-link">
            <Button variant="subtle" className="navbar-btn navbar-btn-forum">
              Forum
            </Button>
          </Link>

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
  );
}
