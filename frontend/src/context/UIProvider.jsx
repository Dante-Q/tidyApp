import { useCallback, useMemo, useState } from "react";
import { UIContext } from "./UIContext.js";

export function UIProvider({ children }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openAuth = useCallback((mode = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const value = useMemo(
    () => ({ authOpen, authMode, openAuth, closeAuth, setAuthMode }),
    [authOpen, authMode, openAuth, closeAuth]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
