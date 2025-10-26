// src/components/Navbar.jsx
import { Group, Button, Text, Container } from "@mantine/core";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);

  return (
    <Container
      size="lg"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Text fw={700} size="xl">
        TidyApp
      </Text>

      <Group gap="sm">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="subtle">Home</Button>
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <Button variant="light">Dashboard</Button>
            </Link>
            <Button color="red" variant="outline" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button variant="light">Login</Button>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button variant="outline">Register</Button>
            </Link>
          </>
        )}
      </Group>
    </Container>
  );
}
