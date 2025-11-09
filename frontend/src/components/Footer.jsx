import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Reset to closed when switching to mobile
      if (mobile) {
        setIsFooterOpen(false);
      } else {
        setIsFooterOpen(true); // Always open on desktop
      }
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFooter = () => {
    if (isMobile) {
      setIsFooterOpen(!isFooterOpen);
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") navigate("/");
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
    window.scrollTo(0, 0);
  };

  const footerSections = [
    {
      title: "Beaches",
      links: [
        { name: "Muizenberg", path: "/beach/muizenberg" },
        { name: "Blouberg", path: "/beach/blouberg" },
        { name: "Camps Bay", path: "/beach/camps-bay" },
        { name: "Clifton", path: "/beach/clifton" },
        { name: "Llandudno", path: "/beach/llandudno" },
        { name: "Long Beach", path: "/beach/long-beach" },
      ],
    },
    {
      title: "Tools",
      links: [
        { name: "Surf Report", path: "/tools/surf-report" },
        { name: "Tides", path: "/tools/tides" },
        { name: "Wind Conditions", path: "/tools/wind" },
        { name: "Beach Map", path: "/tools/map" },
        { name: "Live Cams", path: "/tools/cams" },
      ],
    },
    {
      title: "Information",
      links: [
        { name: "Surfing Guide", path: "/info/surfing-guide" },
        { name: "Safety Tips", path: "/info/safety-tips" },
        { name: "Beach Etiquette", path: "/info/beach-etiquette" },
        { name: "Weather Info", path: "/info/weather-info" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "Forum", path: "/forum" },
        { name: "About Us", path: "/about" },
        { name: "Dashboard", path: "/dashboard" },
      ],
    },
  ];

  return (
    <>
      {/* Toggle Button Container (Mobile only) */}
      {isMobile && (
        <div className="footer-toggle-container">
          <button
            className="footer-toggle-btn"
            onClick={toggleFooter}
            aria-label={isFooterOpen ? "Collapse footer" : "Expand footer"}
          >
            <span
              className={`footer-toggle-arrow ${isFooterOpen ? "open" : ""}`}
            >
              ▲
            </span>
          </button>
        </div>
      )}

      <footer className="footer" style={{ padding: 0 }}>
        <div
          className={`footer-container ${
            isFooterOpen || !isMobile ? "footer-open" : "footer-closed"
          }`}
        >
          {/* Logo and Description */}
          <div className="footer-brand">
            <a href="/" className="footer-logo" onClick={handleLogoClick}>
              <img
                src="/tidy.svg"
                alt="Tidy Logo"
                className="footer-logo-emoji"
              />
              <span className="footer-logo-text">TidyApp</span>
            </a>
            <p className="footer-description">
              Your ultimate guide to Cape Town's beaches. Real-time surf
              reports, tide predictions, and community insights.
            </p>
            <div className="footer-social">
              <span className="footer-tagline">Catch the perfect wave 🏄‍♂️</span>
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer-links">
            {footerSections.map((section) => (
              <div key={section.title} className="footer-section">
                <h3 className="footer-section-title">{section.title}</h3>
                <ul className="footer-section-list">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-container">
            <p className="footer-copyright">
              © {currentYear} TidyApp. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/about" className="footer-bottom-link">
                Privacy Policy
              </Link>
              <span className="footer-separator">•</span>
              <Link to="/about" className="footer-bottom-link">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
