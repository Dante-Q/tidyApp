import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, AppShell } from '@mantine/core';
import { UserProvider } from './context/UserContext.jsx';

import Navbar from './components/Navbar.jsx';
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
          <AppShell
            header={{ height: 60 }}
            padding="md"
            style={{ minHeight: "100vh" }}
            headerPosition="fixed"
          >
            <AppShell.Header>
              <Navbar />
            </AppShell.Header>

            <AppShell.Main>
              <Routes>
                
                <Route path="/" element={<HomePage />} />
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
              </Routes>
        
            </AppShell.Main>
            
          </AppShell>
        </Router>
        
      </UserProvider>
    </MantineProvider>
  );
}
