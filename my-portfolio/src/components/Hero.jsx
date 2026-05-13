import React, { useEffect, useRef, useState } from "react";
import { FaLinkedin, FaGithub, FaInstagram, FaArrowRight, FaDownload } from "react-icons/fa";
import { Link } from "react-scroll";

/* ─────────────────────────────────────────
   Typewriter hook
───────────────────────────────────────── */
function useTypewriter(words, speed = 75, pause = 2000) {
  const [display, setDisplay]   = useState("");
  const [wordIdx, setWordIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const delay   = deleting ? speed / 2.5 : charIdx === current.length ? pause : speed;
    const t = setTimeout(() => {
      if (!deleting && charIdx < current.length)        { setDisplay(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }
      else if (!deleting && charIdx === current.length) { setDeleting(true); }
      else if (deleting && charIdx > 0)                 { setDisplay(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }
      else                                              { setDeleting(false); setWordIdx(w => (w + 1) % words.length); }
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

/* ─────────────────────────────────────────
   Particle Field
───────────────────────────────────────── */
function ParticleField({ darkMode }) {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    const onMouse = e => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMouse);

    const rgb = darkMode ? "34,211,238" : "8,145,178";
    const N   = 75;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.3,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      pulse: Math.random() * Math.PI * 2,
      baseAlpha: Math.random() * 0.28 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;

      pts.forEach(p => {
        p.pulse += 0.016;
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
        if (d < 120 && d > 0) { const f = (120 - d) / 120; p.x += (dx / d) * f * 0.5; p.y += (dy / d) * f * 0.5; }
        p.x = (p.x + p.vx + canvas.width)  % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
      });

      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 115) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rgb},${(1 - d / 115) * 0.07})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }

      pts.forEach(p => {
        const a = p.baseAlpha + Math.sin(p.pulse) * 0.1;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `rgba(${rgb},${a})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r,     0, Math.PI * 2); ctx.fillStyle = `rgba(${rgb},${a + 0.3})`; ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
    />
  );
}

/* ─────────────────────────────────────────
   Stat Card
───────────────────────────────────────── */
function StatCard({ icon, value, label, accent, accentDim, accentBorder, textSub, cardBg, cardBorder, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "14px 22px", borderRadius: "16px",
        background:   hov ? accentDim : cardBg,
        border:       `1px solid ${hov ? accentBorder : cardBorder}`,
        backdropFilter: "blur(12px)",
        transform:    hov ? "translateY(-4px) scale(1.03)" : "translateY(0) scale(1)",
        boxShadow:    hov ? `0 12px 32px ${accentDim}` : "none",
        transition:   "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "default", minWidth: "85px",
        animation: `popIn 0.5s ease ${delay}s both`,
      }}
    >
      <span style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{icon}</span>
      <span style={{ fontSize: "1.15rem", fontWeight: 800, color: accent, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: "0.6rem", color: textSub, fontFamily: "'DM Mono',monospace", letterSpacing: "0.07em", marginTop: "3px", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Social Button
───────────────────────────────────────── */
function SocialBtn({ href, label, icon, accentColor, cardBg, cardBorder, textSub, accentDim, accentBorder }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "46px", height: "46px", borderRadius: "13px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.15rem", textDecoration: "none",
        background:    hov ? accentDim  : cardBg,
        border:        `1px solid ${hov ? accentBorder : cardBorder}`,
        color:         hov ? accentColor : textSub,
        backdropFilter: "blur(8px)",
        transform:     hov ? "translateY(-4px) scale(1.12)" : "scale(1)",
        boxShadow:     hov ? `0 8px 24px ${accentDim}` : "none",
        transition:    "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {icon}
    </a>
  );
}

/* ─────────────────────────────────────────
   HERO — Main Component
───────────────────────────────────────── */
export default function Hero({ darkMode = true }) {

  /* ── Roles (Cloud & DevOps removed) ── */
  const roles = [
    "Java Full Stack Developer",
    "Spring Boot & Microservices",
    "React UI Engineer",
    "REST API Architect",
  ];
  const typed = useTypewriter(roles);

  /* ── Design tokens ── */
  const accent       = darkMode ? "#22d3ee"                    : "#0891b2";
  const accentLight  = darkMode ? "#67e8f9"                    : "#06b6d4";
  const accentDim    = darkMode ? "rgba(34,211,238,0.10)"      : "rgba(8,145,178,0.08)";
  const accentBorder = darkMode ? "rgba(34,211,238,0.30)"      : "rgba(8,145,178,0.35)";
  const accentGlow   = darkMode ? "rgba(34,211,238,0.35)"      : "rgba(8,145,178,0.25)";
  const textPrimary  = darkMode ? "#f0f6fc"                    : "#0c2340";
  const textMuted    = darkMode ? "rgba(148,163,184,0.9)"      : "rgba(30,58,92,0.8)";
  const textSub      = darkMode ? "#64748b"                    : "#475569";
  const cardBg       = darkMode ? "rgba(255,255,255,0.04)"     : "rgba(8,145,178,0.04)";
  const cardBorder   = darkMode ? "rgba(255,255,255,0.08)"     : "rgba(8,145,178,0.12)";
  const badgeBg      = darkMode ? "rgba(8,14,26,0.92)"         : "rgba(240,249,255,0.95)";

  /* ── Socials ── */
  const socials = [
    { href: "https://www.linkedin.com/in/arun-k1921/", label: "LinkedIn",  icon: <FaLinkedin />,  accentColor: "#0A66C2" },
    { href: "https://github.com/Arun-k19",             label: "GitHub",    icon: <FaGithub />,    accentColor: darkMode ? "#e2e8f0" : "#1e293b" },
    { href: "https://instagram.com/arun.__.k",         label: "Instagram", icon: <FaInstagram />, accentColor: "#E1306C" },
  ];

  /* ── Stats ── */
  const stats = [
    { value: "300+", label: "DSA Solved",     icon: "⚡", delay: 1.6  },
    { value: "5+",   label: "Projects Built", icon: "🚀", delay: 1.75 },
    { value: "2+",   label: "Years Coding",   icon: "💻", delay: 1.9  },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        #hero { font-family: 'Syne', sans-serif; }

        @keyframes fadeSlideUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeSlideRight{ from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes squarePulse {
          0%,100%{ box-shadow: 0 0 12px rgba(34,211,238,0.25), 0 0 28px rgba(34,211,238,0.10); }
          50%    { box-shadow: 0 0 24px rgba(34,211,238,0.55), 0 0 60px rgba(34,211,238,0.20); }
        }
        @keyframes blink        { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes popIn        { from{opacity:0;transform:scale(0.75) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes scanline     { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
        @keyframes dotPulse     { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.5)} 50%{box-shadow:0 0 0 5px rgba(74,222,128,0)} }
        @keyframes scrollBounce { 0%,100%{transform:translateY(0);opacity:.5} 50%{transform:translateY(7px);opacity:1} }
        @keyframes accentLine   { from{width:0;opacity:0} to{width:52px;opacity:1} }

        /* ── Text side slides up from below ── */
        .hero-text-block { animation: fadeSlideUp    1s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        /* ── Image side slides in from right ── */
        .hero-img-block  { animation: fadeSlideRight 1s cubic-bezier(0.22,1,0.36,1) 0.1s  both; }

        /* ── Profile image ── */
        .square-profile-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          border-radius: 20px;
          transition: transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        .square-profile-img:hover { transform: scale(1.04); }

        .hero-name {
          font-size: clamp(3rem,5.5vw,4.4rem);
          font-weight: 800; line-height: 1.04;
          color: ${textPrimary};
          margin: 0 0 6px 0;
          letter-spacing: -0.025em;
          font-family: 'Syne',sans-serif;
        }
        .hero-name .name-highlight {
          color: ${accent};
          text-shadow: 0 0 32px ${accentGlow}, 0 0 8px ${accentDim};
        }

        /* ── Primary CTA ── */
        .cta-primary {
          position:relative; display:inline-flex; align-items:center; gap:10px;
          padding:15px 32px; border-radius:14px; border:none;
          font-family:'Syne',sans-serif; font-weight:700; font-size:0.92rem; letter-spacing:0.04em;
          cursor:pointer; text-decoration:none; overflow:hidden;
          background:linear-gradient(135deg,#22d3ee 0%,#06b6d4 40%,#0891b2 100%);
          background-size:200% 100%; color:#020e18;
          transition:all 0.35s ease; box-shadow:0 4px 22px rgba(34,211,238,0.35);
        }
        .cta-primary::after {
          content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
        }
        .cta-primary:hover { background-position:right center; transform:translateY(-3px); box-shadow:0 12px 40px rgba(34,211,238,0.45); }
        .cta-primary:hover::after { animation:scanline 0.6s ease forwards; }
        .cta-primary .arrow-icon { transition:transform 0.3s ease; }
        .cta-primary:hover .arrow-icon { transform:translateX(5px); }

        /* ── Secondary CTA ── */
        .cta-secondary {
          display:inline-flex; align-items:center; gap:10px;
          padding:14px 30px; border-radius:14px;
          font-family:'Syne',sans-serif; font-weight:600; font-size:0.92rem; letter-spacing:0.04em;
          cursor:pointer; text-decoration:none; backdrop-filter:blur(10px);
          transition:all 0.3s ease;
        }
        .cta-secondary:hover { transform:translateY(-3px); }

        /* ── Available badge ── */
        .avail-badge {
          display:inline-flex; align-items:center; gap:8px; padding:7px 18px;
          background:rgba(74,222,128,0.08); border:1px solid rgba(74,222,128,0.3);
          border-radius:999px; font-size:0.72rem; color:#86efac;
          font-family:'DM Mono',monospace; letter-spacing:0.08em; text-transform:uppercase;
          animation:popIn 0.5s ease 1s both;
        }
        .dot-pulse { width:7px; height:7px; border-radius:50%; background:#4ade80; animation:dotPulse 1.8s ease-in-out infinite; }
        .cursor    { display:inline-block; width:2.5px; height:1em; margin-left:2px; vertical-align:text-bottom; border-radius:1px; animation:blink 0.85s step-end infinite; }

        /* ── Corner accents on photo ── */
        .corner-tl,.corner-tr,.corner-bl,.corner-br {
          position:absolute; width:22px; height:22px; z-index:3; pointer-events:none;
        }
        .corner-tl { top:-3px; left:-3px;   border-top:2.5px solid ${accent}; border-left:2.5px solid ${accent};   border-radius:6px 0 0 0; }
        .corner-tr { top:-3px; right:-3px;  border-top:2.5px solid ${accent}; border-right:2.5px solid ${accent};  border-radius:0 6px 0 0; }
        .corner-bl { bottom:-3px; left:-3px; border-bottom:2.5px solid ${accent}; border-left:2.5px solid ${accent};  border-radius:0 0 0 6px; }
        .corner-br { bottom:-3px; right:-3px;border-bottom:2.5px solid ${accent}; border-right:2.5px solid ${accent}; border-radius:0 0 6px 0; }

        /* ── Scroll hint ── */
        .scroll-hint {
          position:absolute; bottom:24px; left:50%; transform:translateX(-50%);
          display:flex; flex-direction:column; align-items:center; gap:5px;
          font-size:0.62rem; font-family:'DM Mono',monospace; letter-spacing:0.14em; text-transform:uppercase;
          animation:popIn 0.5s ease 2.2s both; cursor:default; z-index:10;
        }
        .scroll-arrow { animation:scrollBounce 2s ease-in-out infinite; }

        /* ── Responsive ── */
        @media(max-width:768px){
          .hero-main { flex-direction:column-reverse !important; gap:32px !important; }
          .square-outer-wrap { width:200px !important; height:200px !important; }
        }
      `}</style>

      <section
        id="hero"
        style={{
          position: "relative", minHeight: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", padding: "90px 24px 60px",
        }}
      >
        {/* Canvas particles */}
        <ParticleField darkMode={darkMode} />

        {/* Ambient glows */}
        <div style={{ position:"absolute", top:"8%",   left:"8%",  width:700, height:700, background:`radial-gradient(circle,${accentDim} 0%,transparent 65%)`, filter:"blur(90px)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"absolute", bottom:"5%",right:"5%", width:450, height:450, background:`radial-gradient(circle,${accentDim} 0%,transparent 65%)`, filter:"blur(70px)", pointerEvents:"none", zIndex:0 }} />

        {/* Top centre line */}
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"1px", height:"130px", background:`linear-gradient(to bottom,${accent},transparent)`, opacity:0.6, zIndex:1 }} />

        {/* Subtle grid */}
        <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity: darkMode ? 0.025 : 0.015, backgroundImage:`linear-gradient(${accent} 1px,transparent 1px),linear-gradient(90deg,${accent} 1px,transparent 1px)`, backgroundSize:"60px 60px" }} />

        {/* ── Main layout: TEXT LEFT · IMAGE RIGHT ── */}
        <div
          className="hero-main"
          style={{
            position: "relative", zIndex: 2,
            display: "flex", flexDirection: "row",
            alignItems: "center", justifyContent: "center",
            gap: "100px", width: "100%", maxWidth: "1140px", flexWrap: "wrap",
          }}
        >

          {/* ══════════════ TEXT BLOCK (LEFT) ══════════════ */}
          <div className="hero-text-block" style={{ flex: "1 1 340px", minWidth: 280 }}>

            {/* Available badge */}
            <div className="avail-badge" style={{ marginBottom: "22px" }}>
              <span className="dot-pulse" />
              Available for opportunities
            </div>

            {/* Name */}
            <h1 className="hero-name" style={{ marginBottom: "6px" }}>
              I'm <span className="name-highlight">Arun</span>
            </h1>

            {/* Typewriter role */}
            <div style={{
              fontSize: "clamp(0.95rem,2vw,1.3rem)", fontWeight: 500,
              color: textSub, margin: "0 0 24px 0",
              fontFamily: "'DM Mono',monospace", minHeight: "2.2em",
              display: "flex", alignItems: "center",
            }}>
              <span style={{ color: accent, opacity: 0.75, marginRight: "6px" }}>›</span>
              <span>{typed}</span>
              <span className="cursor" style={{ background: accent }} />
            </div>

            {/* Accent line */}
            <div style={{
              height: "2.5px",
              background: `linear-gradient(90deg,${accent},${accent}50,transparent)`,
              borderRadius: "2px", marginBottom: "22px",
              animation: "accentLine 0.8s ease 0.5s both",
            }} />

            {/* Bio */}
            <p style={{
              color: textMuted, fontSize: "0.94rem", lineHeight: 1.85,
              maxWidth: "440px", marginBottom: "28px",
              fontFamily: "'Syne',sans-serif", fontWeight: 400,
            }}>
              Building scalable web apps with{" "}
              <span style={{ color: accent, fontWeight: 700 }}>Java & React</span>.
              Passionate about clean architecture, elegant UIs, and solving real-world problems through code.
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
              {stats.map((s, i) => (
                <StatCard
                  key={i} {...s}
                  accent={accent} accentDim={accentDim} accentBorder={accentBorder}
                  textSub={textSub} cardBg={cardBg} cardBorder={cardBorder}
                />
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "30px" }}>
              <Link to="projects" smooth duration={800} offset={-70}>
                <button className="cta-primary">
                  <span>View Projects</span>
                  <FaArrowRight className="arrow-icon" size={13} />
                </button>
              </Link>
              <a
                href="/Arun Resume final.pdf"
                download
                className="cta-secondary"
                style={{ border: `1px solid ${accentBorder}`, background: accentDim, color: accent }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,211,238,0.18)"; e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 8px 28px ${accentDim}`; }}
                onMouseLeave={e => { e.currentTarget.style.background = accentDim; e.currentTarget.style.borderColor = accentBorder; e.currentTarget.style.boxShadow = "none"; }}
              >
                <FaDownload size={13} />
                <span>Resume</span>
              </a>
            </div>

            {/* Social links */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "0.65rem", color: textSub, fontFamily: "'DM Mono',monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>Connect</span>
              <div style={{ width: "24px", height: "1px", background: accentBorder }} />
              {socials.map((s, i) => (
                <SocialBtn
                  key={i} {...s}
                  cardBg={cardBg} cardBorder={cardBorder}
                  textSub={textSub} accentDim={accentDim} accentBorder={accentBorder}
                />
              ))}
            </div>
          </div>

          {/* ══════════════ IMAGE BLOCK (RIGHT) ══════════════ */}
          <div className="hero-img-block" style={{ position: "relative", flexShrink: 0 }}>

            {/* Outer glow ring */}
            <div style={{
              position: "absolute", inset: -18,
              borderRadius: "30px",
              background: `radial-gradient(ellipse at center, ${accentDim} 0%, transparent 70%)`,
              filter: "blur(18px)",
              zIndex: 0,
              pointerEvents: "none",
            }} />

            {/* Square photo wrapper */}
            <div
              className="square-outer-wrap"
              style={{ position: "relative", zIndex: 1, width: 300, height: 340 }}
            >
              {/* Glowing border frame */}
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: "22px",
                padding: "3px",
                background: `linear-gradient(135deg,${accent},${accentLight},${accent})`,
                animation: "squarePulse 5s ease-in-out infinite",
                zIndex: 1,
              }}>
                <div style={{
                  width: "100%", height: "100%",
                  borderRadius: "20px",
                  background: darkMode ? "#080e1a" : "#f0f9ff",
                  overflow: "hidden",
                }}>
                  <img
                    src="/Profile.webp"
                    alt="Arun"
                    className="square-profile-img"
                  />
                </div>
              </div>

              {/* Corner accent lines */}
              <div className="corner-tl" />
              <div className="corner-tr" />
              <div className="corner-bl" />
              <div className="corner-br" />
            </div>

            {/* ── Subtle status chip below photo ── */}
            <div style={{
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "12px",
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              backdropFilter: "blur(12px)",
              animation: "popIn 0.5s ease 1.4s both",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", animation: "dotPulse 1.8s ease-in-out infinite", display: "inline-block" }} />
              <span style={{ fontSize: "0.7rem", fontFamily: "'DM Mono',monospace", color: "#86efac", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Open to Work
              </span>
            </div>

          </div>
          {/* ═══════════════════════════════════════════════ */}

        </div>

        {/* Scroll hint */}
        <div className="scroll-hint" style={{ color: textSub }}>
          <span>scroll</span>
          <div className="scroll-arrow">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 6L11 1" stroke={accentBorder} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}