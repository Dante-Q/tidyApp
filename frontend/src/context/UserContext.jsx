import { useState, useEffect } from "react";
// Separate files required for Vite Fast Refresh: context definition (.js) and provider component (.jsx)
// This is NOT a circular import - UserContext.js exports the context, this file imports and uses it
import { UserContext } from "./UserContext.js";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.auth.me, {
          withCredentials: true,
        });
        setUser({
          id: response.data._id,
          name: response.data.name,
        });
      } catch {
        // User not logged in, that's ok
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
