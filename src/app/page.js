"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * Some Jazz Playing — MINI ZINE LANDING
 *
 * What you asked for:
 * - Black background
 * - Photos feel like magazine pages/spreads (paper, margins, print vibe)
 * - Photos auto-change (self-discovery)
 * - Simple “Enter” text (not a button)
 * - “store will be back soon” small text under
 *
 * Setup:
 * Put images in /public/zine/ (Next.js) or serve them at /zine/... (any host)
 */

const IMAGES = [
  { src: "/zine/npr.brightspotcdn.png", alt: "Jazz" },
  { src: "/zine/Mo-Better-Blues-h.jpg", alt: "Jazz" },
  { src: "/zine/Lee_Mo_Better_Blues_01.jpg.avif", alt: "Jazz" },
  { src: "/zine/AP070223014369.jpg", alt: "Jazz" },
  { src: "/zine/Ella_Fitzgerald_6_(cropped).jpg", alt: "Jazz" },
  { src: "/zine/alice-coltrane-eshot.jpg", alt: "Jazz" },
  { src: "/zine/aef6b5f322f5a251c74d29157f3da543.jpg", alt: "Jazz" },
  { src: "/zine/Stewart_Dolphy_1440.jpg", alt: "Jazz" },
  { src: "/zine/john-coletrane-newport-jazz.jpg", alt: "Jazz" },
  { src: "/zine/Miles-Davis-in-1989-006.avif", alt: "Jazz" },
];

function safeImg(item) {
  if (!item || typeof item.src !== "string" || item.src.trim() === "") return null;
  return { src: item.src, alt: item.alt || "Some Jazz Playing" };
}

function MagazineFrame({ children, rotate = 0, className = "" }) {
  return (
    <div
      className={
        "absolute select-none overflow-hidden rounded-[32px] bg-transparent shadow-[0_22px_90px_rgba(0,0,0,0.7)] " +
        className
      }
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {/* full-bleed image only — no borders, no paper */}
      <div className="relative h-full w-full overflow-hidden rounded-[32px]">
        {children}
      </div>
    </div>
  );
}

function AutoPhoto({ images, index, altFallback }) {
  // Cross-fade: render previous + current
  const safe = images[index % images.length];
  const [shown, setShown] = useState(safe?.src);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const next = safe?.src;
    if (!next) return;
    setFadeIn(false);
    const t1 = setTimeout(() => {
      setShown(next);
      setFadeIn(true);
    }, 160);
    return () => clearTimeout(t1);
  }, [safe?.src]);

  return (
    <div className="relative h-full w-full">
      {/* image */}
      <img
        key={shown}
        src={shown}
        alt={safe?.alt || altFallback}
        className={
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 " +
          (fadeIn ? "opacity-100" : "opacity-0")
        }
        draggable={false}
      />
      {/* subtle print grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-multiply bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.35),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(0,0,0,0.28),transparent_45%)]" />
    </div>
  );
}

function ZineCollage({ images }) {
  // Global tick that advances images
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setTick((t) => t + 1), 3600);
    return () => clearInterval(id);
  }, [images.length]);

  const idx = (offset) => (tick + offset) % Math.max(images.length, 1);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen magazine spreads */}
      <MagazineFrame rotate={-4} className="left-[-5%] top-[-5%] h-[70%] w-[60%]">
        <AutoPhoto images={images} index={idx(0)} altFallback="Some Jazz Playing" />
      </MagazineFrame>

      <MagazineFrame rotate={6} className="right-[-6%] top-[4%] h-[80%] w-[45%]">
        <AutoPhoto images={images} index={idx(2)} altFallback="Some Jazz Playing" />
      </MagazineFrame>

      <MagazineFrame rotate={2} className="left-[10%] bottom-[-8%] h-[40%] w-[55%]">
        <AutoPhoto images={images} index={idx(4)} altFallback="Some Jazz Playing" />
      </MagazineFrame>
    </div>
  );
}

export default function Page() {
  const images = useMemo(() => IMAGES.map(safeImg).filter(Boolean), []);
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* vignette */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.92))]" />
      </div>

      <main className="relative w-screen h-screen px-0 py-0">
        {hasImages ? (
          <ZineCollage images={images} />
        ) : (
          <div className="relative h-screen w-screen bg-black" />
        )}

        {/* Centered text only */}
        <div className="pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-[clamp(3rem,10vw,8rem)] font-semibold tracking-tight leading-none">
            SOME JAZZ PLAYING
          </h1>

          <a
            href="/home"
            className="mt-6 text-lg uppercase tracking-widest underline decoration-white/30 underline-offset-8 hover:decoration-white/70"
          >
            Enter
          </a>
        </div>

        <footer className="mt-10 flex items-center justify-between text-xs text-white/45">
          <span>© {new Date().getFullYear()} Some Jazz Playing</span>
          <span className="hidden sm:inline">mini zine landing</span>
        </footer>
      </main>
    </div>
  );
}
