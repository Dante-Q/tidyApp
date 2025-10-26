import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider, AppShell } from "@mantine/core";
import { UserProvider } from "./context/UserContext.jsx";
import { UIProvider } from "./context/UIProvider.jsx";

import Navbar from "./components/Navbar.jsx";
import GlobalDrawer from "./components/GlobalDrawer.jsx";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <UserProvider>
        <UIProvider>
          <Router>
            <AppShell header={{ height: 60 }} padding={0}>
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

            <GlobalDrawer />
          </Router>
        </UIProvider>
      </UserProvider>
    </MantineProvider>
  );
}
