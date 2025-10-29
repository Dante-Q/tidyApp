import { useState } from "react";
// Separate files required for Vite Fast Refresh: context definition (.js) and provider component (.jsx)
// This is NOT a circular import - UserContext.js exports the context, this file imports and uses it
import { UserContext } from "./UserContext.js";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    try {
      await axios.post(
        API_ENDPOINTS.auth.logout,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
