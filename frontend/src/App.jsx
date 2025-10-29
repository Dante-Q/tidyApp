import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider, AppShell } from "@mantine/core";
import { UserProvider } from "./context/UserContext.jsx";
import { UIProvider } from "./context/UIProvider.jsx";

import Navbar from "./components/Navbar.jsx";
import GlobalDrawer from "./components/GlobalDrawer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BeachPage from "./pages/BeachPage";
import InfoPage from "./pages/InfoPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <UserProvider>
        <UIProvider>
          <Router>
            <ScrollToTop />
            <AppShell header={{ height: 60 }} padding={0}>
              <AppShell.Header>
                <Navbar />
              </AppShell.Header>

              <AppShell.Main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/beach/:beachName" element={<BeachPage />} />
                  <Route path="/info/:infoSlug" element={<InfoPage />} />
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
