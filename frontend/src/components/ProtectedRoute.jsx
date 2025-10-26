import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loadingUser } = useContext(UserContext);

  // While fetching user, show nothing or a loader
  if (loadingUser) return <div>Loading...</div>;

  // If no user, redirect to login
  if (!user) return <Navigate to="/login" />;

  // User is logged in
  return children;
}
