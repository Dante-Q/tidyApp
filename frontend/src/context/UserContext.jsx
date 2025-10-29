import { useState } from "react";
import { UserContext } from "./UserContext.js";

export { UserContext };

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    // Call logout endpoint if you want
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
