import React, { useEffect, useState } from "react";

export default function Preloader() {
  const [text, setText] = useState("");
  const fullText = "ARUN • PORTFOLIO📈";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, i + 1));
      i++;
      if (i === fullText.length) {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 1000);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  return (
    <div
      className="vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-center text-white position-fixed top-0 start-0 w-100"
      style={{ zIndex: 9999 }}
    >
      <h1 className="typewriter-text">{text}<span className="cursor">|</span></h1>
      <p className="text-secondary">Building dreams in code... 💻</p>

      <style>{`
        .typewriter-text {
          font-family: "Courier New", monospace;
          font-size: 2rem;
          color: #00d8ff;
          text-shadow: 0 0 15px rgba(0, 216, 255, 0.8);
        }

        .cursor {
          animation: blink 0.7s infinite;
          color: #00d8ff;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
