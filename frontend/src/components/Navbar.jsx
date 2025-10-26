// src/components/Navbar.jsx
import { Group, Button, Text, Container } from "@mantine/core";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);

  return (
    <div className="navbar-wrapper">
      <Container
        size="lg"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="navbar-logo">
            <span className="navbar-logo-emoji">🌊</span>
            <Text className="navbar-logo-text" fw={700} size="xl">
              Tidy
            </Text>
          </div>
        </Link>

        <Group gap="sm">
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button variant="subtle" className="navbar-btn navbar-btn-home">
              Home
            </Button>
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <Button className="navbar-btn navbar-btn-dashboard">
                  Dashboard
                </Button>
              </Link>
              <Button className="navbar-btn navbar-btn-logout" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button className="navbar-btn navbar-btn-login">Login</Button>
              </Link>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Button className="navbar-btn navbar-btn-register">
                  Register
                </Button>
              </Link>
            </>
          )}
        </Group>
      </Container>
    </div>
  );
}
