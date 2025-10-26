// src/components/Navbar.jsx
import { Group, Button, Text, Container } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { UIContext } from "../context/UIContext.js";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const { openAuth } = useContext(UIContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
          <Link to="/" className="navbar-link">
            <Button variant="subtle" className="navbar-btn navbar-btn-home">
              Home
            </Button>
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">
                <Button className="navbar-btn navbar-btn-dashboard">
                  Dashboard
                </Button>
              </Link>
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
