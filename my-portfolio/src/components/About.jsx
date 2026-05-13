import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaBootstrap,
  FaNodeJs, FaDatabase, FaJava, FaPython,
} from "react-icons/fa";
import {
  SiMongodb, SiExpress, SiLeetcode, SiSpringboot, SiMysql,
} from "react-icons/si";
import { Link } from "react-scroll";

/* ─────────────────────────────────────────────
   useScrollReveal — attach to any element ref
   Returns a ref + "visible" boolean.
   delay: ms stagger delay
───────────────────────────────────────────── */
function useScrollReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return [ref, visible];
}

/* ─────────────────────────────────────────────
   Particle Background
───────────────────────────────────────────── */
function ParticleField({ darkMode }) {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    const onMouse = e => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMouse);
    const rgb = darkMode ? "34,211,238" : "8,145,178";
    const N = 60;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.3,
      vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
      pulse: Math.random() * Math.PI * 2,
      baseAlpha: Math.random() * 0.22 + 0.06,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;
      pts.forEach(p => {
        p.pulse += 0.016;
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
        if (d < 120 && d > 0) { const f = (120 - d) / 120; p.x += (dx / d) * f * 0.5; p.y += (dy / d) * f * 0.5; }
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rgb},${(1 - d / 110) * 0.06})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
      pts.forEach(p => {
        const a = p.baseAlpha + Math.sin(p.pulse) * 0.08;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r,     0, Math.PI * 2); ctx.fillStyle = `rgba(${rgb},${a + 0.3})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); window.removeEventListener("mousemove", onMouse); };
  }, [darkMode]);
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none" }} />;
}

/* ─────────────────────────────────────────────
   Accordion Section Wrapper
───────────────────────────────────────────── */
function AccordionSection({ number, label, sublabel, isOpen, onToggle, isDone, accent, accentDim, accentBorder, cardBg, cardBorder, textPrimary, textSub, children, revealDelay }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [sectionRef, visible] = useScrollReveal(revealDelay);

  useEffect(() => {
    if (!contentRef.current) return;
    setHeight(isOpen ? contentRef.current.scrollHeight : 0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    const ro = new ResizeObserver(() => {
      if (contentRef.current) setHeight(contentRef.current.scrollHeight);
    });
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [isOpen]);

  return (
    <div
      ref={sectionRef}
      style={{
        borderRadius: "18px",
        border: `1px solid ${isOpen ? accentBorder : cardBorder}`,
        background: isOpen ? accentDim : cardBg,
        backdropFilter: "blur(14px)",
        overflow: "hidden",
        transition: "border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease, opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: isOpen ? `0 12px 48px ${accentDim}, 0 0 0 1px ${accentBorder}` : "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
      }}
    >
      {/* Clickable header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "16px",
          padding: "22px 24px", background: "transparent", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        {/* Number badge */}
        <div style={{
          width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isDone ? "rgba(13,148,136,0.15)" : isOpen ? accentDim : cardBorder,
          border: `1px solid ${isDone ? "#0d9488" : isOpen ? accentBorder : cardBorder}`,
          fontSize: "0.68rem", fontFamily: "'DM Mono',monospace", fontWeight: 600,
          color: isDone ? "#0d9488" : isOpen ? accent : textSub,
          transition: "all 0.3s ease",
        }}>
          {isDone ? "✓" : number}
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'DM Mono',monospace", fontSize: "0.6rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: isOpen ? accent : textSub, opacity: 0.8, marginBottom: "3px",
            transition: "color 0.3s ease",
          }}>
            {sublabel}
          </div>
          <div style={{
            fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.1rem",
            color: isOpen ? textPrimary : textSub,
            transition: "color 0.3s ease",
          }}>
            {label}
          </div>
        </div>

        {/* Chevron */}
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          border: `1px solid ${isOpen ? accentBorder : cardBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: isOpen ? accent : textSub, fontSize: "1rem", flexShrink: 0,
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          background: isOpen ? `${accent}11` : "transparent",
        }}>
          ▾
        </div>
      </button>

      {/* Animated content */}
      <div style={{ height: `${height}px`, overflow: "hidden", transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)" }}>
        <div ref={contentRef} style={{ padding: "0 24px 28px" }}>
          <div style={{ height: "1px", background: `linear-gradient(90deg,${accent}44,transparent)`, marginBottom: "20px", borderRadius: "2px" }} />
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Info Card
───────────────────────────────────────────── */
function InfoCard({ icon, label, sub, accent, accentDim, accentBorder, cardBg, cardBorder, textPrimary, textSub }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "12px 16px", borderRadius: "14px",
        background: hov ? accentDim : cardBg,
        border: `1px solid ${hov ? accentBorder : cardBorder}`,
        backdropFilter: "blur(12px)",
        transform: hov ? "translateY(-3px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hov ? `0 10px 28px ${accentDim}` : "none",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", cursor: "default",
      }}
    >
      <span style={{ fontSize: "1.25rem" }}>{icon}</span>
      <div>
        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: textPrimary, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>{label}</div>
        <div style={{ fontSize: "0.62rem", color: textSub, fontFamily: "'DM Mono',monospace", letterSpacing: "0.05em", marginTop: "3px" }}>{sub}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Experience Card
───────────────────────────────────────────── */
function ExpCard({ exp, accent, accentDim, accentBorder, cardBg, cardBorder, textPrimary, textMuted, textSub, idx }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", padding: "20px 22px 20px 28px", borderRadius: "16px",
        background: hov ? accentDim : cardBg,
        border: `1px solid ${hov ? accentBorder : cardBorder}`,
        backdropFilter: "blur(12px)",
        transform: hov ? "translateX(6px)" : "translateX(0)",
        boxShadow: hov ? `0 8px 32px ${accentDim}` : "none",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        animation: `popIn 0.5s ease ${0.15 * idx + 0.1}s both`,
      }}
    >
      <div style={{
        position: "absolute", left: 0, top: "16px", bottom: "16px", width: "3px",
        background: hov ? accent : `${accent}44`,
        borderRadius: "0 3px 3px 0", transition: "background 0.3s ease",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap", marginBottom: "6px" }}>
        <div>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: textPrimary, fontFamily: "'Syne',sans-serif", lineHeight: 1.2 }}>{exp.role}</div>
          <div style={{ fontSize: "0.78rem", color: accent, fontFamily: "'DM Mono',monospace", letterSpacing: "0.05em", marginTop: "3px" }}>{exp.company}</div>
        </div>
        <div style={{ fontSize: "0.62rem", fontFamily: "'DM Mono',monospace", color: textSub, letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "999px", background: accentDim, border: `1px solid ${accentBorder}`, whiteSpace: "nowrap" }}>{exp.period}</div>
      </div>
      <p style={{ color: textMuted, fontSize: "0.85rem", lineHeight: 1.75, margin: "8px 0 12px", fontFamily: "'Syne',sans-serif" }}>{exp.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {exp.tags.map((tag, i) => (
          <span key={i} style={{ fontSize: "0.6rem", fontFamily: "'DM Mono',monospace", letterSpacing: "0.07em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "999px", background: `${accent}14`, border: `1px solid ${accent}33`, color: accent }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Skill Card
───────────────────────────────────────────── */
function SkillCard({ skill, cardBg, cardBorder, textSub, idx }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        padding: "18px 12px 14px", borderRadius: "16px",
        background: hov ? `${skill.color}12` : cardBg,
        border: `1px solid ${hov ? skill.color + "66" : cardBorder}`,
        backdropFilter: "blur(12px)",
        transform: hov ? "translateY(-7px) scale(1.06)" : "translateY(0) scale(1)",
        boxShadow: hov ? `0 16px 40px ${skill.color}22, 0 0 0 1px ${skill.color}33` : "none",
        transition: "all 0.32s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "default",
        animation: `popIn 0.4s ease ${0.04 * idx + 0.1}s both`,
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", height: "1.5px",
        background: hov ? `linear-gradient(90deg,transparent,${skill.color},transparent)` : "transparent",
        transition: "background 0.3s ease", borderRadius: "999px",
      }} />
      <span style={{
        fontSize: "1.9rem", color: hov ? skill.color : textSub,
        filter: hov ? `drop-shadow(0 0 8px ${skill.color}99)` : "none",
        transform: hov ? "scale(1.2) rotate(-6deg)" : "scale(1) rotate(0deg)",
        transition: "all 0.3s ease", display: "block",
      }}>{skill.icon}</span>
      <span style={{
        fontSize: "0.62rem", fontFamily: "'DM Mono',monospace", letterSpacing: "0.06em", textTransform: "uppercase",
        color: hov ? skill.color : textSub, fontWeight: 500, transition: "color 0.3s ease", textAlign: "center", lineHeight: 1.3,
      }}>{skill.name}</span>
      <div style={{ width: "100%", height: "3px", borderRadius: "999px", background: cardBorder, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: hov ? `${skill.level}%` : "0%",
          background: `linear-gradient(90deg,${skill.color}99,${skill.color})`,
          borderRadius: "999px", transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
        }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main About Component
───────────────────────────────────────────── */
export default function About({ darkMode = true }) {
  const [openSection, setOpenSection] = useState(null);
  const [visited, setVisited]         = useState({ about: false, experience: false, skills: false });
  const [autoPlayed, setAutoPlayed]   = useState(false);
  const sectionWrapRef                = useRef(null);

  // Scroll reveal refs for header elements
  const [taglineRef, taglineVisible] = useScrollReveal(0);
  const [titleRef, titleVisible]     = useScrollReveal(100);
  const [lineRef, lineVisible]       = useScrollReveal(200);
  const [ctaRef, ctaVisible]         = useScrollReveal(300);

  // Auto-play sequence: About → Experience → Skills, triggered once on scroll-into-view
  useEffect(() => {
    if (autoPlayed) return;
    const el = sectionWrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setAutoPlayed(true);

          const sequence = ["about", "experience", "skills"];
          const delay    = 1800; // ms between each accordion opening

          sequence.forEach((key, i) => {
            setTimeout(() => {
              setOpenSection(key);
              setVisited(v => ({ ...v, [key]: true }));
            }, i * delay);
          });
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlayed]);

  // Manual toggle still works normally
  const toggle = (key) => {
    if (openSection === key) {
      setOpenSection(null);
    } else {
      setOpenSection(key);
      setVisited(v => ({ ...v, [key]: true }));
    }
  };

  const accent       = darkMode ? "#22d3ee" : "#0891b2";
  const accentDim    = darkMode ? "rgba(34,211,238,0.1)"  : "rgba(8,145,178,0.08)";
  const accentBorder = darkMode ? "rgba(34,211,238,0.3)"  : "rgba(8,145,178,0.35)";
  const accentGlow   = darkMode ? "rgba(34,211,238,0.35)" : "rgba(8,145,178,0.25)";
  const textPrimary  = darkMode ? "#f0f6fc" : "#0c2340";
  const textMuted    = darkMode ? "rgba(148,163,184,0.9)" : "rgba(30,58,92,0.8)";
  const textSub      = darkMode ? "#64748b"               : "#475569";
  const cardBg       = darkMode ? "rgba(255,255,255,0.04)": "rgba(8,145,178,0.04)";
  const cardBorder   = darkMode ? "rgba(255,255,255,0.08)": "rgba(8,145,178,0.12)";

  const shared = { accent, accentDim, accentBorder, cardBg, cardBorder, textPrimary, textSub };

  const infoCards = [
    { icon: "🎓", label: "B.E. Computer Science", sub: "Graduating 2025" },
    { icon: "📍", label: "Tiruchirappalli, TN",   sub: "India" },
    { icon: "☕", label: "Java — Primary Stack",   sub: "Backend Architecture" },
    { icon: "🧩", label: "300+ DSA Problems",      sub: "LeetCode & Beyond" },
  ];

  const experiences = [
    {
      role: "Java Full Stack Developer Intern", company: "Gradwin · Chennai", period: "Jan 2026 – Apr 2026",
      description: "Developed and deployed full stack features using React.js, Node.js, and MySQL with complete CRUD operations. Integrated frontend components with backend REST APIs and MongoDB, reducing data fetch latency by 25%. Followed MVC Architecture to maintain clean code separation across 3+ backend modules.",
      tags: ["React.js", "Node.js", "MySQL", "MongoDB", "MVC", "REST API"],
    },
    {
      role: "Frontend Developer Intern", company: "Vissal Career Solution (VCS) · Karaikudi", period: "Mar 2025 – Sep 2025",
      description: "Developed and enhanced the LMS frontend using React.js, improving UI responsiveness across 5+ modules. Built 10+ reusable React components, reducing code duplication by 30%. Integrated dynamic dashboard data via REST APIs with the backend team, cutting manual data entry by 50%.",
      tags: ["React.js", "LMS", "REST API", "Reusable Components", "UI/UX"],
    },
  ];

  const skillGroups = [
    {
      label: "Backend",
      skills: [
        { name: "Java",        icon: <FaJava />,      color: "#E65C00", level: 90 },
        { name: "Spring Boot", icon: <SiSpringboot />, color: "#6db33f", level: 85 },
        { name: "Node.js",     icon: <FaNodeJs />,     color: "#38ef7d", level: 75 },
        { name: "Express.js",  icon: <SiExpress />,    color: "#94a3b8", level: 72 },
        { name: "Python",      icon: <FaPython />,     color: "#396afc", level: 65 },
      ],
    },
    {
      label: "Frontend",
      skills: [
        { name: "React",       icon: <FaReact />,      color: "#22d3ee", level: 85 },
        { name: "JavaScript",  icon: <FaJs />,         color: "#F7CE46", level: 88 },
        { name: "HTML",        icon: <FaHtml5 />,      color: "#ff512f", level: 92 },
        { name: "CSS",         icon: <FaCss3Alt />,    color: "#1f8ef1", level: 88 },
        { name: "Bootstrap",   icon: <FaBootstrap />,  color: "#b77bf6", level: 80 },
      ],
    },
    {
      label: "Database & Tools",
      skills: [
        { name: "MongoDB",  icon: <SiMongodb />,  color: "#00b09b", level: 80 },
        { name: "MySQL",    icon: <SiMysql />,    color: "#00d2ff", level: 78 },
        { name: "SQL",      icon: <FaDatabase />, color: "#0083b0", level: 82 },
        { name: "LeetCode", icon: <SiLeetcode />, color: "#ffa500", level: 75 },
      ],
    },
  ];

  const totalSkills = skillGroups.reduce((a, g) => a + g.skills.length, 0);
  let skillIdx = 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700;800&display=swap');
        #about *, #about *::before, #about *::after { box-sizing: border-box; }
        #about { font-family: 'Syne', sans-serif; }

        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn       { from{opacity:0;transform:scale(0.75) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes accentLine  { from{width:0;opacity:0} to{width:180px;opacity:1} }
        @keyframes tagFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes scanline    { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }

        .connect-btn {
          position: relative; display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 32px; border-radius: 14px; border: none;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.92rem; letter-spacing: 0.04em;
          cursor: pointer; overflow: hidden;
          background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 40%, #0891b2 100%);
          color: #020e18; transition: all 0.35s ease; box-shadow: 0 4px 22px rgba(34,211,238,0.35);
        }
        .connect-btn::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        }
        .connect-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(34,211,238,0.45); }
        .connect-btn:hover::after { animation: scanline 0.6s ease forwards; }

        @media(max-width:500px) {
          .info-2col   { grid-template-columns: 1fr !important; }
          .skills-auto { grid-template-columns: repeat(3,1fr) !important; }
        }

        /* ── Scroll reveal base state ── */
        .reveal-item {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal-item.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Slide-from-left for tagline badge */
        .reveal-left {
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal-left.is-visible {
          opacity: 1;
          transform: translateX(0);
        }

        /* Scale-in for accent line */
        .reveal-line {
          opacity: 0;
          transform: scaleX(0);
          transform-origin: left center;
          transition: opacity 0.5s ease 0.2s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s;
        }
        .reveal-line.is-visible {
          opacity: 1;
          transform: scaleX(1);
        }
      `}</style>

      <section
        id="about"
        style={{
          position: "relative", minHeight: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", padding: "100px 24px 80px",
        }}
      >
        <ParticleField darkMode={darkMode} />

        {/* Ambient glows */}
        <div style={{ position:"absolute", top:"8%", right:"6%", width:600, height:600, background:`radial-gradient(circle,${accentDim} 0%,transparent 65%)`, filter:"blur(90px)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"absolute", bottom:"5%", left:"4%", width:420, height:420, background:`radial-gradient(circle,${accentDim} 0%,transparent 65%)`, filter:"blur(70px)", pointerEvents:"none", zIndex:0 }} />

        {/* Grid overlay */}
        <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:darkMode?0.025:0.015, backgroundImage:`linear-gradient(${accent} 1px,transparent 1px),linear-gradient(90deg,${accent} 1px,transparent 1px)`, backgroundSize:"60px 60px" }} />

        {/* Top center line */}
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"1px", height:"130px", background:`linear-gradient(to bottom,${accent},transparent)`, opacity:0.6, zIndex:1 }} />

        {/* ── Main content ── */}
        <div ref={sectionWrapRef} style={{ position:"relative", zIndex:2, width:"100%", maxWidth:"820px" }}>

          {/* Page tagline badge — slides in from left */}
          <div
            ref={taglineRef}
            className={`reveal-left${taglineVisible ? " is-visible" : ""}`}
            style={{ display:"inline-flex", alignItems:"center", gap:"8px", fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", color:accent, opacity: taglineVisible ? 0.85 : 0, marginBottom:"14px" }}
          >
            <span style={{ width:"26px", height:"1.5px", background:accent, borderRadius:"2px", display:"inline-block" }} />
            Portfolio
          </div>

          {/* Title — fades up */}
          <h2
            ref={titleRef}
            className={`reveal-item${titleVisible ? " is-visible" : ""}`}
            style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, lineHeight:1.05, color:textPrimary, letterSpacing:"-0.022em", fontFamily:"'Syne',sans-serif", margin:"0 0 8px" }}
          >
            Get to Know <span style={{ color:accent, textShadow:`0 0 28px ${accentGlow}` }}>Me</span>
          </h2>

          {/* Accent line — scales in */}
          <div
            ref={lineRef}
            className={`reveal-line${lineVisible ? " is-visible" : ""}`}
            style={{ height:"2.5px", background:`linear-gradient(90deg,${accent},${accent}50,transparent)`, borderRadius:"2px", marginBottom:"36px", width:"180px" }}
          />

          {/* ════ ACCORDION ════ */}
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

            {/* ── 01 About ── */}
            <AccordionSection
              number="01" label="Who I Am" sublabel="About Me"
              isOpen={openSection === "about"}
              onToggle={() => toggle("about")}
              isDone={visited.about && openSection !== "about"}
              revealDelay={0}
              {...shared}
            >
              <p style={{ color:textMuted, fontSize:"0.95rem", lineHeight:1.88, maxWidth:"580px", marginBottom:"16px", fontFamily:"'Syne',sans-serif" }}>
                Hey! I'm <span style={{ color:accent, fontWeight:700 }}>Arun</span>, a passionate{" "}
                <span style={{ color:accent, fontWeight:700 }}>Java Full Stack Developer</span>{" "}
                from Tiruchirappalli, Tamil Nadu. I love building web apps that are fast, clean, and genuinely useful.
              </p>
              <p style={{ color:textMuted, fontSize:"0.95rem", lineHeight:1.88, maxWidth:"580px", marginBottom:"24px", fontFamily:"'Syne',sans-serif" }}>
                My stack revolves around <span style={{ color:accent, fontWeight:600 }}>Spring Boot & React</span> for production-grade systems,
                with a deep interest in clean architecture and system design. Outside of building, I sharpen my problem-solving on{" "}
                <span style={{ color:accent, fontWeight:600 }}>LeetCode</span> — 300+ problems and counting 🚀.
              </p>
              <div className="info-2col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {infoCards.map((c, i) => <InfoCard key={i} {...c} {...shared} />)}
              </div>
            </AccordionSection>

            {/* ── 02 Experience ── */}
            <AccordionSection
              number="02" label="Experience" sublabel="Work & Projects"
              isOpen={openSection === "experience"}
              onToggle={() => toggle("experience")}
              isDone={visited.experience && openSection !== "experience"}
              revealDelay={120}
              {...shared}
            >
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                {experiences.map((exp, i) => (
                  <ExpCard key={i} idx={i} exp={exp}
                    accent={accent} accentDim={accentDim} accentBorder={accentBorder}
                    cardBg={cardBg} cardBorder={cardBorder}
                    textPrimary={textPrimary} textMuted={textMuted} textSub={textSub}
                  />
                ))}
              </div>
            </AccordionSection>

            {/* ── 03 Skills ── */}
            <AccordionSection
              number="03" label="Tech Stack" sublabel="Skills & Tools"
              isOpen={openSection === "skills"}
              onToggle={() => toggle("skills")}
              isDone={visited.skills && openSection !== "skills"}
              revealDelay={240}
              {...shared}
            >
              {skillGroups.map((group, gi) => (
                <div key={gi} style={{ marginBottom:"22px" }}>
                  <div style={{ fontSize:"0.62rem", fontFamily:"'DM Mono',monospace", letterSpacing:"0.12em", textTransform:"uppercase", color:textSub, marginBottom:"10px", display:"flex", alignItems:"center", gap:"10px" }}>
                    <div style={{ flex:1, height:"1px", background:cardBorder }} />
                    {group.label}
                    <div style={{ flex:1, height:"1px", background:cardBorder }} />
                  </div>
                  <div className="skills-auto" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))", gap:"10px" }}>
                    {group.skills.map((sk, si) => {
                      const idx = skillIdx++;
                      return <SkillCard key={si} idx={idx} skill={sk} cardBg={cardBg} cardBorder={cardBorder} textSub={textSub} />;
                    })}
                  </div>
                </div>
              ))}
              <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", marginTop:"4px", padding:"6px 14px", borderRadius:"999px", background:accentDim, border:`1px solid ${accentBorder}`, fontFamily:"'DM Mono',monospace", fontSize:"0.68rem", color:accent, letterSpacing:"0.08em", textTransform:"uppercase", animation:"tagFloat 4s ease-in-out infinite" }}>
                <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:accent, display:"inline-block" }} />
                {totalSkills} technologies & growing
              </div>
            </AccordionSection>

          </div>

          {/* CTA — fades up last */}
          <div
            ref={ctaRef}
            className={`reveal-item${ctaVisible ? " is-visible" : ""}`}
            style={{ marginTop:"32px" }}
          >
            <Link to="contact" smooth duration={800} offset={-70}>
              <button className="connect-btn">
                <span>Let's Connect</span>
                <span style={{ fontSize:"1rem" }}>💬</span>
              </button>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}