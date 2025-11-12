import React from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaArrowUp } from "react-icons/fa";
import { Link } from "react-scroll";

export default function Footer() {
  return (
    <footer
      className="text-white text-center py-5 position-relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* 🔹 Animated Wave Background */}
      <div
        className="wave-bg position-absolute w-100"
        style={{
          height: "150px",
          bottom: 0,
          left: 0,
          background:
            "url('https://raw.githubusercontent.com/Arun-k19/resources/main/footer-wave.svg') repeat-x",
          backgroundSize: "cover",
          opacity: 0.3,
          animation: "waveMove 10s linear infinite",
        }}
      ></div>

      {/* 🔹 Floating Glow Circle */}
      <div
        className="position-absolute"
        style={{
          width: "120px",
          height: "120px",
          background: "radial-gradient(circle, rgba(147,51,234,0.25), transparent)",
          borderRadius: "50%",
          top: "15%",
          left: "10%",
          filter: "blur(30px)",
          animation: "floatUp 6s ease-in-out infinite",
        }}
      ></div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        {/* Title */}
        <h5
          className="fw-bold mb-3"
          style={{
            textShadow: "0 0 10px rgba(255,255,255,0.4)",
            letterSpacing: "1px",
          }}
        >
          Arun Portfolio 🚀
        </h5>

        {/* Social Links */}
        <div className="d-flex justify-content-center gap-4 mb-4">
          {[
            {
              icon: <FaGithub />,
              link: "https://github.com/Arun-k19",
              color: "#FFD700",
            },
            {
              icon: <FaLinkedin />,
              link: "https://linkedin.com/in/arun-k19",
              color: "#0A66C2",
            },
            {
              icon: <FaInstagram />,
              link: "https://instagram.com/arun.__.k",
              color: "#E1306C",
            },
          ].map((s, i) => (
            <a
              key={i}
              href={s.link}
              target="_blank"
              rel="noreferrer"
              className="fs-4 text-white social-icon"
              style={{
                transition: "all 0.4s ease",
                filter: "drop-shadow(0 0 6px rgba(255,255,255,0.3))",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = s.color;
                e.currentTarget.style.transform = "scale(1.3)";
                e.currentTarget.style.textShadow = `0 0 15px ${s.color}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="mb-4">
          {[
            { label: "Home", to: "hero" },
            { label: "About", to: "about" },
            { label: "Projects", to: "projects" },
            { label: "Contact", to: "contact" },
          ].map((nav, i) => (
            <Link
              key={i}
              to={nav.to}
              smooth
              duration={800}
              className="text-white text-decoration-none mx-3 footer-link"
              style={{
                transition: "all 0.3s ease",
                position: "relative",
                fontWeight: 500,
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#0d6efd")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#fff")}
            >
              {nav.label}
            </Link>
          ))}
        </div>

        {/* Back to Top */}
        <Link
          to="hero"
          smooth
          duration={700}
          className="text-white d-inline-block mb-3"
          style={{
            cursor: "pointer",
            transition: "all 0.3s ease",
            padding: "10px 12px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            boxShadow: "0 0 10px rgba(255,255,255,0.1)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#0d6efd";
            e.currentTarget.style.boxShadow = "0 0 15px #0d6efd";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.boxShadow = "0 0 10px rgba(255,255,255,0.1)";
          }}
        >
          <FaArrowUp className="fs-5" />
        </Link>

        {/* Copyright */}
        <p
          className="mb-0 small mt-3"
          style={{
            opacity: 0.8,
            fontSize: "0.9rem",
            letterSpacing: "0.5px",
          }}
        >
          © {new Date().getFullYear()} <strong>Arun</strong> | All Rights Reserved 💜
        </p>
      </div>

      {/* 🔹 Animations */}
      <style>
        {`
          @keyframes floatUp {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }

          @keyframes waveMove {
            0% { background-position-x: 0; }
            100% { background-position-x: 1000px; }
          }

          .footer-link::after {
            content: "";
            position: absolute;
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%) scaleX(0);
            width: 60%;
            height: 2px;
            background: #0d6efd;
            border-radius: 2px;
            transition: transform 0.3s ease;
          }
          .footer-link:hover::after {
            transform: translateX(-50%) scaleX(1);
          }
        `}
      </style>
    </footer>
  );
}
