import React, { useState, useEffect, useRef } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { Link, animateScroll as scroll } from "react-scroll";

export default function Navbar({ darkMode, toggleTheme }) {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled]           = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [cursorPos, setCursorPos]         = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);

  const navLinks = ["hero", "about", "projects", "contact"];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Section observer
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.4 }
    );
    sections.forEach(s => observer.observe(s));
    return () => sections.forEach(s => observer.unobserve(s));
  }, []);

  // Custom cursor with smooth lag effect
  useEffect(() => {
    let animFrame;
    let cx = -100, cy = -100;
    let tx = -100, ty = -100;

    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };

    const animate = () => {
      cx += (tx - cx) * 0.13;
      cy += (ty - cy) * 0.13;
      setCursorPos({ x: cx, y: cy });
      animFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    animFrame = requestAnimationFrame(animate);

    // Hover detection on interactive elements
    const setupHover = () => {
      document.querySelectorAll("a, button, [data-hover]").forEach(el => {
        el.addEventListener("mouseenter", () => setCursorHovered(true));
        el.addEventListener("mouseleave", () => setCursorHovered(false));
      });
    };
    setupHover();
    const mo = new MutationObserver(setupHover);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animFrame);
      mo.disconnect();
    };
  }, []);

  // Close menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 992) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Theme tokens
  const accent       = darkMode ? "#22d3ee"               : "#0891b2";
  const accentGlow   = darkMode ? "rgba(34,211,238,0.35)" : "rgba(8,145,178,0.3)";
  const accentDim    = darkMode ? "rgba(34,211,238,0.08)" : "rgba(8,145,178,0.07)";
  const textColor    = darkMode ? "#94a3b8"               : "#475569";
  const mobileBg     = darkMode ? "#0d1525"               : "#f0f9ff";
  const mobileBorder = darkMode ? "rgba(34,211,238,0.15)" : "rgba(8,145,178,0.15)";
  const navBg        = darkMode
    ? scrolled ? "rgba(8,14,26,0.94)"    : "rgba(8,14,26,0.55)"
    : scrolled ? "rgba(240,249,255,0.97)": "rgba(240,249,255,0.72)";

  return (
    <>
      <style>{`
        /* ── Hide default cursor ── */
        *, *::before, *::after { cursor: none !important; }

        /* ── Custom cursor dot ── */
        .cursor-dot {
          position: fixed;
          pointer-events: none;
          z-index: 99999;
          border-radius: 50%;
          mix-blend-mode: ${darkMode ? "screen" : "multiply"};
          transition: width 0.22s ease, height 0.22s ease,
                      background 0.22s ease, border 0.22s ease,
                      box-shadow 0.22s ease, margin 0.22s ease;
        }
        .cursor-dot.idle {
          width: 10px; height: 10px;
          background: ${accent};
          box-shadow: 0 0 14px ${accentGlow}, 0 0 4px ${accent};
          margin-left: -5px; margin-top: -5px;
        }
        .cursor-dot.hovered {
          width: 26px; height: 26px;
          background: transparent;
          border: 2px solid ${accent};
          box-shadow: 0 0 22px ${accentGlow};
          margin-left: -13px; margin-top: -13px;
        }

        /* ── Trailing ring ── */
        .cursor-trail {
          position: fixed;
          pointer-events: none;
          z-index: 99998;
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1px solid ${accentGlow};
          margin-left: -20px; margin-top: -20px;
          transition: opacity 0.5s;
        }

        /* ── Desktop nav links ── */
        .nav-link-custom {
          position: relative;
          font-family: 'Poppins', sans-serif;
          font-size: 0.88rem; font-weight: 500;
          letter-spacing: 0.5px;
          padding: 6px 16px !important;
          text-decoration: none;
          border-radius: 8px;
          transition: color 0.3s ease, background 0.3s ease;
        }
        .nav-link-custom::after {
          content: ''; position: absolute;
          bottom: 2px; left: 50%;
          transform: translateX(-50%);
          width: 0; height: 2px;
          background: ${accent}; border-radius: 2px;
          transition: width 0.35s cubic-bezier(.22,.68,0,1.2);
        }
        .nav-link-custom:hover::after,
        .nav-link-custom.active-link::after { width: 50%; }
        .nav-link-custom:hover   { color: ${accent} !important; background: ${accentDim}; }
        .nav-link-custom.active-link { color: ${accent} !important; }

        /* ── Toggle button ── */
        .toggle-btn {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1.5px solid ${accentGlow};
          background: ${accentDim};
          display: flex; align-items: center; justify-content: center;
          transition: all 0.35s ease; color: ${accent}; outline: none;
        }
        .toggle-btn:hover {
          background: ${accent};
          color: ${darkMode ? "#080e1a" : "#fff"};
          transform: rotate(22deg) scale(1.12);
          box-shadow: 0 0 22px ${accentGlow};
        }

        /* ── Logo ── */
        .logo-img {
          transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), box-shadow 0.35s ease;
        }
        .logo-img:hover {
          transform: scale(1.12) rotate(-5deg);
          box-shadow: 0 0 20px ${accentGlow} !important;
        }

        /* ── Hamburger ── */
        .hamburger-wrap {
          display: flex; flex-direction: column; gap: 5px;
          padding: 7px 8px;
          border: 1.5px solid ${accentGlow};
          border-radius: 8px; background: ${accentDim};
          transition: background 0.3s;
        }
        .hamburger-wrap:hover { background: ${accent}22; }
        .hamburger-wrap span {
          display: block; width: 20px; height: 2px;
          border-radius: 2px; background: ${accent};
          transition: all 0.35s cubic-bezier(.22,.68,0,1.2);
        }
        .hamburger-wrap.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger-wrap.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger-wrap.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Mobile dropdown ── */
        @media (max-width: 991px) {
          .desktop-links { display: none !important; }
        }
        @media (min-width: 992px) {
          .mobile-hamburger { display: none !important; }
          .mobile-menu      { display: none !important; }
        }

        .mobile-menu {
          position: fixed;
          top: 68px; left: 0; right: 0;
          background: ${mobileBg};
          border-bottom: 1px solid ${mobileBorder};
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          padding: 10px 16px 18px;
          z-index: 1040;
          transform: translateY(-110%);
          opacity: 0;
          transition: transform 0.42s cubic-bezier(.22,.68,0,1.15), opacity 0.3s ease;
          box-shadow: 0 16px 40px rgba(0,0,0,${darkMode ? "0.5" : "0.1"});
        }
        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
        }

        /* ── Mobile nav items ── */
        .mobile-nav-link {
          display: flex; align-items: center;
          font-family: 'Poppins', sans-serif;
          font-size: 0.98rem; font-weight: 500;
          color: ${textColor};
          padding: 13px 16px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.28s ease;
          border: 1px solid transparent;
          margin-bottom: 3px;
          letter-spacing: 0.3px;
        }
        .mobile-nav-link:hover,
        .mobile-nav-link.active-link {
          color: ${accent} !important;
          background: ${accentDim};
          border-color: ${mobileBorder};
          padding-left: 22px;
        }
        .mobile-nav-link .m-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: ${accent}; margin-right: 12px;
          opacity: 0; transition: opacity 0.25s;
          flex-shrink: 0;
        }
        .mobile-nav-link.active-link .m-dot { opacity: 1; }

        .mobile-divider {
          height: 1px; background: ${mobileBorder}; margin: 10px 0;
        }
        .mobile-theme-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 4px 16px 0;
        }
        .mobile-theme-label {
          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem; color: ${textColor};
        }
      `}</style>

      {/* ── Custom Cursor ── */}
      <div
        className={`cursor-dot ${cursorHovered ? "hovered" : "idle"}`}
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
      <div
        className="cursor-trail"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 1050,
        background: navBg,
        backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
        borderBottom: `1px solid ${scrolled ? accentGlow : "transparent"}`,
        boxShadow: scrolled ? `0 4px 28px rgba(0,0,0,${darkMode ? "0.45" : "0.08"})` : "none",
        transition: "all 0.4s ease",
        padding: "12px 0",
      }}>
        <div className="container d-flex align-items-center justify-content-between">

          {/* Logo */}
          <div
            className="d-flex align-items-center"
            style={{ gap: "10px" }}
            onClick={() => { scroll.scrollToTop(); setMenuOpen(false); }}
            data-hover
          >
            <img
              src="/Logo.png" alt="Logo"
              className="logo-img rounded-circle"
              style={{
                width: "40px", height: "40px",
                border: `2px solid ${accent}`,
                boxShadow: `0 0 12px ${accentGlow}`,
              }}
            />
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700, fontSize: "1.05rem",
              color: accent, letterSpacing: "0.4px",
            }}>
              Arun📈Portfolio
            </span>
          </div>

          {/* Desktop links */}
          <ul className="navbar-nav ms-auto mb-0 d-none d-lg-flex flex-row align-items-center desktop-links" style={{ gap: "4px" }}>
            {navLinks.map(section => (
              <li className="nav-item" key={section}>
                <Link
                  to={section} spy smooth offset={-70} duration={500}
                  className={`nav-link nav-link-custom ${activeSection === section ? "active-link" : ""}`}
                  style={{ color: activeSection === section ? accent : textColor }}
                  onSetActive={() => setActiveSection(section)}
                  data-hover
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: theme toggle + hamburger */}
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            {/* Desktop toggle */}
            <button className="toggle-btn d-none d-lg-flex" onClick={toggleTheme} data-hover>
              {darkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
            </button>

            {/* Mobile hamburger */}
            <div
              className={`hamburger-wrap mobile-hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(prev => !prev)}
              data-hover
            >
              <span /><span /><span />
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile slide-down menu ── */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map(section => (
          <Link
            key={section}
            to={section} spy smooth offset={-70} duration={500}
            className={`mobile-nav-link ${activeSection === section ? "active-link" : ""}`}
            onClick={() => setMenuOpen(false)}
            onSetActive={() => setActiveSection(section)}
          >
            <span className="m-dot" />
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Link>
        ))}

        <div className="mobile-divider" />

        {/* Theme toggle inside mobile menu */}
        <div className="mobile-theme-row">
          <span className="mobile-theme-label">
            {darkMode ? "Dark Mode" : "Light Mode"}
          </span>
          <button
            className="toggle-btn"
            style={{ width: "36px", height: "36px" }}
            onClick={toggleTheme}
            data-hover
          >
            {darkMode ? <FaSun size={13} /> : <FaMoon size={13} />}
          </button>
        </div>
      </div>
    </>
  );
}