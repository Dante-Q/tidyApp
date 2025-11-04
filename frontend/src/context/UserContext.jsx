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
        const baseDisplayName = response.data.displayName || response.data.name;
        const isAdmin = response.data.isAdmin === true;
        // Show crown only if user is admin AND showAdminBadge is explicitly true
        const shouldShowCrown =
          isAdmin && response.data.showAdminBadge === true;
        const displayName = shouldShowCrown
          ? `👑 ${baseDisplayName}`
          : baseDisplayName;

        setUser({
          id: response.data._id,
          name: response.data.name,
          displayName: displayName,
          avatarColor: response.data.avatarColor || "#6dd5ed",
          // Only include admin fields if user is admin
          ...(isAdmin && {
            isAdmin: true,
            showAdminBadge: response.data.showAdminBadge === true,
          }),
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

  const login = (userData) => {
    const baseDisplayName = userData.displayName || userData.name;
    const isAdmin = userData.isAdmin === true;
    // Show crown only if user is admin AND showAdminBadge is explicitly true
    const shouldShowCrown = isAdmin && userData.showAdminBadge === true;
    const displayName = shouldShowCrown
      ? `👑 ${baseDisplayName}`
      : baseDisplayName;

    setUser({
      id: userData.id,
      name: userData.name,
      displayName: displayName,
      avatarColor: userData.avatarColor || "#6dd5ed",
      // Only include admin fields if user is admin
      ...(isAdmin && {
        isAdmin: true,
        showAdminBadge: userData.showAdminBadge === true,
      }),
    });
  };

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
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
