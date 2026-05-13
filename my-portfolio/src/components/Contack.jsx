import React, { useRef, useState, useEffect } from "react";
import {
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt,
  FaGithub, FaLinkedin, FaInstagram, FaPaperPlane,
} from "react-icons/fa";

/* ── Particle background ── */
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
    const N   = 50;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.3,
      vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
      pulse: Math.random() * Math.PI * 2,
      baseAlpha: Math.random() * 0.2 + 0.06,
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

/* ── useScrollReveal hook ── */
function useScrollReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.disconnect(); }
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return [ref, visible];
}

/* ── Contact Info Card ── */
function ContactInfoCard({ icon, label, value, href, accent, accentDim, accentBorder, cardBg, cardBorder, textPrimary, textSub, delay }) {
  const [hov, setHov] = useState(false);
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper
      href={href} target={href ? "_blank" : undefined} rel={href ? "noreferrer" : undefined}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:"16px",
        padding:"16px 18px", borderRadius:"16px",
        background: hov ? accentDim : cardBg,
        border: `1px solid ${hov ? accentBorder : cardBorder}`,
        backdropFilter:"blur(12px)",
        transform: hov ? "translateX(6px)" : "translateX(0)",
        boxShadow: hov ? `0 8px 28px ${accentDim}, inset 0 1px 0 rgba(255,255,255,0.06)` : `inset 0 1px 0 rgba(255,255,255,0.04)`,
        transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: href ? "pointer" : "default",
        textDecoration:"none",
        animation:`slideInLeft 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
      }}
    >
      {/* Icon box */}
      <div style={{
        width:"44px", height:"44px", borderRadius:"13px", flexShrink:0,
        background: hov ? `${accent}22` : `${accent}0e`,
        border: `1px solid ${hov ? accentBorder : `${accent}22`}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        color: accent, fontSize:"1rem",
        transition:"all 0.3s ease",
        boxShadow: hov ? `0 0 18px ${accent}33` : "none",
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize:"0.6rem", fontFamily:"'DM Mono',monospace", letterSpacing:"0.12em", textTransform:"uppercase", color:textSub, marginBottom:"3px" }}>
          {label}
        </div>
        <div style={{ fontSize:"0.88rem", fontFamily:"'Syne',sans-serif", fontWeight:600, color: hov ? textPrimary : textSub, transition:"color 0.3s ease" }}>
          {value}
        </div>
      </div>
      {/* Arrow indicator for links */}
      {href && (
        <div style={{
          marginLeft:"auto", fontSize:"0.75rem", color: hov ? accent : "transparent",
          transition:"all 0.3s ease", transform: hov ? "translateX(0)" : "translateX(-6px)",
        }}>→</div>
      )}
    </Wrapper>
  );
}

/* ── Social Button ── */
function SocialBtn({ href, label, icon, hoverColor, cardBg, cardBorder, textSub, accentDim, accentBorder }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width:"48px", height:"48px", borderRadius:"14px",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:"1.15rem", textDecoration:"none",
        background: hov ? `${hoverColor}18` : cardBg,
        border: `1px solid ${hov ? `${hoverColor}55` : cardBorder}`,
        color: hov ? hoverColor : textSub,
        backdropFilter:"blur(8px)",
        transform: hov ? "translateY(-5px) scale(1.1)" : "scale(1)",
        boxShadow: hov ? `0 10px 28px ${hoverColor}33` : "none",
        transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >{icon}</a>
  );
}

/* ── Floating label input ── */
function FloatingField({ label, name, type = "text", value, onChange, onFocus, onBlur, focused, accent, accentDim, accentBorder, cardBg, cardBorder, textPrimary, textSub, placeholder, isTextarea }) {
  const active = focused === name || value.length > 0;
  const Tag    = isTextarea ? "textarea" : "input";
  return (
    <div style={{ position:"relative", marginBottom:"20px" }}>
      <label style={{
        position:"absolute", left:"16px",
        top: active ? "-9px" : isTextarea ? "16px" : "50%",
        transform: active ? "translateY(0) scale(0.82)" : "translateY(-50%) scale(1)",
        transformOrigin:"left center",
        fontFamily:"'DM Mono',monospace", fontSize:"0.75rem",
        letterSpacing:"0.1em", textTransform:"uppercase",
        color: focused === name ? accent : textSub,
        background: active ? (cardBg.includes("0.04") ? "transparent" : cardBg) : "transparent",
        padding: active ? "0 6px" : "0",
        pointerEvents:"none",
        transition:"all 0.25s cubic-bezier(0.22,1,0.36,1)",
        zIndex:1,
      }}>
        {label}
      </label>
      <Tag
        type={type} name={name} value={value}
        onChange={onChange} required
        placeholder={focused === name ? placeholder : ""}
        onFocus={onFocus} onBlur={onBlur}
        rows={isTextarea ? 5 : undefined}
        style={{
          width:"100%", padding: isTextarea ? "20px 16px 14px" : "18px 16px 10px",
          borderRadius:"14px",
          background: focused === name ? `rgba(34,211,238,0.07)` : cardBg,
          border: `1.5px solid ${focused === name ? accentBorder : cardBorder}`,
          color: textPrimary,
          fontFamily:"'Syne',sans-serif", fontSize:"0.92rem",
          outline:"none", transition:"all 0.3s ease",
          backdropFilter:"blur(8px)",
          boxShadow: focused === name ? `0 0 0 4px ${accentDim}, inset 0 1px 0 rgba(255,255,255,0.06)` : "none",
          resize: isTextarea ? "vertical" : undefined,
          minHeight: isTextarea ? "140px" : undefined,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Contact Component
───────────────────────────────────────────── */
export default function Contact({ darkMode = true }) {
  const accent       = darkMode ? "#22d3ee" : "#0891b2";
  const accentDim    = darkMode ? "rgba(34,211,238,0.1)"  : "rgba(8,145,178,0.08)";
  const accentBorder = darkMode ? "rgba(34,211,238,0.3)"  : "rgba(8,145,178,0.35)";
  const accentGlow   = darkMode ? "rgba(34,211,238,0.35)" : "rgba(8,145,178,0.25)";
  const textPrimary  = darkMode ? "#f0f6fc" : "#0c2340";
  const textMuted    = darkMode ? "rgba(148,163,184,0.9)" : "rgba(30,58,92,0.8)";
  const textSub      = darkMode ? "#64748b"               : "#475569";
  const cardBg       = darkMode ? "rgba(255,255,255,0.04)": "rgba(8,145,178,0.04)";
  const cardBorder   = darkMode ? "rgba(255,255,255,0.08)": "rgba(8,145,178,0.12)";

  const [form, setForm]       = useState({ name:"", email:"", message:"" });
  const [status, setStatus]   = useState("idle");
  const [focused, setFocused] = useState("");

  const [headerRef, headerVis] = useScrollReveal(0);
  const [leftRef,   leftVis]   = useScrollReveal(150);
  const [rightRef,  rightVis]  = useScrollReveal(250);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1800);
  };

  const contactInfo = [
    { icon:<FaEnvelope/>,     label:"Email",    value:"arunk741921@gmail.com",      href:"mailto:arunk741921@gmail.com", delay:0.05 },
    { icon:<FaPhoneAlt/>,     label:"Phone",    value:"+91 74187 71921",              href:"tel:+917418771921",            delay:0.15 },
    { icon:<FaMapMarkerAlt/>, label:"Location", value:"Tiruchirappalli, Tamil Nadu", href:null,                           delay:0.25 },
  ];

  const socials = [
    { href:"https://github.com/Arun-k19",             label:"GitHub",    icon:<FaGithub/>,    hoverColor: darkMode?"#e2e8f0":"#1e293b" },
    { href:"https://www.linkedin.com/in/arun-k1921/", label:"LinkedIn",  icon:<FaLinkedin/>,  hoverColor:"#0A66C2" },
    { href:"https://instagram.com/arun.__.k",         label:"Instagram", icon:<FaInstagram/>, hoverColor:"#E1306C" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700;800&display=swap');
        #contact *, #contact *::before, #contact *::after { box-sizing:border-box; }
        #contact { font-family:'Syne',sans-serif; }

        @keyframes slideUp      { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(28px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn      { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
        @keyframes accentLine   { from{width:0;opacity:0} to{width:220px;opacity:1} }
        @keyframes scanline     { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
        @keyframes sentPop      { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
        @keyframes spinOnce     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes dotPulse     { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.5)} 50%{box-shadow:0 0 0 6px rgba(74,222,128,0)} }
        @keyframes borderGlow   { 0%,100%{opacity:0.4} 50%{opacity:1} }

        /* Reveal helpers */
        .reveal-up   { opacity:0; transform:translateY(36px);   transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .reveal-left { opacity:0; transform:translateX(-32px);  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .reveal-right{ opacity:0; transform:translateX(32px);   transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .is-visible  { opacity:1 !important; transform:none !important; }

        ::placeholder { color:${textSub}; opacity:0.5; }
        textarea { resize:vertical; }

        /* Send button */
        .send-btn {
          position:relative; width:100%;
          display:flex; align-items:center; justify-content:center; gap:10px;
          padding:16px 32px; border-radius:14px; border:none;
          font-family:'Syne',sans-serif; font-weight:700;
          font-size:0.92rem; letter-spacing:0.06em; text-transform:uppercase;
          cursor:pointer; overflow:hidden;
          background:linear-gradient(135deg,#22d3ee 0%,#06b6d4 50%,#0891b2 100%);
          color:#020e18; transition:all 0.35s ease;
          box-shadow:0 4px 22px rgba(34,211,238,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .send-btn::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,#34d8f2,#0ea5c9);
          opacity:0; transition:opacity 0.35s ease;
        }
        .send-btn::after {
          content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
        }
        .send-btn:hover:not(:disabled)::before { opacity:1; }
        .send-btn:hover:not(:disabled) { transform:translateY(-3px); box-shadow:0 14px 44px rgba(34,211,238,0.5), inset 0 1px 0 rgba(255,255,255,0.3); }
        .send-btn:hover:not(:disabled)::after  { animation:scanline 0.65s ease forwards; }
        .send-btn:active:not(:disabled) { transform:translateY(0px); }
        .send-btn:disabled { opacity:0.65; cursor:not-allowed; }
        .send-btn > * { position:relative; z-index:1; }

        .sent-anim { animation:sentPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }

        @media(max-width:860px) {
          .contact-grid { flex-direction:column !important; }
          .contact-left { flex:none !important; width:100% !important; }
        }
      `}</style>

      <section
        id="contact"
        style={{
          position:"relative",
          padding:"110px 24px 100px",
          overflow:"hidden",
          minHeight:"100vh",
        }}
      >
        <ParticleField darkMode={darkMode} />

        {/* Ambient blobs */}
        <div style={{ position:"absolute", top:"5%",  left:"3%",  width:700, height:700, background:`radial-gradient(circle,${accentDim} 0%,transparent 60%)`, filter:"blur(100px)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"absolute", bottom:"5%", right:"3%", width:500, height:500, background:`radial-gradient(circle,${darkMode?"rgba(139,92,246,0.08)":"rgba(99,102,241,0.05)"} 0%,transparent 65%)`, filter:"blur(80px)", pointerEvents:"none", zIndex:0 }} />

        {/* Grid */}
        <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", opacity:darkMode?0.022:0.012, backgroundImage:`linear-gradient(${accent} 1px,transparent 1px),linear-gradient(90deg,${accent} 1px,transparent 1px)`, backgroundSize:"64px 64px" }} />

        {/* Top line */}
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"1px", height:"140px", background:`linear-gradient(to bottom,${accent},transparent)`, opacity:0.55, zIndex:1 }} />

        <div style={{ position:"relative", zIndex:2, maxWidth:"1160px", margin:"0 auto" }}>

          {/* ── Header ── */}
          <div
            ref={headerRef}
            className={`reveal-up${headerVis ? " is-visible" : ""}`}
            style={{ marginBottom:"60px" }}
          >
            {/* Tag */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:"10px", marginBottom:"16px" }}>
              <div style={{ width:"32px", height:"1.5px", background:accent, borderRadius:"2px" }} />
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.2em", textTransform:"uppercase", color:accent, opacity:0.85 }}>
                04 — Contact
              </span>
            </div>

            {/* Big heading */}
            <h2 style={{ fontSize:"clamp(2.6rem,5vw,4rem)", fontWeight:800, lineHeight:1.0, color:textPrimary, letterSpacing:"-0.028em", fontFamily:"'Syne',sans-serif", margin:"0 0 6px" }}>
              Let's Build{" "}
              <span style={{ position:"relative", display:"inline-block" }}>
                <span style={{ color:accent, textShadow:`0 0 40px ${accentGlow}` }}>Together</span>
                {/* underline squiggle effect */}
                <span style={{
                  position:"absolute", bottom:"-6px", left:0, right:0, height:"3px",
                  background:`linear-gradient(90deg,${accent},${accent}55,transparent)`,
                  borderRadius:"2px", animation:"accentLine 0.9s ease 0.5s both",
                }} />
              </span>
            </h2>

            <p style={{
              color:textSub, fontSize:"0.88rem", fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.06em", marginTop:"24px", maxWidth:"420px", lineHeight:1.9,
            }}>
              Open for full-time roles · freelance · collaboration.<br/>
              Response within <span style={{ color:accent }}>24 hours</span>.
            </p>
          </div>

          {/* ── Two-column layout ── */}
          <div className="contact-grid" style={{ display:"flex", gap:"32px", alignItems:"flex-start" }}>

            {/* ════ LEFT PANEL ════ */}
            <div
              ref={leftRef}
              className={`contact-left reveal-left${leftVis ? " is-visible" : ""}`}
              style={{ flex:"0 0 360px" }}
            >
              {/* Info card */}
              <div style={{
                padding:"32px 28px 28px", borderRadius:"24px",
                background: darkMode ? "rgba(255,255,255,0.035)" : "rgba(8,145,178,0.04)",
                border:`1.5px solid ${cardBorder}`,
                backdropFilter:"blur(20px)",
                boxShadow: darkMode
                  ? "0 24px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)"
                  : "0 24px 64px rgba(8,145,178,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
                marginBottom:"20px",
              }}>

                {/* Availability badge */}
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:"8px",
                  padding:"7px 16px", borderRadius:"999px",
                  background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.25)",
                  fontFamily:"'DM Mono',monospace", fontSize:"0.65rem",
                  color:"#86efac", letterSpacing:"0.1em", textTransform:"uppercase",
                  marginBottom:"24px",
                }}>
                  <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#4ade80", display:"inline-block", animation:"dotPulse 1.8s ease-in-out infinite" }} />
                  Available for work
                </div>

                {/* Intro text */}
                <h4 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1.15rem", color:textPrimary, margin:"0 0 10px" }}>
                  Have a project in mind?
                </h4>
                <p style={{ color:textMuted, fontSize:"0.85rem", lineHeight:1.85, fontFamily:"'Syne',sans-serif", margin:"0 0 28px" }}>
                  Whether it's a job opportunity, a cool project idea, or just wanting to say hey — my inbox is always open.
                </p>

                {/* Contact rows */}
                <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"28px" }}>
                  {contactInfo.map((info, i) => (
                    <ContactInfoCard key={i} {...info}
                      accent={accent} accentDim={accentDim} accentBorder={accentBorder}
                      cardBg={cardBg} cardBorder={cardBorder}
                      textPrimary={textPrimary} textSub={textSub}
                    />
                  ))}
                </div>

                {/* Divider */}
                <div style={{ height:"1px", background:`linear-gradient(90deg,${accent}33,transparent)`, marginBottom:"22px" }} />

                {/* Socials */}
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <span style={{ fontSize:"0.62rem", color:textSub, fontFamily:"'DM Mono',monospace", letterSpacing:"0.14em", textTransform:"uppercase", marginRight:"4px" }}>
                    Find me on
                  </span>
                  {socials.map((s, i) => (
                    <SocialBtn key={i} {...s} cardBg={cardBg} cardBorder={cardBorder} textSub={textSub} accentDim={accentDim} accentBorder={accentBorder} />
                  ))}
                </div>
              </div>

              {/* Quote card */}
              <div style={{
                padding:"22px 24px", borderRadius:"18px",
                background: darkMode ? `${accent}0a` : `${accent}07`,
                border:`1px solid ${accentBorder}`,
                backdropFilter:"blur(12px)",
                animation:"slideInLeft 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both",
              }}>
                <div style={{ fontSize:"2rem", color:accent, lineHeight:1, marginBottom:"10px", opacity:0.6, fontFamily:"Georgia,serif" }}>"</div>
                <p style={{ color:textMuted, fontSize:"0.83rem", lineHeight:1.85, fontFamily:"'Syne',sans-serif", margin:"0 0 12px", fontStyle:"italic" }}>
                  Code is not just logic — it's craft. Every pixel, every endpoint, every line of Java is a chance to make something worth remembering.
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"28px", height:"1.5px", background:accent, borderRadius:"2px" }} />
                  <span style={{ fontSize:"0.65rem", fontFamily:"'DM Mono',monospace", color:accent, letterSpacing:"0.1em", textTransform:"uppercase" }}>Arun K</span>
                </div>
              </div>
            </div>

            {/* ════ RIGHT PANEL — Form ════ */}
            <div
              ref={rightRef}
              className={`reveal-right${rightVis ? " is-visible" : ""}`}
              style={{ flex:"1 1 380px", minWidth:0 }}
            >
              <div style={{
                padding:"40px 36px", borderRadius:"24px",
                background: darkMode ? "rgba(255,255,255,0.035)" : "rgba(8,145,178,0.04)",
                border:`1.5px solid ${cardBorder}`,
                backdropFilter:"blur(20px)",
                boxShadow: darkMode
                  ? "0 24px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)"
                  : "0 24px 64px rgba(8,145,178,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}>

                {status === "sent" ? (
                  /* Success state */
                  <div className="sent-anim" style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 20px", gap:"18px" }}>
                    <div style={{
                      width:"80px", height:"80px", borderRadius:"50%",
                      background:accentDim, border:`2px solid ${accentBorder}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"2rem", boxShadow:`0 0 40px ${accentDim}`,
                    }}>✅</div>
                    <h4 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:textPrimary, margin:0, fontSize:"1.4rem", letterSpacing:"-0.02em" }}>
                      Message Sent!
                    </h4>
                    <p style={{ color:textMuted, fontFamily:"'Syne',sans-serif", fontSize:"0.9rem", textAlign:"center", lineHeight:1.8, margin:0, maxWidth:"280px" }}>
                      Thanks for reaching out — I'll get back to you within{" "}
                      <span style={{ color:accent, fontWeight:600 }}>24 hours</span> 🚀
                    </p>
                    <button
                      onClick={() => { setStatus("idle"); setForm({ name:"", email:"", message:"" }); }}
                      style={{
                        marginTop:"8px", padding:"12px 28px", borderRadius:"12px",
                        background:accentDim, border:`1px solid ${accentBorder}`,
                        color:accent, fontFamily:"'Syne',sans-serif", fontWeight:700,
                        fontSize:"0.85rem", letterSpacing:"0.06em", textTransform:"uppercase",
                        cursor:"pointer", transition:"all 0.3s ease",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = `${accent}22`}
                      onMouseLeave={e => e.currentTarget.style.background = accentDim}
                    >
                      Send Another →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>

                    {/* Form header */}
                    <div style={{ marginBottom:"32px" }}>
                      <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.5rem", color:textPrimary, margin:0, letterSpacing:"-0.02em" }}>
                        Drop a Message
                      </h3>
                      <div style={{ height:"2px", width:"40px", background:`linear-gradient(90deg,${accent},transparent)`, borderRadius:"2px", marginTop:"10px" }} />
                    </div>

                    {/* Name + Email row */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                      <FloatingField
                        label="Name" name="name" type="text"
                        value={form.name} onChange={handleChange}
                        onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
                        focused={focused} placeholder="Arun Kumar"
                        accent={accent} accentDim={accentDim} accentBorder={accentBorder}
                        cardBg={cardBg} cardBorder={cardBorder} textPrimary={textPrimary} textSub={textSub}
                      />
                      <FloatingField
                        label="Email" name="email" type="email"
                        value={form.email} onChange={handleChange}
                        onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                        focused={focused} placeholder="you@example.com"
                        accent={accent} accentDim={accentDim} accentBorder={accentBorder}
                        cardBg={cardBg} cardBorder={cardBorder} textPrimary={textPrimary} textSub={textSub}
                      />
                    </div>

                    {/* Message */}
                    <FloatingField
                      label="Message" name="message" isTextarea
                      value={form.message} onChange={handleChange}
                      onFocus={() => setFocused("message")} onBlur={() => setFocused("")}
                      focused={focused} placeholder="Hi Arun, I'd love to connect about..."
                      accent={accent} accentDim={accentDim} accentBorder={accentBorder}
                      cardBg={cardBg} cardBorder={cardBorder} textPrimary={textPrimary} textSub={textSub}
                    />

                    {/* Character hint */}
                    <div style={{ textAlign:"right", marginTop:"-12px", marginBottom:"24px", fontFamily:"'DM Mono',monospace", fontSize:"0.6rem", color: form.message.length > 10 ? accent : textSub, opacity:0.7, letterSpacing:"0.05em", transition:"color 0.3s" }}>
                      {form.message.length} chars
                    </div>

                    {/* Submit */}
                    <button type="submit" className="send-btn" disabled={status === "sending"}>
                      {status === "sending" ? (
                        <>
                          <span style={{ display:"inline-block", animation:"spinOnce 0.7s linear infinite", fontSize:"1rem" }}>⟳</span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane size={14} />
                          Send Message
                        </>
                      )}
                    </button>

                    {/* Trust line */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginTop:"16px" }}>
                      <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#4ade80", animation:"dotPulse 2s ease-in-out infinite" }} />
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", color:textSub, letterSpacing:"0.08em" }}>
                        Typically replies within 24 hours
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}