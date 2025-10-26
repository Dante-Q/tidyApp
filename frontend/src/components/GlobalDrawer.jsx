import { useContext } from "react";
import { UIContext } from "../context/UIContext.js";
import AuthOverlayDrawer from "./AuthOverlayDrawer.jsx";

export default function GlobalDrawer() {
  const { authOpen, authMode, closeAuth } = useContext(UIContext);
  return (
    <AuthOverlayDrawer
      opened={authOpen}
      onClose={closeAuth}
      initialMode={authMode}
    />
  );
}
