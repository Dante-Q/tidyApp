import { createContext } from "react";

export const UIContext = createContext({
  authOpen: false,
  authMode: "login",
  openAuth: () => {},
  closeAuth: () => {},
  setAuthMode: () => {},
});
