"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Some Jazz Playing — MINI ZINE LANDING (full-bleed, borderless)
 * + Background music/radio
 *
 * Note on autoplay with sound:
 * Most browsers block autoplay WITH audio until the user interacts.
 * This page will *try* to autoplay unmuted; if blocked, it shows a tiny “Sound on” prompt.
 */

// 1) Put images in /public/zine/ (Next.js) or serve them at /zine/... (any host)
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

// 2) Background audio
// Use an mp3 you host (recommended) OR a stream URL.
// Example: const STREAM_URL = "/audio/sjp-radio.mp3"; (put file in /public/audio/)
const STREAM_URL = "https://icecast.radiofrance.fr/fip-hifi.aac";

function safeImg(item) {
  if (!item || typeof item.src !== "string" || item.src.trim() === "") return null;
  return { src: item.src, alt: item.alt || "Some Jazz Playing" };
}

function useAutoplayAudio(src) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [volume, setVolume] = useState(0.75);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
  }, [volume]);

  // Try to autoplay (unmuted)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.muted = false;
    a.volume = volume;

    const tryPlay = async () => {
      try {
        await a.play();
        setPlaying(true);
        setNeedsTap(false);
      } catch {
        // Autoplay blocked until user gesture
        setPlaying(false);
        setNeedsTap(true);
      }
    };

    // small delay helps some environments
    const t = setTimeout(tryPlay, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) {
        a.muted = false;
        await a.play();
        setPlaying(true);
        setNeedsTap(false);
      } else {
        a.pause();
        setPlaying(false);
      }
    } catch {
      setNeedsTap(true);
    }
  };

  return { audioRef, playing, needsTap, volume, setVolume, toggle };
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
      <div className="relative h-full w-full overflow-hidden rounded-[32px]">{children}</div>
    </div>
  );
}

function AutoPhoto({ images, index, altFallback }) {
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
      <div className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-multiply bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.35),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(0,0,0,0.28),transparent_45%)]" />
    </div>
  );
}

function ZineCollage({ images }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setTick((t) => t + 1), 3600);
    return () => clearInterval(id);
  }, [images.length]);

  const idx = (offset) => (tick + offset) % Math.max(images.length, 1);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MagazineFrame rotate={-4} className="left-[-8%] top-[-10%] h-[76%] w-[66%]">
        <AutoPhoto images={images} index={idx(0)} altFallback="Some Jazz Playing" />
      </MagazineFrame>

      <MagazineFrame rotate={6} className="right-[-10%] top-[2%] h-[86%] w-[52%]">
        <AutoPhoto images={images} index={idx(2)} altFallback="Some Jazz Playing" />
      </MagazineFrame>

      <MagazineFrame rotate={2} className="left-[6%] bottom-[-14%] h-[50%] w-[70%]">
        <AutoPhoto images={images} index={idx(4)} altFallback="Some Jazz Playing" />
      </MagazineFrame>

      {/* soft vignette on top of images */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(0,0,0,0.20),rgba(0,0,0,0.85))]" />
    </div>
  );
}

export default function Page() {
  const images = useMemo(() => IMAGES.map(safeImg).filter(Boolean), []);
  const hasImages = images.length > 0;

  const audio = useAutoplayAudio(STREAM_URL);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* audio element */}
      <audio ref={audio.audioRef} src={STREAM_URL} preload="none" loop />

      <main className="relative w-screen h-screen">
        {hasImages ? <ZineCollage images={images} /> : <div className="h-screen w-screen bg-black" />}

        {/* Centered text only */}
        <div className="pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
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

        {/* Minimal audio control (only shows if autoplay is blocked OR user wants control) */}
        <div className="pointer-events-auto absolute bottom-5 right-5 z-20">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-2 text-xs text-white/80 backdrop-blur">
            {audio.needsTap ? (
              <button
                onClick={audio.toggle}
                className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/15"
                title="Enable audio"
              >
                Sound on
              </button>
            ) : (
              <button
                onClick={audio.toggle}
                className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/15"
                title={audio.playing ? "Pause" : "Play"}
              >
                {audio.playing ? "Pause" : "Play"}
              </button>
            )}

            <input
              aria-label="volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={audio.volume}
              onChange={(e) => audio.setVolume(Number(e.target.value))}
              className="w-24 accent-white/70"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
