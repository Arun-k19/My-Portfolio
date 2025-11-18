import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaReact,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
} from "react-icons/fa";
import { SiMongodb, SiExpress } from "react-icons/si";

export default function Projects() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const projects = [
    {
      title: "CCET-Attendance Spell Management System",
      desc: "A digital attendance and spell tracking system designed to simplify class management for colleges.",
      tech: [<FaReact />, <FaJs />, <FaHtml5 />, <FaCss3Alt />],
      github: "https://github.com/Arun-k19/Attendance-spell.git",
      live: "#",
      img: "/projects/AttendaceLogin.png",
    },
    {
      title: "Portfolio Website",
      desc: "My personal portfolio showcasing skills and projects, designed with React & AOS animations.",
      tech: [<FaReact />, <FaCss3Alt />, <FaJs />],
      github: "https://github.com/Arun-k19/My-Portfolio.git",
      live: "#",
      img: "/projects/myportfolio.png",
    },
    {
      title: "Learning Management System (LMS)",
      desc: "An LMS built using HTML, CSS, and JS featuring course dashboard, progress tracking, and certification.",
      tech: [<FaHtml5 />, <FaCss3Alt />, <FaJs />],
      github: "https://github.com/Arun-k19/LMS.git",
      live: "#",
      img: "/projects/Lms.png",
    },
    {
      title: "Code Bug Buster",
      desc: "A real-time debugging platform for college symposiums — supports Java, C, and Python challenges.",
      tech: [<FaReact />, <FaJs />, <FaHtml5 />],
      github: "https://github.com/Arun-k19/Bug-Buster.git",
      live: "#",
      img: "/projects/BugBuster.png",
    },
   {
  title: "Netflix Clone",
  desc: "A fully responsive Netflix Clone built with React, TMDB API, and Firebase for user authentication. Users can browse, search, and stream movie trailers in a modern UI.",
  tech: [<FaReact />, <FaJs />, <FaHtml5 />, <FaCss3Alt />],
  github: "https://github.com/Arun-k19/Netflix-.git",
  live: "#", // live link not yet hosted, keep as '#'
  img: "/projects/Netflix.png",
},

  ];

  return (
    <section
      id="projects"
      className="py-5 text-white position-relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Floating glow orb */}
      <div
        className="position-absolute"
        style={{
          width: "140px",
          height: "140px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "50%",
          top: "15%",
          right: "8%",
          animation: "floatUp 6s ease-in-out infinite",
        }}
      ></div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <h2
          className="fw-bold text-center mb-5"
          data-aos="fade-up"
          style={{
            textShadow: "0 0 15px rgba(255,255,255,0.3)",
          }}
        >
          My Projects <span style={{ fontSize: "1.8rem" }}>🚀</span>
        </h2>

        <div className="row g-4 justify-content-center">
          {projects.map((proj, index) => (
            <div
              key={index}
              className="col-sm-10 col-md-6 col-lg-4 d-flex align-items-stretch"
              data-aos="zoom-in"
              data-aos-delay={index * 150}
            >
              <div className="project-card position-relative w-100">
                <div
                  className="project-img"
                  style={{
                    background: `url(${proj.img}) center/cover no-repeat`,
                  }}
                >
                  <div className="overlay d-flex flex-column justify-content-center align-items-center">
                    {/* 🔹 GitHub Button */}
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-light btn-sm mb-2"
                    >
                      <FaGithub className="me-1" /> View Code
                    </a>

                    {/* 🔹 Live Demo Button Logic */}
                    {proj.live && proj.live !== "#" ? (
                      <a
                        href={proj.live}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        <FaExternalLinkAlt className="me-1" /> Live Demo
                      </a>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ opacity: 0.7, cursor: "not-allowed" }}
                        onClick={() => alert("🚧 Live demo coming soon!")}
                      >
                        <FaExternalLinkAlt className="me-1" /> Coming Soon
                      </button>
                    )}
                  </div>
                </div>

                <div className="content text-center p-3 d-flex flex-column justify-content-between" style={{ height: "250px" }}>
                  <div>
                    <h5 className="fw-bold mb-2">{proj.title}</h5>
                    <p className="small mb-3 opacity-75">{proj.desc}</p>
                  </div>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    {proj.tech.map((icon, i) => (
                      <span key={i} className="fs-5 tech-icon">
                        {icon}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes floatUp {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }

          .project-card {
            background: rgba(255,255,255,0.07);
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            transition: transform 0.4s ease, box-shadow 0.4s ease;
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%; /* ✅ Equal height for all cards */
          }

          .project-card:hover {
            transform: translateY(-10px) scale(1.03);
            box-shadow: 0 15px 35px rgba(0,0,0,0.6);
          }

          .project-img {
            height: 200px;
            border-bottom: 2px solid rgba(255,255,255,0.1);
            position: relative;
            overflow: hidden;
          }

          .project-img::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent);
            transform: translateX(-100%);
            transition: 0.7s;
          }

          .project-card:hover .project-img::after {
            transform: translateX(100%);
          }

          .overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            opacity: 0;
            transition: all 0.4s ease;
          }

          .project-card:hover .overlay {
            opacity: 1;
          }

          .tech-icon {
            color: rgba(255,255,255,0.9);
            text-shadow: 0 0 10px rgba(255,255,255,0.3);
            transition: transform 0.3s ease;
          }

          .tech-icon:hover {
            transform: scale(1.3) rotate(5deg);
            text-shadow: 0 0 15px rgba(255,255,255,0.6);
          }

          .btn {
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
          }
        `}
      </style>
    </section>
  );
}
