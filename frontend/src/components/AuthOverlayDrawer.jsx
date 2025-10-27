// AuthOverlayDrawer.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, Button } from "@mantine/core";
import "@mantine/core/styles.css"; // Add Mantine CSS
import { UserContext } from "../context/UserContext.jsx";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

export default function AuthOverlayDrawer({
  opened,
  onClose,
  initialMode = "login",
}) {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);

  console.log("AuthOverlayDrawer rendered:", { opened, mode }); // Debug log

  // Sync local mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const root =
      typeof document !== "undefined" && document.getElementById("root");
    if (!root) return;
    if (opened) {
      root.classList.add("tidy-blur");
    } else {
      root.classList.remove("tidy-blur");
    }
    return () => root.classList.remove("tidy-blur");
  }, [opened]);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      size="md"
      position="right"
      withinPortal={true}
      zIndex={10000}
      lockScroll={false}
      transitionProps={{
        transition: "slide-left",
        duration: 400,
        timingFunction: "ease",
      }}
      styles={() => ({
        root: { position: "fixed" },
        overlay: {
          position: "fixed",
          zIndex: 9999,
        },
        drawer: {
          position: "fixed",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          zIndex: 10000,
        },
        title: {
          color: "#ffffff",
          fontSize: "1.5rem",
          fontWeight: 600,
        },
        body: {
          marginTop: "20px",
          padding: "24px",
          background: "transparent",
          height: "100%",
        },
      })}
    >
      {mode === "login" ? (
        <LoginPage
          onLogin={(userData) => {
            login(userData);
            onClose();
            navigate("/dashboard");
          }}
        />
      ) : (
        <RegisterPage
          onRegister={(userData) => {
            login(userData);
            onClose();
            navigate("/dashboard");
          }}
        />
      )}

      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          marginTop: "20px",
          paddingTop: "20px",
        }}
      >
        <Button
          variant="subtle"
          fullWidth
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          styles={{
            root: {
              height: "42px",
              color: "#6dd5ed",
              "&:hover": {
                background: "rgba(109, 213, 237, 0.1)",
              },
            },
          }}
        >
          {mode === "login"
            ? "Need an account? Create one"
            : "Already have an account? Login"}
        </Button>
      </div>
    </Drawer>
  );
}
