import React, { useState, useEffect } from "react";
import Preloader from "./components/Preloader.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contack.jsx";
import Footer from "./components/Footer.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const isDark = saved !== null ? saved === "true" : true;
    setDarkMode(isDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const cyan       = darkMode ? "#22d3ee" : "#0891b2";
  const cyanDim    = darkMode ? "rgba(34,211,238,0.07)" : "rgba(8,145,178,0.06)";
  const divider    = darkMode ? "rgba(34,211,238,0.1)"  : "rgba(8,145,178,0.12)";

  const pageBg = darkMode
    ? `radial-gradient(ellipse 100% 40% at 50% 0%,  rgba(34,211,238,0.05) 0%, transparent 60%),
       radial-gradient(ellipse 70%  30% at 85% 55%,  rgba(34,211,238,0.03) 0%, transparent 55%),
       radial-gradient(ellipse 60%  25% at 15% 90%,  rgba(34,211,238,0.03) 0%, transparent 50%),
       linear-gradient(180deg, #080e1a 0%, #0d1524 35%, #0f172a 65%, #080e1a 100%)`
    : `radial-gradient(ellipse 100% 40% at 50% 0%,  rgba(8,145,178,0.06) 0%, transparent 60%),
       linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 40%, #f0f9ff 100%)`;

  const sectionB   = darkMode ? "rgba(255,255,255,0.018)" : "rgba(8,145,178,0.03)";
  const footerBg   = darkMode ? "rgba(0,0,0,0.25)"        : "rgba(8,145,178,0.06)";
  const textColor  = darkMode ? "#f0f6fc"                  : "#0c2340";

  if (!mounted) return null;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        body {
          color: ${textColor};
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
          transition: color 0.4s ease;
        }

        .section-divider {
          width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent 0%, ${divider} 30%, ${cyan}50 50%, ${divider} 70%, transparent 100%);
        }

        .section-glow { position: relative; }
        .section-glow::before {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 500px; height: 1px;
          background: linear-gradient(90deg, transparent, ${cyan}25, transparent);
          pointer-events: none;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #080e1a; }
        ::-webkit-scrollbar-thumb { background: ${cyan}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${cyan}cc; }

        ::selection { background: ${cyan}35; color: ${cyan}; }

        section, footer { transition: background-color 0.4s ease; }
      `}</style>

      <Preloader />

      {/* Fixed full-page background */}
      <div style={{
        position: "fixed", inset: 0,
        background: pageBg,
        backgroundAttachment: "fixed",
        zIndex: -1,
        transition: "background 0.6s ease",
      }} />

      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      <main style={{ position: "relative", zIndex: 1 }}>

        <section style={{ background: "transparent", padding: 0 }}>
          <Hero darkMode={darkMode} />
        </section>

        <div className="section-divider" />

        <section className="section-glow" style={{ background: sectionB, padding: "80px 0", backdropFilter: "blur(4px)" }}>
          <div className="container"><About darkMode={darkMode} /></div>
        </section>

        <div className="section-divider" />

        <section className="section-glow" style={{ background: "transparent", padding: "80px 0" }}>
          <div className="container"><Projects darkMode={darkMode} /></div>
        </section>

        <div className="section-divider" />

        <section className="section-glow" style={{ background: sectionB, padding: "80px 0", backdropFilter: "blur(4px)" }}>
          <div className="container"><Contact darkMode={darkMode} /></div>
        </section>

        <div className="section-divider" />

      </main>

      <footer style={{ background: footerBg, backdropFilter: "blur(12px)", padding: "20px 0", textAlign: "center" }}>
        <Footer darkMode={darkMode} />
      </footer>
    </>
  );
}