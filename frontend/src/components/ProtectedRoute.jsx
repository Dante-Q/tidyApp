import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const { user, login } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        login(res.data);
        setAuthorized(true);
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      checkAuth();
    } else {
      setAuthorized(true);
      setLoading(false);
    }
  }, [user, login]);

  if (loading) return <div>Loading...</div>;
  if (!authorized) return <Navigate to="/login" />;

  return children;
}
