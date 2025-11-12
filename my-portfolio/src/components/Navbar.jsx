import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { Link, animateScroll as scroll } from "react-scroll";

export default function Navbar({ darkMode, toggleTheme }) {
  const [activeSection, setActiveSection] = useState("hero");
  const [navbarBg, setNavbarBg] = useState("gradient"); // Default for hero

  const navLinks = ["hero", "about", "projects", "contact"];

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);

            if (id === "hero") setNavbarBg("gradient");
            else setNavbarBg("split");
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  // 🎨 Background logic — left side blue, right side white (or dark)
  const getNavbarBackground = () => {
    if (navbarBg === "gradient") {
      return darkMode
        ? "linear-gradient(90deg, #0a0a0a, #1e1e1e, #1a1a40)"
        : "linear-gradient(90deg, #0d6efd, #6610f2)";
    } else if (navbarBg === "split") {
      return darkMode
        ? "linear-gradient(90deg, #0d6efd 50%, #111111 100%)"
        : "linear-gradient(90deg, #0d6efd 50%, #ffffff 100%)";
    }
    return "transparent";
  };

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top shadow-sm ${
        darkMode ? "navbar-dark" : "navbar-light"
      }`}
      style={{
        background: getNavbarBackground(),
        transition: "all 0.6s ease",
        boxShadow:
          navbarBg === "split"
            ? "0 4px 15px rgba(0,0,0,0.15)"
            : "0 4px 10px rgba(0,0,0,0.2)",
        borderBottom:
          navbarBg === "split"
            ? darkMode
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.1)"
            : "none",
        backgroundSize: "200% 200%",
        animation: "moveGradient 6s ease infinite",
        zIndex: 1050,
      }}
    >
      <div className="container d-flex align-items-center justify-content-between">
        {/* 🔹 Logo + Title */}
        <div
          className="d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => scroll.scrollToTop()}
        >
          <img
            src="/Logo.png"
            alt="Logo"
            className="me-2 rounded-circle shadow-sm"
            style={{
              width: "42px",
              height: "42px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <span
            className="navbar-brand fw-bold mb-0 fs-5"
            style={{
              color:
                navbarBg === "split"
                  ? darkMode
                    ? "#0dcaf0"
                    : "#ffffff"
                  : "#fff",
              textShadow:
                navbarBg === "gradient" && !darkMode
                  ? "0 0 8px rgba(255,255,255,0.6)"
                  : "none",
              letterSpacing: "0.5px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            MyPortfolio
          </span>
        </div>

        {/* 🔹 Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 🔹 Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 text-center text-lg-start">
            {navLinks.map((section) => (
              <li className="nav-item" key={section}>
                <Link
                  to={section}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className={`nav-link px-3 ${
                    activeSection === section ? "fw-bold" : ""
                  }`}
                  style={{
                    color:
                      navbarBg === "split"
                        ? darkMode
                          ? activeSection === section
                            ? "#0dcaf0"
                            : "#ccc"
                          : activeSection === section
                          ? "#0d6efd"
                          : "#333"
                        : activeSection === section
                        ? "#FFD700"
                        : "#fff",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color =
                      navbarBg === "split"
                        ? darkMode
                          ? "#0dcaf0"
                          : "#0d6efd"
                        : "#FFD700";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color =
                      navbarBg === "split"
                        ? darkMode
                          ? activeSection === section
                            ? "#0dcaf0"
                            : "#ccc"
                          : activeSection === section
                          ? "#0d6efd"
                          : "#333"
                        : activeSection === section
                        ? "#FFD700"
                        : "#fff";
                  }}
                  onSetActive={() => setActiveSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Link>
              </li>
            ))}
          </ul>

          {/* 🔹 Theme Toggle */}
          <div className="ms-lg-3 text-center mt-3 mt-lg-0">
            <button
              className={`btn rounded-circle p-2 ${
                navbarBg === "split"
                  ? darkMode
                    ? "btn-outline-info"
                    : "btn-outline-primary"
                  : "btn-outline-light"
              }`}
              onClick={toggleTheme}
              style={{
                width: "42px",
                height: "42px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "rotate(25deg) scale(1.2)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(0,0,0,0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "rotate(0deg) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {darkMode ? (
                <FaSun className="text-warning" />
              ) : (
                <FaMoon
                  className={
                    navbarBg === "split" && !darkMode
                      ? "text-dark"
                      : "text-light"
                  }
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Inline Animation */}
      <style>
        {`
          @keyframes moveGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
            
        `}
        
      </style>
    </nav>
  );
}
