import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { UserProvider } from './context/UserContext.jsx';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <UserProvider>
        <Router>
          <main className="min-h-screen bg-sky-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
        </Router>
      </UserProvider>
    </MantineProvider>
  );
}
