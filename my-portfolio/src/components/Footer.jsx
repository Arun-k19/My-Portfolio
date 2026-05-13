import React, { useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaArrowUp, FaCode, FaHeart } from "react-icons/fa";
import { Link, animateScroll as scroll } from "react-scroll";

export default function Footer({ darkMode = true }) {
  const accent       = darkMode ? "#22d3ee" : "#0891b2";
  const accentDim    = darkMode ? "rgba(34,211,238,0.1)"  : "rgba(8,145,178,0.08)";
  const accentBorder = darkMode ? "rgba(34,211,238,0.3)"  : "rgba(8,145,178,0.35)";
  const textPrimary  = darkMode ? "#f0f6fc" : "#0c2340";
  const textSub      = darkMode ? "#64748b"               : "#475569";
  const textMuted    = darkMode ? "rgba(148,163,184,0.7)" : "rgba(71,85,105,0.8)";
  const cardBg       = darkMode ? "rgba(255,255,255,0.04)": "rgba(8,145,178,0.04)";
  const cardBorder   = darkMode ? "rgba(255,255,255,0.08)": "rgba(8,145,178,0.12)";
  const footerBorder = darkMode ? "rgba(255,255,255,0.07)": "rgba(8,145,178,0.12)";

  const [hovTop, setHovTop] = useState(false);

  const socials = [
    { href:"https://github.com/Arun-k19",             label:"GitHub",    icon:<FaGithub/>,    hoverColor: darkMode?"#e2e8f0":"#1e293b" },
    { href:"https://www.linkedin.com/in/arun-k1921/", label:"LinkedIn",  icon:<FaLinkedin/>,  hoverColor:"#0A66C2" },
    { href:"https://instagram.com/arun.__.k",         label:"Instagram", icon:<FaInstagram/>, hoverColor:"#E1306C" },
  ];

  const navLinks = [
    { label:"Home",     to:"hero"     },
    { label:"About",    to:"about"    },
    { label:"Projects", to:"projects" },
    { label:"Contact",  to:"contact"  },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700;800&display=swap');
        footer *, footer *::before, footer *::after { box-sizing:border-box; }
        footer { font-family:'Syne',sans-serif; }

        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .footer-nav-link {
          position:relative;
          font-family:'DM Mono',monospace; font-size:0.7rem;
          letter-spacing:0.12em; text-transform:uppercase;
          text-decoration:none; color:${textSub};
          transition:color 0.3s ease; padding:4px 0;
        }
        .footer-nav-link::after {
          content:''; position:absolute; bottom:-2px; left:50%;
          transform:translateX(-50%) scaleX(0);
          width:70%; height:1.5px; background:${accent};
          border-radius:2px; transition:transform 0.3s ease;
        }
        .footer-nav-link:hover { color:${accent}; }
        .footer-nav-link:hover::after { transform:translateX(-50%) scaleX(1); }

        .footer-social {
          width:44px; height:44px; border-radius:13px;
          display:flex; align-items:center; justify-content:center;
          font-size:1.1rem; text-decoration:none;
          transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          backdrop-filter:blur(8px);
        }
      `}</style>

      <footer
        style={{
          position:"relative",
          overflow:"hidden",
          borderTop:`1px solid ${footerBorder}`,
          background: darkMode ? "rgba(8,14,26,0.65)" : "rgba(240,249,255,0.85)",
          backdropFilter:"blur(24px)",
        }}
      >
        {/* Ambient glows */}
        <div style={{ position:"absolute", bottom:0, left:"8%",  width:420, height:280, background:`radial-gradient(circle,${accentDim} 0%,transparent 70%)`, filter:"blur(80px)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"absolute", top:0,    right:"6%", width:320, height:240, background:`radial-gradient(circle,${accentDim} 0%,transparent 70%)`, filter:"blur(60px)", pointerEvents:"none", zIndex:0 }} />

        {/* Subtle grid */}
        <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:darkMode?0.016:0.01, backgroundImage:`linear-gradient(${accent} 1px,transparent 1px),linear-gradient(90deg,${accent} 1px,transparent 1px)`, backgroundSize:"60px 60px" }} />

        {/* ── Main content ── */}
        <div style={{ position:"relative", zIndex:2, maxWidth:"1140px", margin:"0 auto", padding:"52px 24px 36px" }}>

          {/* Top row */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            flexWrap:"wrap", gap:"28px", marginBottom:"40px",
            animation:"fadeSlideUp 0.7s ease 0.1s both",
          }}>
            {/* Brand */}
            <div
              style={{ display:"flex", alignItems:"center", gap:"12px", cursor:"pointer" }}
              onClick={() => scroll.scrollToTop()}
            >
              <img
                src="/Logo.png" alt="Logo"
                style={{
                  width:"40px", height:"40px", borderRadius:"50%",
                  border:`2px solid ${accent}`,
                  boxShadow:`0 0 12px ${accentDim}`,
                  transition:"transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12) rotate(-5deg)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1) rotate(0deg)"}
              />
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1rem", color:accent, letterSpacing:"0.3px", lineHeight:1 }}>
                  Arun.dev
                </div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.58rem", color:textSub, letterSpacing:"0.1em", marginTop:"3px" }}>
                  Java Full Stack Developer
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav style={{ display:"flex", alignItems:"center", gap:"32px", flexWrap:"wrap" }}>
              {navLinks.map((n, i) => (
                <Link key={i} to={n.to} smooth duration={800} offset={-70} className="footer-nav-link">
                  {n.label}
                </Link>
              ))}
            </nav>

            {/* Back to top */}
            <button
              onClick={() => scroll.scrollToTop()}
              onMouseEnter={() => setHovTop(true)}
              onMouseLeave={() => setHovTop(false)}
              aria-label="Back to top"
              style={{
                width:"44px", height:"44px", borderRadius:"13px",
                display:"flex", alignItems:"center", justifyContent:"center",
                background: hovTop ? accentDim : cardBg,
                border:`1px solid ${hovTop ? accentBorder : cardBorder}`,
                color: hovTop ? accent : textSub,
                cursor:"pointer", outline:"none",
                transform: hovTop ? "translateY(-5px) scale(1.12)" : "translateY(0) scale(1)",
                boxShadow: hovTop ? `0 10px 28px ${accentDim}` : "none",
                transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                backdropFilter:"blur(8px)",
              }}
            >
              <FaArrowUp size={14} />
            </button>
          </div>

          {/* Divider */}
          <div style={{
            height:"1px",
            background:`linear-gradient(90deg,transparent,${accentBorder},transparent)`,
            marginBottom:"28px",
          }} />

          {/* Bottom row */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            flexWrap:"wrap", gap:"20px",
            animation:"fadeSlideUp 0.7s ease 0.2s both",
          }}>

            {/* Socials */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <span style={{ fontSize:"0.62rem", color:textSub, fontFamily:"'DM Mono',monospace", letterSpacing:"0.14em", textTransform:"uppercase" }}>
                Find me
              </span>
              <div style={{ width:"20px", height:"1px", background:accentBorder }} />
              {socials.map((s, i) => {
                const [hov, setHov] = useState(false);
                return (
                  <a
                    key={i} href={s.href} target="_blank" rel="noreferrer"
                    aria-label={s.label} title={s.label}
                    className="footer-social"
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    style={{
                      background: hov ? `${s.hoverColor}18` : cardBg,
                      border: `1px solid ${hov ? `${s.hoverColor}55` : cardBorder}`,
                      color: hov ? s.hoverColor : textSub,
                      transform: hov ? "translateY(-5px) scale(1.12)" : "scale(1)",
                      boxShadow: hov ? `0 10px 28px ${s.hoverColor}33` : "none",
                    }}
                  >
                    {s.icon}
                  </a>
                );
              })}
            </div>

            {/* Copyright */}
            <div style={{
              fontFamily:"'DM Mono',monospace", fontSize:"0.67rem",
              color:textSub, letterSpacing:"0.05em",
              display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap",
            }}>
              <span style={{ opacity:0.5 }}>©</span>
              <span>{new Date().getFullYear()}</span>
              <span style={{ color:textMuted }}>·</span>
              <span style={{ color:textPrimary, fontWeight:500 }}>Arun K</span>
              <span style={{ color:textMuted }}>·</span>
              <span style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                Built with <FaCode size={10} style={{ color:accent }} /> React
              </span>
              <span style={{ color:textMuted }}>·</span>
              <span style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                Made with <FaHeart size={9} style={{ color:"#f43f5e" }} />
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{
          position:"relative", zIndex:2, height:"2px",
          background:`linear-gradient(90deg,transparent,${accent},transparent)`,
          opacity:0.45,
        }} />
      </footer>
    </>
  );
}