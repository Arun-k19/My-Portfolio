import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaJs,
} from "react-icons/fa";
import { Link } from "react-scroll";

export default function Hero() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Floating tech icons — including Java & LeetCode as images
  const techIcons = [
    { icon: <FaReact />, top: "12%", left: "8%", color: "#61DBFB", size: "2.3rem" },
    { icon: <FaHtml5 />, top: "20%", right: "10%", color: "#E44D26", size: "2.2rem" },
    { icon: <FaCss3Alt />, bottom: "25%", left: "12%", color: "#264DE4", size: "2.2rem" },
    { icon: <FaJs />, bottom: "15%", right: "15%", color: "#F0DB4F", size: "2.2rem" },
    { img: "/Java-Logo.png", top: "10%", right: "25%", size: "42px" },
    { img: "/Leetcode-Logo.png", bottom: "10%", left: "28%", size: "38px" },
    { img: "/code-logo.png", top: "45%", right: "8%", size: "38px" },
    { img: "/MOngo-logo.png", bottom: "55%", left: "6%", size: "38px" },
  ];

  return (
    <section
      id="hero"
      className="d-flex flex-column flex-lg-row justify-content-center align-items-center vh-100 px-3 overflow-hidden"
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Floating Tech Icons */}
      {techIcons.map((tech, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            top: tech.top,
            bottom: tech.bottom,
            left: tech.left,
            right: tech.right,
            color: tech.color,
            fontSize: tech.size,
            transition: "transform 1s ease-in-out, filter 0.3s",
            animation: `float${idx % 2 === 0 ? "Up" : "Down"} 5s ease-in-out infinite`,
            zIndex: 1,
          }}
        >
          {tech.icon ? (
            <div
              style={{
                filter: "drop-shadow(0 0 4px rgba(255,255,255,0.4))",
                cursor: "pointer",
                transition: "all 0.4s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.3) rotate(10deg)";
                e.currentTarget.style.filter = "drop-shadow(0 0 12px rgba(255,255,255,0.9))";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.filter = "drop-shadow(0 0 4px rgba(255,255,255,0.4))";
              }}
            >
              {tech.icon}
            </div>
          ) : (
            <img
              src={tech.img}
              alt="tech-icon"
              style={{
                width: tech.size,
                height: tech.size,
                borderRadius: "50%",
                transition: "all 0.5s ease",
                filter: "drop-shadow(0 0 6px rgba(0,0,0,0.3))",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.2)";
                e.currentTarget.style.filter = "drop-shadow(0 0 10px rgba(255,255,255,0.7))";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.filter = "drop-shadow(0 0 6px rgba(0,0,0,0.3))";
              }}
            />
          )}
        </div>
      ))}

      {/* Text Section */}
      <div
        className="text-center text-lg-start me-lg-5"
        data-aos="fade-right"
        style={{ zIndex: 2 }}
      >
        <h1 className="display-4 fw-bold text-white mb-2">Hi, I'm Arun 👋</h1>
        <h4
          className="fw-semibold mb-3"
          style={{
            color: "#f8f9fa",
            textShadow: "0 0 10px rgba(255,255,255,0.5)",
          }}
        >
          A Passionate <span className="text-warning">Java Full Stack Developer</span>
        </h4>

        {/* Buttons */}
        <div className="mt-3">
          <Link
            to="projects"
            smooth={true}
            duration={800}
            className="btn btn-primary btn-lg me-3 shadow-sm"
          >
            View Projects
          </Link>
          <a
            href="\Arun Resume final.pdf"
            className="btn btn-outline-light btn-lg shadow-sm"
            download
          >
            Download Resume
          </a>
        </div>

        {/* Social Icons */}
        <div className="d-flex justify-content-center justify-content-lg-start mt-4">
          {[
            { icon: <FaLinkedin />, link: "https://www.linkedin.com/in/arun-k1921/" },
            { icon: <FaGithub />, link: "https://github.com/Arun-k19" },
            { icon: <FaInstagram />, link: "https://instagram.com/arun.__.k" },
          ].map((s, i) => (
            <a
              key={i}
              href={s.link}
              target="_blank"
              rel="noreferrer"
              className="text-white fs-4 me-3"
              style={{ transition: "all 0.3s ease" }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.2)";
                e.currentTarget.style.color =
                  i === 0 ? "#0A66C2" : i === 1 ? "#FFD700" : "#E1306C";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.color = "#fff";
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Profile Image */}
      <div className="mt-4 mt-lg-0" data-aos="fade-left" style={{ zIndex: 2 }}>
        <img
          src="/Profile.webp"
          alt="Profile"
          className="img-fluid rounded-circle shadow-lg"
          style={{
            width: "250px",
            height: "250px",
            objectFit: "cover",
            border: "4px solid rgba(255,255,255,0.3)",
            transition: "all 0.4s",
            cursor: "pointer",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
          }}
        />
      </div>

      {/* Keyframe Animations */}
      <style>
        {`
          @keyframes floatUp {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          @keyframes floatDown {
            0% { transform: translateY(0px); }
            50% { transform: translateY(10px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </section>
  );
}
