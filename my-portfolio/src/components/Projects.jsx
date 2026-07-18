import React, { useRef, useState, useEffect } from "react";
import {
  FaGithub, FaExternalLinkAlt, FaReact, FaJs,
  FaHtml5, FaCss3Alt, FaNodeJs,
} from "react-icons/fa";
import { SiMongodb, SiExpress } from "react-icons/si";

/* ── Particle background (same as Hero / About) ── */
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
    const N   = 55;
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
        p.x = (p.x + p.vx + canvas.width)  % canvas.width;
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

/* ── Tech badge chip ── */
function TechChip({ icon, label, accent, accentDim, accentBorder, textSub }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"inline-flex", alignItems:"center", gap:"5px",
        padding:"4px 10px", borderRadius:"8px",
        background: hov ? accentDim : "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? accentBorder : "rgba(255,255,255,0.08)"}`,
        fontSize:"0.68rem", fontFamily:"'DM Mono',monospace",
        color: hov ? accent : textSub,
        letterSpacing:"0.04em", transition:"all 0.2s ease",
        cursor:"default",
      }}
    >
      <span style={{ fontSize:"0.78rem" }}>{icon}</span>
      {label}
    </span>
  );
}

/* ── Single featured project row ── */
function ProjectRow({ proj, index, darkMode, accent, accentLight, accentDim, accentBorder, accentGlow, textPrimary, textMuted, textSub, cardBg, cardBorder, badgeBg }) {
  const [imgHov, setImgHov] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div
      style={{
        display:"flex", flexDirection: isEven ? "row" : "row-reverse",
        alignItems:"center", gap:"60px", flexWrap:"wrap",
        padding:"52px 0",
        borderBottom: `1px solid ${cardBorder}`,
        animation:`fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) ${0.1 * index + 0.1}s both`,
      }}
    >
      {/* ── Image side ── */}
      <div
        onMouseEnter={() => setImgHov(true)}
        onMouseLeave={() => setImgHov(false)}
        style={{
          flex:"0 0 440px", maxWidth:"440px", position:"relative",
          borderRadius:"20px", overflow:"hidden",
          border: `1.5px solid ${imgHov ? accentBorder : cardBorder}`,
          boxShadow: imgHov
            ? `0 0 0 4px ${accentDim}, 0 24px 60px rgba(0,0,0,0.5)`
            : `0 8px 32px rgba(0,0,0,0.3)`,
          transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          transform: imgHov ? "scale(1.02) translateY(-4px)" : "scale(1)",
          cursor:"default",
        }}
      >
        {/* Corner accents */}
        {["tl","tr","bl","br"].map(c => (
          <div key={c} style={{
            position:"absolute", width:"18px", height:"18px", zIndex:3, pointerEvents:"none",
            ...(c==="tl" ? { top:-1, left:-1, borderTop:`2px solid ${accent}`, borderLeft:`2px solid ${accent}`, borderRadius:"5px 0 0 0" } : {}),
            ...(c==="tr" ? { top:-1, right:-1, borderTop:`2px solid ${accent}`, borderRight:`2px solid ${accent}`, borderRadius:"0 5px 0 0" } : {}),
            ...(c==="bl" ? { bottom:-1, left:-1, borderBottom:`2px solid ${accent}`, borderLeft:`2px solid ${accent}`, borderRadius:"0 0 0 5px" } : {}),
            ...(c==="br" ? { bottom:-1, right:-1, borderBottom:`2px solid ${accent}`, borderRight:`2px solid ${accent}`, borderRadius:"0 0 5px 0" } : {}),
          }} />
        ))}

        {/* Project image */}
        <img
          src={proj.img}
          alt={proj.title}
          style={{
            width:"100%", height:"260px", objectFit:"cover", display:"block",
            transition:"transform 0.5s ease",
            transform: imgHov ? "scale(1.06)" : "scale(1)",
          }}
        />

        {/* Gradient overlay */}
        <div style={{
          position:"absolute", inset:0,
          background: imgHov
            ? `linear-gradient(to top, rgba(8,14,26,0.85) 0%, rgba(8,14,26,0.2) 60%, transparent 100%)`
            : `linear-gradient(to top, rgba(8,14,26,0.6) 0%, transparent 60%)`,
          transition:"background 0.4s ease",
          pointerEvents:"none",
        }} />

        {/* Project number watermark */}
        <div style={{
          position:"absolute", top:"14px", left:"16px",
          fontFamily:"'DM Mono',monospace", fontSize:"0.65rem",
          color:accent, opacity:0.7, letterSpacing:"0.14em",
          textTransform:"uppercase", zIndex:2,
        }}>
          {String(index + 1).padStart(2,"0")} / {String(5).padStart(2,"0")}
        </div>

        {/* Hover CTA overlay */}
        <div style={{
          position:"absolute", bottom:"16px", left:"50%", transform:"translateX(-50%)",
          display:"flex", gap:"10px", opacity: imgHov ? 1 : 0,
          transition:"opacity 0.3s ease", zIndex:2,
        }}>
          <a href={proj.github} target="_blank" rel="noreferrer"
            style={{
              display:"inline-flex", alignItems:"center", gap:"6px",
              padding:"8px 16px", borderRadius:"10px",
              background:"rgba(8,14,26,0.9)", border:`1px solid ${accentBorder}`,
              color:accent, fontFamily:"'Syne',sans-serif", fontWeight:600,
              fontSize:"0.75rem", textDecoration:"none",
              transition:"all 0.2s ease",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background=accentDim; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(8,14,26,0.9)"; }}
          >
            <FaGithub size={13}/> Code
          </a>
          {proj.live && proj.live !== "#" ? (
            <a href={proj.live} target="_blank" rel="noreferrer"
              style={{
                display:"inline-flex", alignItems:"center", gap:"6px",
                padding:"8px 16px", borderRadius:"10px",
                background:"linear-gradient(135deg,#22d3ee,#0891b2)",
                border:"none", color:"#020e18",
                fontFamily:"'Syne',sans-serif", fontWeight:700,
                fontSize:"0.75rem", textDecoration:"none",
                transition:"all 0.2s ease",
              }}
            >
              <FaExternalLinkAlt size={11}/> Live Demo
            </a>
          ) : (
            <span style={{
              display:"inline-flex", alignItems:"center", gap:"6px",
              padding:"8px 16px", borderRadius:"10px",
              background:"rgba(100,116,139,0.3)", border:`1px solid rgba(100,116,139,0.3)`,
              color:textSub, fontFamily:"'Syne',sans-serif", fontWeight:600,
              fontSize:"0.75rem", opacity:0.8,
            }}>
              🚧 Coming Soon
            </span>
          )}
        </div>
      </div>

      {/* ── Text side ── */}
      <div style={{ flex:"1 1 300px", minWidth:260 }}>

        {/* Index tag */}
        <div style={{
          fontFamily:"'DM Mono',monospace", fontSize:"0.7rem",
          color:accent, opacity:0.75, letterSpacing:"0.18em",
          textTransform:"uppercase", marginBottom:"12px",
          display:"flex", alignItems:"center", gap:"8px",
        }}>
          <span style={{ width:"22px", height:"1.5px", background:accent, display:"inline-block", borderRadius:"2px" }} />
          Project {String(index + 1).padStart(2,"0")}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily:"'Syne',sans-serif", fontWeight:800,
          fontSize:"clamp(1.25rem,2.5vw,1.65rem)",
          color:textPrimary, lineHeight:1.15,
          letterSpacing:"-0.018em", margin:"0 0 14px",
        }}>
          {proj.title}
        </h3>

        {/* Accent line */}
        <div style={{
          height:"2px", width:"48px",
          background:`linear-gradient(90deg,${accent},transparent)`,
          borderRadius:"2px", marginBottom:"16px",
        }} />

        {/* Description */}
        <p style={{
          color:textMuted, fontSize:"0.92rem", lineHeight:1.85,
          fontFamily:"'Syne',sans-serif", fontWeight:400,
          maxWidth:"420px", marginBottom:"22px",
        }}>
          {proj.desc}
        </p>

        {/* Tech chips */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:"7px", marginBottom:"28px" }}>
          {proj.tech.map((t, i) => (
            <TechChip key={i} icon={t.icon} label={t.label}
              accent={accent} accentDim={accentDim} accentBorder={accentBorder} textSub={textSub}
            />
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
          <a href={proj.github} target="_blank" rel="noreferrer"
            style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"12px 24px", borderRadius:"12px",
              background:accentDim, border:`1px solid ${accentBorder}`,
              color:accent, fontFamily:"'Syne',sans-serif", fontWeight:700,
              fontSize:"0.85rem", textDecoration:"none",
              transition:"all 0.3s ease",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background=`rgba(34,211,238,0.18)`; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 8px 24px ${accentDim}`; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=accentDim; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
          >
            <FaGithub size={14}/> View Code
          </a>

          {proj.live && proj.live !== "#" ? (
            <a href={proj.live} target="_blank" rel="noreferrer"
              style={{
                display:"inline-flex", alignItems:"center", gap:"8px",
                padding:"12px 24px", borderRadius:"12px", border:"none",
                background:"linear-gradient(135deg,#22d3ee 0%,#06b6d4 40%,#0891b2 100%)",
                color:"#020e18", fontFamily:"'Syne',sans-serif", fontWeight:700,
                fontSize:"0.85rem", textDecoration:"none",
                boxShadow:"0 4px 20px rgba(34,211,238,0.3)",
                transition:"all 0.3s ease",
              }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 36px rgba(34,211,238,0.45)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(34,211,238,0.3)"; }}
            >
              <FaExternalLinkAlt size={12}/> Live Demo
            </a>
          ) : (
            <span style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"11px 22px", borderRadius:"12px",
              background:"rgba(100,116,139,0.1)", border:`1px solid rgba(100,116,139,0.2)`,
              color:textSub, fontFamily:"'Syne',sans-serif", fontWeight:600,
              fontSize:"0.85rem", opacity:0.75, cursor:"default",
            }}>
              🚧 Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Projects component
───────────────────────────────────────────── */
export default function Projects({ darkMode = true }) {
  const accent       = darkMode ? "#22d3ee" : "#0891b2";
  const accentLight  = darkMode ? "#67e8f9" : "#06b6d4";
  const accentDim    = darkMode ? "rgba(34,211,238,0.1)"  : "rgba(8,145,178,0.08)";
  const accentBorder = darkMode ? "rgba(34,211,238,0.3)"  : "rgba(8,145,178,0.35)";
  const accentGlow   = darkMode ? "rgba(34,211,238,0.35)" : "rgba(8,145,178,0.25)";
  const textPrimary  = darkMode ? "#f0f6fc" : "#0c2340";
  const textMuted    = darkMode ? "rgba(148,163,184,0.9)" : "rgba(30,58,92,0.8)";
  const textSub      = darkMode ? "#64748b"               : "#475569";
  const cardBg       = darkMode ? "rgba(255,255,255,0.04)": "rgba(8,145,178,0.04)";
  const cardBorder   = darkMode ? "rgba(255,255,255,0.08)": "rgba(8,145,178,0.12)";
  const badgeBg      = darkMode ? "rgba(8,14,26,0.92)"    : "rgba(240,249,255,0.95)";

  const projects = [
    {
      title: "CCET — Attendance Spell Management System",
      desc:  "A digital attendance and spell tracking system designed to simplify class management for colleges. Features real-time tracking, role-based access, and clean dashboards for faculty.",
      tech:  [
        { icon:<FaReact/>,   label:"React"      },
        { icon:<FaJs/>,      label:"JavaScript" },
        { icon:<FaHtml5/>,   label:"HTML"       },
        { icon:<FaCss3Alt/>, label:"CSS"        },
      ],
      github: "https://github.com/Arun-k19/Attendance-spell.git",
      live:   "https://attendance-spell.vercel.app/",
      img:    "/projects/AttendaceLogin.png",
    },
    {
      title: "Portfolio Website",
      desc:  "My personal portfolio showcasing skills and projects. Built with React, custom animations, dark/light mode, particle backgrounds, and a fully responsive layout.",
      tech:  [
        { icon:<FaReact/>,   label:"React"      },
        { icon:<FaCss3Alt/>, label:"CSS"        },
        { icon:<FaJs/>,      label:"JavaScript" },
      ],
      github: "https://github.com/Arun-k19/My-Portfolio.git",
      live:   "https://arun-portfolio-ivory.vercel.app/",
      img:    "/projects/myportfolio.png",
    },
    {
      title: "Learning Management System (LMS)",
      desc:  "An LMS built with HTML, CSS, and JavaScript featuring a course dashboard, progress tracking, and certification system. Designed for a clean and intuitive student experience.",
      tech:  [
        { icon:<FaHtml5/>,   label:"HTML"       },
        { icon:<FaCss3Alt/>, label:"CSS"        },
        { icon:<FaJs/>,      label:"JavaScript" },
      ],
      github: "https://github.com/Arun-k19/LMS.git",
      live:   "#",
      img:    "/projects/Lms.png",
    },
    {
      title: "Code Bug Buster",
      desc:  "A real-time debugging platform built for college symposiums. Supports multi-language coding challenges in Java, C, and Python with a competitive leaderboard and live judging.",
      tech:  [
        { icon:<FaReact/>, label:"React"      },
        { icon:<FaJs/>,    label:"JavaScript" },
        { icon:<FaHtml5/>, label:"HTML"       },
      ],
      github: "https://github.com/Arun-k19/Bug-Buster.git",
      live:   "https://arun-k19.github.io/BugBuster/",
      img:    "/projects/BugBuster.png",
    },
    {
      title: "Netflix Clone",
      desc:  "A fully responsive Netflix Clone built with React and the TMDB API. Features Firebase authentication, movie browsing, search, and trailer playback in a polished modern UI.",
      tech:  [
        { icon:<FaReact/>,   label:"React"      },
        { icon:<FaJs/>,      label:"JavaScript" },
        { icon:<FaHtml5/>,   label:"HTML"       },
        { icon:<FaCss3Alt/>, label:"CSS"        },
      ],
      github: "https://github.com/Arun-k19/Netflix-.git",
      live:   "#",
      img:    "/projects/Netflix.png",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700;800&display=swap');
        #projects *, #projects *::before, #projects *::after { box-sizing:border-box; }
        #projects { font-family:'Syne',sans-serif; }

        @keyframes fadeSlideUp  { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes accentLine   { from{width:0;opacity:0} to{width:180px;opacity:1} }
        @keyframes scanline     { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }

        .proj-header-anim { animation:fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.05s both; }

        .section-tag {
          display:inline-flex; align-items:center; gap:8px;
          font-family:'DM Mono',monospace; font-size:0.72rem;
          letter-spacing:0.18em; text-transform:uppercase;
          color:${accent}; opacity:0.85; margin-bottom:14px;
        }
        .section-tag::before {
          content:''; width:26px; height:1.5px;
          background:${accent}; border-radius:2px; display:inline-block;
        }

        .proj-title {
          font-size:clamp(2.2rem,4vw,3.2rem);
          font-weight:800; line-height:1.05;
          color:${textPrimary};
          letter-spacing:-0.022em;
          font-family:'Syne',sans-serif;
          margin:0 0 8px;
        }
        .proj-title .highlight { color:${accent}; text-shadow:0 0 28px ${accentGlow}; }

        @media(max-width:768px) {
          .proj-row { flex-direction:column !important; gap:28px !important; }
          .proj-img-side { flex:0 0 auto !important; max-width:100% !important; width:100% !important; }
        }
      `}</style>

      <section
        id="projects"
        style={{
          position:"relative",
          padding:"100px 24px 80px",
          overflow:"hidden",
        }}
      >
        <ParticleField darkMode={darkMode} />

        {/* Ambient glows */}
        <div style={{ position:"absolute", top:"6%",  left:"4%",  width:600, height:600, background:`radial-gradient(circle,${accentDim} 0%,transparent 65%)`, filter:"blur(90px)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"absolute", bottom:"8%", right:"5%", width:420, height:420, background:`radial-gradient(circle,${accentDim} 0%,transparent 65%)`, filter:"blur(70px)", pointerEvents:"none", zIndex:0 }} />

        {/* Grid overlay */}
        <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:darkMode?0.025:0.015, backgroundImage:`linear-gradient(${accent} 1px,transparent 1px),linear-gradient(90deg,${accent} 1px,transparent 1px)`, backgroundSize:"60px 60px" }} />

        {/* Top center line */}
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"1px", height:"130px", background:`linear-gradient(to bottom,${accent},transparent)`, opacity:0.6, zIndex:1 }} />

        <div style={{ position:"relative", zIndex:2, maxWidth:"1140px", margin:"0 auto" }}>

          {/* ── Section header ── */}
          <div className="proj-header-anim" style={{ marginBottom:"16px" }}>
            <div className="section-tag">02 — Projects</div>
            <h2 className="proj-title">
              What I've <span className="highlight">Built</span>
            </h2>
            <div style={{
              height:"2.5px",
              background:`linear-gradient(90deg,${accent},${accent}50,transparent)`,
              borderRadius:"2px", width:"180px", marginTop:"10px",
              animation:"accentLine 0.8s ease 0.4s both",
            }} />
            <p style={{
              color:textSub, fontSize:"0.85rem", fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.04em", marginTop:"14px",
            }}>
              {projects.length} projects — hover images to preview links
            </p>
          </div>

          {/* ── Project rows ── */}
          <div>
            {projects.map((proj, i) => (
              <div key={i} className="proj-row">
                <ProjectRow
                  proj={proj} index={i} darkMode={darkMode}
                  accent={accent} accentLight={accentLight}
                  accentDim={accentDim} accentBorder={accentBorder} accentGlow={accentGlow}
                  textPrimary={textPrimary} textMuted={textMuted} textSub={textSub}
                  cardBg={cardBg} cardBorder={cardBorder} badgeBg={badgeBg}
                />
              </div>
            ))}
          </div>

          {/* ── Footer CTA ── */}
          <div style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            paddingTop:"52px", gap:"16px",
            animation:"fadeSlideUp 0.8s ease 0.5s both",
          }}>
            <div style={{
              fontFamily:"'DM Mono',monospace", fontSize:"0.72rem",
              color:textSub, letterSpacing:"0.14em", textTransform:"uppercase",
            }}>
              Want to see more?
            </div>
            <a
              href="https://github.com/Arun-k19"
              target="_blank" rel="noreferrer"
              style={{
                display:"inline-flex", alignItems:"center", gap:"10px",
                padding:"14px 32px", borderRadius:"14px", textDecoration:"none",
                background:`linear-gradient(135deg,#22d3ee 0%,#06b6d4 40%,#0891b2 100%)`,
                color:"#020e18", fontFamily:"'Syne',sans-serif",
                fontWeight:700, fontSize:"0.9rem", letterSpacing:"0.04em",
                boxShadow:"0 4px 22px rgba(34,211,238,0.35)",
                transition:"all 0.3s ease",
                position:"relative", overflow:"hidden",
              }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(34,211,238,0.45)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 22px rgba(34,211,238,0.35)"; }}
            >
              <FaGithub size={16}/> View All on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}