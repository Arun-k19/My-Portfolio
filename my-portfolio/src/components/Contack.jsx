import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaPaperPlane,
} from "react-icons/fa";

export default function Contact() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Message Sent! (Backend integration coming soon 🚀)");
  };

  return (
    <section
      id="contact"
      className="py-5 position-relative text-white overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Floating Lights */}
      <div
        className="position-absolute"
        style={{
          width: "120px",
          height: "120px",
          background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent)",
          borderRadius: "50%",
          top: "10%",
          left: "5%",
          animation: "floatUp 6s ease-in-out infinite",
        }}
      ></div>
      <div
        className="position-absolute"
        style={{
          width: "150px",
          height: "150px",
          background: "radial-gradient(circle, rgba(147,51,234,0.15), transparent)",
          borderRadius: "50%",
          bottom: "15%",
          right: "10%",
          animation: "floatDown 6s ease-in-out infinite",
        }}
      ></div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <h2
          className="fw-bold text-center mb-5"
          data-aos="fade-up"
          style={{
            textShadow: "0 0 15px rgba(255,255,255,0.3)",
            letterSpacing: "1px",
          }}
        >
          Let’s Connect <span style={{ fontSize: "1.6rem" }}>🤝</span>
        </h2>

        <div className="row justify-content-center align-items-center">
          {/* 🔹 Contact Info */}
          <div className="col-md-5 mb-4" data-aos="fade-right">
            <div
              className="p-4 rounded-4 shadow-lg h-100"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h5 className="fw-semibold mb-3">Contact Info</h5>
              <p className="opacity-75">
                Feel free to reach out via email or connect with me on social platforms below.
              </p>

              <div className="d-flex align-items-center mb-3">
                <FaEnvelope className="me-3 fs-5 text-light" />
                <span>arunk741921@gmail.com</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <FaPhoneAlt className="me-3 fs-5 text-light" />
                <span>+91 7418771921</span>
              </div>
              <div className="d-flex align-items-center mb-4">
                <FaMapMarkerAlt className="me-3 fs-5 text-light" />
                <span>Tiruchirappalli, Tamil Nadu</span>
              </div>

              {/* 🔹 Social Links */}
              <div className="d-flex gap-3 mt-4">
                <a
                  href="https://github.com/Arun-k19"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white fs-4"
                  style={{ transition: "all 0.3s ease" }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#FFD700")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#fff")}
                >
                  <FaGithub />
                </a>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white fs-4"
                  style={{ transition: "all 0.3s ease" }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#0A66C2")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#fff")}
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://instagram.com/arun.__.k"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white fs-4"
                  style={{ transition: "all 0.3s ease" }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#E1306C")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#fff")}
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>

          {/* 🔹 Contact Form */}
          <div className="col-md-7" data-aos="fade-left">
            <form
              onSubmit={handleSubmit}
              className="p-4 rounded-4 shadow-lg"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="form-floating mb-4">
                <input
                  type="text"
                  className="form-control border-0 text-white contact-field"
                  id="name"
                  placeholder="Your Name"
                  required
                />
                <label htmlFor="name">Your Name</label>
              </div>

              <div className="form-floating mb-4">
                <input
                  type="email"
                  className="form-control border-0 text-white contact-field"
                  id="email"
                  placeholder="Your Email"
                  required
                />
                <label htmlFor="email">Your Email</label>
              </div>

              <div className="form-floating mb-4">
                <textarea
                  className="form-control border-0 text-white contact-field"
                  id="message"
                  placeholder="Message"
                  style={{ height: "130px" }}
                  required
                ></textarea>
                <label htmlFor="message">Message</label>
              </div>

              <button type="submit" className="btn w-100 fw-semibold py-2 send-btn">
                <FaPaperPlane className="me-2" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Styles */}
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

          .contact-field {
            background: rgba(255,255,255,0.07);
            border-radius: 10px;
            transition: all 0.3s ease;
          }

          .contact-field:focus {
            background: rgba(255,255,255,0.15);
            box-shadow: 0 0 10px rgba(147,51,234,0.5);
            transform: scale(1.02);
          }

          .form-floating label {
            color: rgba(255,255,255,0.7);
            transition: all 0.3s ease;
          }

          .form-floating input:focus + label,
          .form-floating textarea:focus + label {
            color: #fff;
            text-shadow: 0 0 8px rgba(255,255,255,0.7);
          }

          .send-btn {
            background: linear-gradient(90deg, #0d6efd, #6f42c1, #9333ea);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .send-btn:hover {
            background: linear-gradient(90deg, #9333ea, #6f42c1, #0d6efd);
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.6);
          }
        `}
      </style>
    </section>
  );
}
