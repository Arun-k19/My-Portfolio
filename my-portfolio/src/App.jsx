import React, { useState, useEffect } from "react";
import Preloader from "./components/Preloader.jsx"; // 🔹 Import Preloader
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contack.jsx";
import Footer from "./components/Footer.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.body.classList.toggle("bg-dark", savedMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle("bg-dark", newMode);
    localStorage.setItem("darkMode", newMode);
  };

  return (
    <>
      {/* 🔹 Preloader — shows for 2.5s before portfolio loads */}
      <Preloader />

      <div
        className={`${
          darkMode ? "bg-dark text-light" : "text-light"
        }`}
        style={{
          background:
            "linear-gradient(180deg, #0d6efd 0%, #6610f2 40%, #9333ea 75%, #a855f7 100%)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          overflowX: "hidden",
          transition: "all 0.6s ease-in-out",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* ✅ Fixed Navbar */}
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

        {/* ✅ Continuous Page Sections */}
        <main className="mt-5 pt-4">
          {/* HERO */}
          <section className="py-5 bg-transparent">
            <div className="container">
              <Hero />
            </div>
          </section>

          {/* ABOUT */}
          <section
            className="py-5 bg-transparent"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(5px)",
            }}
          >
            <div className="container">
              <About />
            </div>
          </section>

          {/* PROJECTS */}
          <section
            className="py-5 bg-transparent"
            style={{
              backgroundColor: "rgba(0,0,0,0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="container">
              <Projects />
            </div>
          </section>

          {/* CONTACT */}
          <section
            className="py-5 bg-transparent"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="container">
              <Contact />
            </div>
          </section>

          {/* FOOTER */}
          <footer
            className="py-3 text-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Footer />
          </footer>
        </main>
      </div>
    </>
  );
}
