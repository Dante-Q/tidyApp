// AuthOverlayDrawer.jsx
import { useContext, useState, useEffect } from "react";
import { Drawer, Button } from "@mantine/core";
import "@mantine/core/styles.css"; // Add Mantine CSS
import { UserContext } from "../context/UserContext.js";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

export default function AuthOverlayDrawer({
  opened,
  onClose,
  initialMode = "login",
}) {
  const { login } = useContext(UserContext);
  const [mode, setMode] = useState(initialMode);

  // Sync local mode when initialMode changes or when drawer opens
  useEffect(() => {
    if (opened) {
      setMode(initialMode);
    }
  }, [initialMode, opened]);

  // Handle blur effect and prevent layout shift from scrollbar
  useEffect(() => {
    const root =
      typeof document !== "undefined" && document.getElementById("root");
    const navbar =
      typeof document !== "undefined" &&
      document.querySelector(".navbar-wrapper");
    if (!root) return;

    if (opened) {
      root.classList.add("tidy-blur");

      // Prevent body scroll and compensate for scrollbar width
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        if (navbar) {
          navbar.style.paddingRight = `${scrollbarWidth}px`;
        }
      }
    } else {
      root.classList.remove("tidy-blur");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      if (navbar) {
        navbar.style.paddingRight = "";
      }
    }

    return () => {
      root.classList.remove("tidy-blur");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      if (navbar) {
        navbar.style.paddingRight = "";
      }
    };
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
          position: "relative",
        },
      })}
    >
      {/* Custom Close Button - Mobile Only */}
      <button
        onClick={onClose}
        className="auth-drawer-close-btn"
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          color: "rgba(255, 255, 255, 0.5)",
          width: "40px",
          height: "40px",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "20px",
          fontWeight: "bold",
          transition: "all 0.2s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(109, 213, 237, 0.15)";
          e.currentTarget.style.borderColor = "rgba(109, 213, 237, 0.3)";
          e.currentTarget.style.color = "#ffffff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
        }}
      >
        ×
      </button>

      {mode === "login" ? (
        <LoginPage
          onLogin={(userData) => {
            login(userData);
            onClose();
            // Keep user on current page after login
          }}
          onForgotPassword={() => setMode("forgot-password")}
        />
      ) : mode === "register" ? (
        <RegisterPage onClose={onClose} />
      ) : (
        <ForgotPasswordPage
          onSuccess={() => {
            onClose();
            // Navigate to OTP page
          }}
        />
      )}

      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          marginTop: "20px",
          paddingTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {mode !== "forgot-password" && (
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
        )}

        {mode === "forgot-password" && (
          <Button
            variant="subtle"
            fullWidth
            onClick={() => setMode("login")}
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
            Back to login
          </Button>
        )}
      </div>
    </Drawer>
  );
}
