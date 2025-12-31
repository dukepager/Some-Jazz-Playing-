"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  ExternalLink,
  List,
  Calendar,
} from "lucide-react";

/**
 * Some Jazz Playing — Freeform (self-discovery) homepage
 * - Desktop: scattered/overlapping “tabletop” video cards
 * - Mobile: clean simple stack
 * - Background radio (muted by default)
 * - Monthly archive (Index)
 *
 * You only need YouTube IDs (NOT the full <iframe> embed code).
 */

// Swap these
const STREAM_URL = "https://icecast.radiofrance.fr/fip-hifi.aac"; // your live radio stream URL
const TIKTOK_URL = "https://www.tiktok.com/@somejazzplaying"; // your TikTok
const LIVESTREAM_NOTE = "Live stream: every other Sunday · 3–5 PM"; // edit anytime

// Add new videos monthly (YYYY-MM)
const VIDEOS = [
  { id: "J4VWEwUp7qU", title: "Live Session", month: "2025-12" },
  { id: "eAzClkn3zYw", title: "Interview", month: "2025-12" },
  { id: "ehYM_cg2DHI", title: "Performance", month: "2025-12" },
];

const AccentWord = ({ children }) => (
  <span className="inline-block bg-gradient-to-r from-red-500 via-blue-500 to-yellow-400 bg-clip-text text-transparent">
    {children}
  </span>
);

function monthLabel(ym) {
  const [y, m] = ym.split("-").map((n) => Number(n));
  const d = new Date(y, (m || 1) - 1, 1);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function useAudio(streamUrl) {
  const audioRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true); // muted by default
  const [volume, setVolume] = useState(0.65);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onCanPlay = () => setReady(true);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    a.addEventListener("canplay", onCanPlay);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);

    return () => {
      a.removeEventListener("canplay", onCanPlay);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) await a.play();
      else a.pause();
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  };

  return { audioRef, ready, playing, muted, volume, setMuted, setVolume, toggle };
}

function YouTubeEmbed({ id, title }) {
  return (
    <div className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_16px_60px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* reveal title on hover (desktop), show by default on mobile */}
      <div className="pointer-events-none p-4 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="mt-1 text-xs text-white/55">YouTube</div>
      </div>
    </div>
  );
}

function FreeformGallery({ videos, mode, months, activeMonth, setActiveMonth }) {
  const positions = [
    { left: "6%", top: "4%", w: "52%", r: "-6deg" },
    { left: "54%", top: "10%", w: "40%", r: "5deg" },
    { left: "10%", top: "44%", w: "42%", r: "3deg" },
    { left: "50%", top: "52%", w: "46%", r: "-4deg" },
    { left: "22%", top: "72%", w: "46%", r: "6deg" },
    { left: "6%", top: "64%", w: "36%", r: "-8deg" },
    { left: "62%", top: "70%", w: "32%", r: "2deg" },
  ];

  return (
    <div>
      {mode === "archive" ? (
        <div className="mb-5 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/60">Index</div>
            <div className="mt-1 text-sm font-semibold">Monthly archive</div>
            <div className="mt-1 text-xs text-white/60">Pick a month, then explore the wall.</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-white/60">Month</div>
            <select
              value={activeMonth}
              onChange={(e) => setActiveMonth(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {/* Mobile */}
      <div className="grid gap-6 md:hidden">
        {videos.map((v) => (
          <YouTubeEmbed key={v.id} id={v.id} title={v.title} />
        ))}
      </div>

      {/* Desktop freeform */}
      <div className="relative hidden min-h-[980px] md:block">
        <div className="absolute inset-0">
          <div
            className="absolute left-[8%] top-[18%] h-[560px] w-[78%] rounded-[42px] border border-white/10 bg-white/5 backdrop-blur"
            style={{ transform: "rotate(-8deg)" }}
          />
          <div
            className="absolute left-[18%] top-[10%] h-[620px] w-[72%] rounded-[42px] border border-white/10 bg-white/5 backdrop-blur"
            style={{ transform: "rotate(6deg)" }}
          />
          <div
            className="absolute left-[10%] top-[34%] h-[620px] w-[80%] rounded-[42px] border border-white/10 bg-white/5 backdrop-blur"
            style={{ transform: "rotate(-2deg)" }}
          />
        </div>

        {videos.map((v, i) => {
          const p = positions[i % positions.length];
          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.35) }}
              className="absolute"
              style={{ left: p.left, top: p.top, width: p.w, transform: `rotate(${p.r})` }}
            >
              <div className="rounded-[36px] border border-white/10 bg-black/35 p-3 shadow-[0_22px_90px_rgba(0,0,0,0.65)] backdrop-blur">
                <YouTubeEmbed id={v.id} title={v.title} />
              </div>
            </motion.div>
          );
        })}

        <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-[11px] text-white/60">
          hover videos to reveal titles
        </div>
      </div>
    </div>
  );
}

function FreeformStack({ featured }) {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0">
        <div
          className="absolute left-6 top-10 h-[300px] w-[86%] rounded-[28px] border border-white/10 bg-white/5 backdrop-blur"
          style={{ transform: "rotate(-7deg)" }}
        />
        <div
          className="absolute right-4 top-8 h-[320px] w-[90%] rounded-[28px] border border-white/10 bg-white/5 backdrop-blur"
          style={{ transform: "rotate(5deg)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute left-6 top-16 w-[92%] overflow-hidden rounded-[28px] border border-white/10 bg-black/40 shadow-[0_22px_80px_rgba(0,0,0,0.6)] backdrop-blur"
        style={{ transform: "rotate(-1deg)" }}
      >
        <div className="p-5">
          <div className="text-xs uppercase tracking-widest text-white/60">Featured</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-xs font-bold tracking-widest">
              SJP
            </span>
            <div>
              <div className="text-sm font-semibold">{featured?.title || "Add videos to feature"}</div>
              <div className="text-xs text-white/55">{featured?.month ? monthLabel(featured.month) : ""}</div>
            </div>
          </div>
        </div>

        {featured?.id ? (
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${featured.id}`}
              title={featured.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}

export default function Page() {
  const audio = useAudio(STREAM_URL);

  const months = useMemo(() => {
    const unique = Array.from(new Set(VIDEOS.map((v) => v.month)));
    unique.sort((a, b) => (a > b ? -1 : 1));
    return unique;
  }, []);

  const [view, setView] = useState("latest"); // latest | archive
  const [activeMonth, setActiveMonth] = useState(months[0] || "");

  const latest = useMemo(() => {
    const sorted = [...VIDEOS].sort((a, b) => (a.month > b.month ? -1 : a.month < b.month ? 1 : 0));
    return sorted.slice(0, 6);
  }, []);

  const archive = useMemo(() => {
    const sorted = [...VIDEOS].sort((a, b) => (a.month > b.month ? -1 : a.month < b.month ? 1 : 0));
    return sorted.filter((v) => (activeMonth ? v.month === activeMonth : true));
  }, [activeMonth]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.9))]" />
      </div>

      <audio ref={audio.audioRef} src={STREAM_URL} preload="none" />

      {/* Minimal header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-2xl bg-white/10" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 to-white/0" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="text-xs font-bold tracking-widest">SJP</span>
              </div>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">
                Some <AccentWord>Jazz</AccentWord> Playing
              </div>
              <div className="text-xs text-white/55">somejazzplaying</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView(view === "archive" ? "latest" : "archive")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
              title="Open index"
            >
              <List className="h-4 w-4" /> {view === "archive" ? "Close index" : "Index"}
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75 hover:bg-white/10"
              >
                TikTok <ExternalLink className="h-4 w-4" />
              </a>

              <div
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70"
                title="Bi-weekly Sundays"
              >
                <Calendar className="h-4 w-4 opacity-80" />
                <span className="hidden lg:inline">{LIVESTREAM_NOTE}</span>
                <span className="lg:hidden">Live (bi-weekly)</span>
              </div>
            </div>

            <div className="ml-1 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1">
              <div className="hidden md:inline-flex items-center gap-2 pl-2 text-xs text-white/70">
                <Radio className="h-4 w-4" />
              </div>
              <button
                onClick={() => audio.toggle()}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/85 hover:bg-black/45"
              >
                {audio.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="hidden sm:inline">{audio.playing ? "Pause" : "Play"}</span>
              </button>
              <button
                onClick={() => audio.setMuted((m) => !m)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/30 p-2 text-white/85 hover:bg-black/45"
                title={audio.muted ? "Unmute" : "Mute"}
              >
                {audio.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="text-[11px] text-white/55">Radio volume</div>
            <input
              aria-label="volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={audio.volume}
              onChange={(e) => audio.setVolume(Number(e.target.value))}
              className="w-40 accent-white/70"
            />
            <div className="text-[11px] text-white/55">{audio.ready ? "Stream ready" : "Tap play"}</div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-4 pt-10 pb-8">
          <div className="grid gap-8 md:grid-cols-[1fr,1fr]">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl"
              >
                Some <AccentWord>Jazz</AccentWord> Playing
              </motion.h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                A quiet place for listening, watching, and digging — updated monthly.
              </p>
            </div>

            <div className="relative h-[380px]">
              <FreeformStack featured={latest[0]} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <FreeformGallery
            videos={view === "archive" ? archive : latest}
            mode={view}
            months={months}
            activeMonth={activeMonth}
            setActiveMonth={setActiveMonth}
          />
        </section>
      </main>
    </div>
  );
}
