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
import AboutPage from "./pages/AboutPage.jsx";
import ForumHomePage from "./pages/ForumHomePage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import SubcategoryPage from "./pages/SubcategoryPage.jsx";
import CreatePostPage from "./pages/CreatePostPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import EditPostPage from "./pages/EditPostPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import SurfReportPage from "./pages/SurfReportPage.jsx";
import TidesPage from "./pages/TidesPage.jsx";
import WindPage from "./pages/WindPage.jsx";
import MapPage from "./pages/MapPage.jsx";
import CamsPage from "./pages/CamsPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light", // Force light theme always
      }}
    >
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
                  <Route path="/about" element={<AboutPage />} />
                  <Route
                    path="/tools/surf-report"
                    element={<SurfReportPage />}
                  />
                  <Route path="/tools/tides" element={<TidesPage />} />
                  <Route path="/tools/wind" element={<WindPage />} />
                  <Route path="/tools/map" element={<MapPage />} />
                  <Route path="/tools/cams" element={<CamsPage />} />
                  <Route path="/forum" element={<ForumHomePage />} />
                  <Route
                    path="/forum/category/:categorySlug"
                    element={<CategoryPage />}
                  />
                  <Route
                    path="/forum/category/:categorySlug/:subcategorySlug"
                    element={<SubcategoryPage />}
                  />
                  <Route
                    path="/forum/post/:postId"
                    element={<PostDetailPage />}
                  />
                  <Route
                    path="/forum/create-post"
                    element={<CreatePostPage />}
                  />
                  <Route
                    path="/forum/edit/:postId"
                    element={<EditPostPage />}
                  />
                  <Route
                    path="/profile/:userId"
                    element={<UserProfilePage />}
                  />
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
