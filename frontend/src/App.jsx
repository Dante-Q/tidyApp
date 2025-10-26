import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Router>
        <main className="min-h-screen bg-sky-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
          <footer className="mt-10 text-sm text-slate-500 text-center">
            © {new Date().getFullYear()} Tidy. Built with React + Vite.
          </footer>
        </main>
      </Router>
    </MantineProvider>
  )
}
