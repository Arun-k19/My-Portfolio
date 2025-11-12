import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaBootstrap,
  FaNodeJs,
  FaDatabase,
  FaJava,
  FaPython,
} from "react-icons/fa";
import { SiMongodb, SiExpress, SiLeetcode } from "react-icons/si";
import { Link } from "react-scroll";

export default function About() {
  const skillsList = [
    { name: "HTML", icon: <FaHtml5 />, gradient: "linear-gradient(135deg, #ff512f, #dd2476)" },
    { name: "CSS", icon: <FaCss3Alt />, gradient: "linear-gradient(135deg, #1f8ef1, #0072ff)" },
    { name: "JavaScript", icon: <FaJs />, gradient: "linear-gradient(135deg, #F7971E, #FFD200)" },
    { name: "React", icon: <FaReact />, gradient: "linear-gradient(135deg, #00d2ff, #3a47d5)" },
    { name: "Bootstrap", icon: <FaBootstrap />, gradient: "linear-gradient(135deg, #6f42c1, #b77bf6)" },
    { name: "Node.js", icon: <FaNodeJs />, gradient: "linear-gradient(135deg, #11998e, #38ef7d)" },
    { name: "Express.js", icon: <SiExpress />, gradient: "linear-gradient(135deg, #434343, #000000)" },
    { name: "MongoDB", icon: <SiMongodb />, gradient: "linear-gradient(135deg, #00b09b, #96c93d)" },
    { name: "Java", icon: <FaJava />, gradient: "linear-gradient(135deg, #E65C00, #F9D423)" },
    { name: "Python", icon: <FaPython />, gradient: "linear-gradient(135deg, #396afc, #2948ff)" },
    { name: "SQL", icon: <FaDatabase />, gradient: "linear-gradient(135deg, #00b4db, #0083b0)" },
    { name: "LeetCode", icon: <SiLeetcode />, gradient: "linear-gradient(135deg, #ff9a9e, #fad0c4)" },
  ];

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section
      id="about"
      className="py-5 position-relative text-white overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Floating Orbs */}
      <FaHtml5 className="tech-orb" style={{ top: "8%", left: "6%", opacity: 0.15 }} />
      <FaReact className="tech-orb" style={{ bottom: "18%", right: "10%", opacity: 0.15 }} />

      <div className="container position-relative" data-aos="fade-up">
        {/* Title */}
        <h2
          className="text-center fw-bold mb-4"
          style={{
            fontSize: "2.3rem",
            color: "#fff",
          }}
        >
          About Me <span style={{ fontSize: "1.8rem" }}>👨‍💻</span>
        </h2>

        {/* Paragraph Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center" data-aos="fade-right">
            <p className="lead mb-3" style={{ lineHeight: "1.8" }}>
              Hi! I'm <strong>Arun</strong>, a{" "}
              <span className="text-warning fw-semibold">Java Full Stack Developer</span> from
              Tiruchirappalli, passionate about building web applications that blend creativity with
              functionality.
            </p>
            <p style={{ lineHeight: "1.8" }}>
              I work with technologies like <strong>Java,React, Node.js, and MongoDB</strong> to craft
              dynamic and responsive interfaces. Beyond that, I constantly upskill myself through
              <span className="text-warning"> LeetCode problem solving</span> and full-stack
              projects that challenge me to grow as a developer 🚀.
            </p>

            <Link
              to="contact"
              smooth={true}
              duration={800}
              className="btn btn-light btn-lg mt-3 fw-semibold shadow-sm"
              style={{
                transition: "all 0.3s ease",
                borderRadius: "10px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Let’s Connect 💬
            </Link>
          </div>
        </div>

        {/* My Skills Section */}
        <div data-aos="fade-up">
          <h4
            className="fw-bold text-center mb-4"
            style={{
              color: "#fff",
              textShadow: "0 0 12px rgba(255,255,255,0.2)",
            }}
          >
            My Skills
          </h4>

          <div className="skills-grid">
            {skillsList.map((skill, index) => (
              <div
                key={index}
                className="skill-bubble"
                style={{
                  background: skill.gradient,
                }}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="bubble-inner">
                  <div className="icon">{skill.icon}</div>
                  <p className="skill-name">{skill.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          .tech-orb {
            position: absolute;
            font-size: 2.5rem;
            animation: float 6s ease-in-out infinite;
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }

          /* Bubble Style Grid */
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
            gap: 25px;
            justify-items: center;
          }

          .skill-bubble {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            position: relative;
            transition: all 0.4s ease;
            cursor: pointer;
            overflow: hidden;
          }

          .skill-bubble::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            transform: scale(0);
            transition: transform 0.5s ease;
          }

          .skill-bubble:hover::after {
            transform: scale(1.1);
          }

          .bubble-inner {
            z-index: 2;
            text-align: center;
          }

          .icon {
            font-size: 2rem;
            transition: transform 0.4s ease;
          }

          .skill-bubble:hover .icon {
            transform: scale(1.3) rotate(8deg);
          }

          .skill-name {
            font-weight: 600;
            font-size: 0.9rem;
            margin-top: 10px;
            color: #fff;
            text-shadow: 0 0 8px rgba(0,0,0,0.3);
          }

          .skill-bubble:hover {
            transform: translateY(-10px);
            box-shadow: 0 0 30px rgba(255,255,255,0.3);
          }
        `}
      </style>
    </section>
  );
}
