// AuthOverlayDrawer.jsx
import { useContext, useState, useEffect } from "react";
import { Drawer, Button } from "@mantine/core";
import "@mantine/core/styles.css"; // Add Mantine CSS
import { UserContext } from "../context/UserContext.jsx";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

export default function AuthOverlayDrawer({ opened, onClose }) {
  const { login } = useContext(UserContext);
  const [mode, setMode] = useState("login");

  console.log("AuthOverlayDrawer rendered:", { opened, mode }); // Debug log

  // detect mobile to reduce blur for performance
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq =
      typeof window !== "undefined" && window.matchMedia("(max-width: 640px)");
    const handle = (e) => setIsMobile(!!e.matches);
    if (mq) {
      handle(mq);
      mq.addEventListener
        ? mq.addEventListener("change", handle)
        : mq.addListener(handle);
    }
    return () => {
      if (mq)
        mq.removeEventListener
          ? mq.removeEventListener("change", handle)
          : mq.removeListener(handle);
    };
  }, []);
  // apply a blur class to the app root so header/hero are blurred (portal content isn't affected)
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
      transitionProps={{
        transition: "slide-left",
        duration: 400,
        timingFunction: "ease",
      }}
      overlayProps={{
        opacity: 0,
        style: {
          backdropFilter: "none",
          backgroundColor: isMobile ? "rgba(2,6,23,0.18)" : "rgba(2,6,23,0.18)",
          transition: "opacity 200ms ease, background-color 200ms ease",
        },
        // ensure overlay sits above headers/other layout elements
        zIndex: 9999,
      }}
      styles={(theme) => ({
        root: { position: "fixed" },
        overlay: {
          position: "fixed",
          zIndex: 9999,
        },
        drawer: {
          position: "fixed",
          background: theme.white,
          zIndex: 10000,
        },
        title: {
          color: "#0f172a",
          fontSize: "1.5rem",
          fontWeight: 600,
        },
        body: {
          marginTop: "20px",
          padding: "24px",
          background: "white",
        },
      })}
    >
      {mode === "login" ? (
        <LoginPage
          onLogin={(userData) => {
            login(userData);
            onClose();
          }}
        />
      ) : (
        <RegisterPage
          onRegister={(userData) => {
            login(userData);
            onClose();
          }}
        />
      )}

      <div
        style={{
          borderTop: "1px solid #e2e8f0",
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
              "&:hover": {
                background: "#f1f5f9",
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
