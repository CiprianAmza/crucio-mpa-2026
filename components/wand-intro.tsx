"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "crucio.intro.seen.v1";

const PARTICLES = Array.from({ length: 24 }).map((_, i) => {
  const angle = (i / 24) * Math.PI * 2;
  const dist = 180 + Math.random() * 120;
  return {
    id: i,
    dx: `${Math.cos(angle) * dist}px`,
    dy: `${Math.sin(angle) * dist}px`,
    size: 4 + Math.random() * 6,
    delay: Math.random() * 0.2,
    hue: 130 + Math.random() * 30,
  };
});

export function WandIntro() {
  const [show, show_set] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    // Hydration-safe: server renders nothing, client decides on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    show_set(true);
    const t = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, "1");
      show_set(false);
    }, 3600);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto cursor-pointer animate-spell-overlay-fade"
      onClick={() => {
        window.localStorage.setItem(STORAGE_KEY, "1");
        show_set(false);
      }}
      aria-label="Skip intro"
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      <div
        className="absolute inset-0 pointer-events-none animate-spell-flash"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.55) 0%, rgba(34,197,94,0.15) 30%, transparent 60%)",
        }}
      />

      <div className="absolute inset-0 grid place-items-center">
        <div className="relative w-0 h-0">
          <div className="absolute -translate-x-1/2 -translate-y-1/2 animate-spell-burst">
            <div
              className="w-40 h-40 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(74,222,128,0.95) 0%, rgba(34,197,94,0.5) 40%, transparent 70%)",
                boxShadow:
                  "0 0 80px 20px rgba(34,197,94,0.6), 0 0 160px 40px rgba(34,197,94,0.3)",
              }}
            />
          </div>

          {PARTICLES.map((p) => (
            <span
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-spell-particle"
              style={
                {
                  width: p.size,
                  height: p.size,
                  background: `hsl(${p.hue} 90% 60%)`,
                  boxShadow: `0 0 ${p.size * 2}px hsl(${p.hue} 90% 55%)`,
                  ["--dx" as string]: p.dx,
                  ["--dy" as string]: p.dy,
                  animationDelay: `${p.delay + 0.55}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="animate-wand-swing origin-center">
          <Wand />
        </div>
      </div>

      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="text-center px-4 animate-spell-text">
          <div
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
            style={{
              color: "#86efac",
              textShadow:
                "0 0 24px rgba(34,197,94,0.9), 0 0 48px rgba(34,197,94,0.55), 0 4px 0 rgba(0,0,0,0.4)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              letterSpacing: "-0.02em",
            }}
          >
            Crucify the interview!
          </div>
          <div className="mt-3 text-emerald-200/70 text-sm tracking-widest uppercase">
            click anywhere to skip
          </div>
        </div>
      </div>
    </div>
  );
}

function Wand() {
  return (
    <svg
      width="220"
      height="60"
      viewBox="0 0 220 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wand-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a2418" />
          <stop offset="0.5" stopColor="#7a4a2a" />
          <stop offset="1" stopColor="#1a0d06" />
        </linearGradient>
        <radialGradient id="wand-tip" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.3" stopColor="#bbf7d0" />
          <stop offset="1" stopColor="#16a34a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M 12 30 Q 8 26 12 22 L 200 28 Q 206 30 200 32 L 12 38 Q 8 34 12 30 Z"
        fill="url(#wand-grad)"
        stroke="#0a0604"
        strokeWidth="0.5"
      />
      <circle cx="20" cy="30" r="6" fill="#7a4a2a" stroke="#0a0604" strokeWidth="0.5" />
      <circle cx="20" cy="30" r="2.5" fill="#3a2418" />
      <circle cx="200" cy="30" r="22" fill="url(#wand-tip)" />
      <circle cx="200" cy="30" r="3" fill="#ecfccb" />
    </svg>
  );
}
