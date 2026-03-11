"use client";
import gsap from "gsap";
import Image from "next/image";
import { hero } from "@public";
import { Navbar } from "@/components";
import { TextMask } from "@animation";
import { useLayoutEffect, useRef } from "react";

const HEADLINE_LINES = [
  [
    { text: "Building",    accent: false },
    { text: "Intelligent", accent: false },
  ],
  [
    { text: "Systems",  accent: true  },
    { text: "&",        accent: false },
    { text: "Web",      accent: false },
    { text: "Apps.",    accent: true  },
  ],
];

const TAGS = ["Frontend", "Backend", "Robotics", "UI / UX", "Security"];

const PHRASE_1 = [
  "Web developer & robotics enthusiast with experience in front-end and back-end development, UI/UX design, and API integration. Skilled in building and programming robotic systems using sensors, motors, and embedded controllers.",
];
const PHRASE_2 = [
  "Strong understanding of cybersecurity principles to create secure and reliable solutions across both software and robotics domains. Passionate about building intelligent systems, modern web applications, and secure technology solutions.",
];

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const imgZoneRef  = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const orbRef      = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const bodyTextRef = useRef<HTMLDivElement>(null);
  const metaRowRef  = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states explicitly so GSAP owns them
      gsap.set(".hero-rule",   { scaleX: 0, transformOrigin: "left center" });
      gsap.set("nav",          { yPercent: -110, opacity: 0 });
      gsap.set(".word-inner",  { yPercent: 115, rotate: 2, opacity: 0 });
      gsap.set(metaRowRef.current,  { opacity: 0, y: 16 });
      gsap.set(bodyTextRef.current, { opacity: 0, x: 28 });
      gsap.set(".hero-tag",    { opacity: 0, y: 14, scale: 0.92 });
      gsap.set(imgZoneRef.current,  { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(imgInnerRef.current, { scale: 1.08, filter: "brightness(0.65)" });
      gsap.set(scrollRef.current,   { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

      // Rule wipes
      tl.to(".hero-rule", {
        scaleX: 1, duration: 1.3, stagger: 0.15, ease: "expo.inOut",
      }, 0);

      // Nav
      tl.to("nav", {
        yPercent: 0, opacity: 1, duration: 1.0, ease: "power3.out",
      }, 0.1);

      // Headline words reveal
      tl.to(".word-inner", {
        yPercent: 0, rotate: 0, opacity: 1,
        duration: 1.0, stagger: 0.07, ease: "expo.out",
      }, 0.2);

      // Meta row
      tl.to(metaRowRef.current, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
      }, 0.45);

      // Image curtain lift
      tl.to(imgZoneRef.current, {
        clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut",
      }, 0.35);

      // Image inner scale + brighten
      tl.to(imgInnerRef.current, {
        scale: 1, filter: "brightness(1)", duration: 1.6, ease: "expo.inOut",
      }, 0.35);

      // Body text
      tl.to(bodyTextRef.current, {
        opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
      }, 0.65);

      // Tags
      tl.to(".hero-tag", {
        opacity: 1, y: 0, scale: 1,
        duration: 0.55, stagger: 0.07, ease: "back.out(1.7)",
      }, 0.8);

      // Scroll indicator
      tl.to(scrollRef.current, { opacity: 1, duration: 0.6 }, 1.25);

      // Scroll dot loop
      tl.to(".scroll-dot", {
        y: 32, repeat: -1, yoyo: true, duration: 1.1, ease: "sine.inOut",
      }, ">-0.1");

      // Mouse parallax
      const onMove = (e: MouseEvent) => {
        const dx = (e.clientX / window.innerWidth  - 0.5) * 50;
        const dy = (e.clientY / window.innerHeight - 0.5) * 35;
        gsap.to(orbRef.current,  { x: dx,        y: dy,        duration: 2,   ease: "power1.out", overwrite: "auto" });
        gsap.to(gridRef.current, { x: dx * 0.15, y: dy * 0.1, duration: 2.5, ease: "power1.out", overwrite: "auto" });
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#080808] text-[#f0ede6]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── RULE TOP ── */}
      <div className="hero-rule absolute top-[64px] left-0 w-full h-px bg-white/[0.08] z-10 pointer-events-none" />

      {/* ── NAV (your existing component) ── */}
      <Navbar />

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-col h-full pt-[64px] px-8 sm:px-4 pb-6 gap-0">

        {/* ── HEADER ROW ── */}
        <div className="flex items-start justify-between gap-10 sm:flex-col sm:gap-5 py-6 sm:py-4 border-b border-white/[0.07]">

          {/* LEFT — Headline */}
          <div className="flex-1 min-w-0">
            <h1
              className="font-black leading-[0.9] tracking-[-0.035em] uppercase"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(40px, 5.8vw, 82px)",
              }}
            >
              {HEADLINE_LINES.map((line, li) => (
                <div key={li} className="flex flex-wrap">
                  {line.map((w, wi) => (
                    <span
                      key={wi}
                      className="inline-block overflow-hidden mr-[0.22em] last:mr-0"
                      style={{ verticalAlign: "bottom" }}
                    >
                      <span
                        className="word-inner inline-block will-change-transform"
                        style={{ color: w.accent ? "#c8f060" : "inherit" }}
                      >
                        {w.text}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </h1>
          </div>

          {/* RIGHT — Meta + text + tags */}
          <div className="w-[380px] sm:w-full flex flex-col gap-[16px] pt-1 shrink-0">

            {/* Meta row */}
            <div
              ref={metaRowRef}
              className="flex items-center gap-[10px] text-[10px] tracking-[0.22em] uppercase text-white/30"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <span>Est. 2021</span>
              <span className="w-px h-[12px] bg-white/15 shrink-0" />
              <span>Portfolio</span>
              <span className="w-px h-[12px] bg-white/15 shrink-0" />
              <span>V 2.0</span>
            </div>

            {/* Body text */}
            <div ref={bodyTextRef} className="flex flex-col gap-[12px]">
              <div className="text-[13px] sm:text-[12px] leading-[1.75] text-white/55 tracking-[0.01em]">
                <TextMask>{PHRASE_1}</TextMask>
              </div>
              <div className="text-[13px] sm:text-[12px] leading-[1.75] text-white/40 tracking-[0.01em] sm:hidden">
                <TextMask>{PHRASE_2}</TextMask>
              </div>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-[7px]">
              {TAGS.map((t) => (
                <span
                  key={t}
                  className="hero-tag text-[10px] tracking-[0.14em] uppercase px-[13px] py-[6px] border border-white/10 rounded-full text-white/40 hover:border-[#c8f060]/50 hover:text-[#c8f060] transition-all duration-300 cursor-default select-none"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── IMAGE ZONE ── */}
        <div
          ref={imgZoneRef}
          className="relative flex-1 min-h-0 rounded-[8px] overflow-hidden mt-5"
        >
          {/* Image wrapper — GSAP targets this for scale/brightness */}
          <div
            ref={imgInnerRef}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src={hero}
              alt="Hero"
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Grid overlay — parallax layer */}
          <div
            ref={gridRef}
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(200,240,96,0.035) 1px,transparent 1px)," +
                "linear-gradient(90deg,rgba(200,240,96,0.035) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Glow orb — parallax layer */}
          <div
            ref={orbRef}
            className="absolute pointer-events-none"
            style={{
              width: 520, height: 520,
              borderRadius: "50%",
              top: "50%", left: "55%",
              transform: "translate(-50%,-50%)",
              background: "radial-gradient(circle, rgba(200,240,96,0.07) 0%, transparent 70%)",
            }}
          />

          {/* Bottom-to-top dark fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/75 via-transparent to-transparent pointer-events-none" />

          {/* Index label */}
          <div
            className="absolute top-5 right-6 text-[11px] tracking-[0.15em] text-white/25 pointer-events-none select-none"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            01 / HERO
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-6 py-5 sm:px-4 sm:py-4">
            <span
              className="text-[10px] tracking-[0.24em] uppercase text-white/40 select-none"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Based in — India
            </span>

            {/* Scroll indicator */}
            <div
              ref={scrollRef}
              className="flex flex-col items-center gap-2"
            >
              <span
                className="text-[9px] tracking-[0.28em] uppercase text-white/35 select-none"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                Scroll
              </span>
              <div className="relative w-px h-12 overflow-hidden rounded" style={{ background: "rgba(255,255,255,0.12)" }}>
                <div
                  className="scroll-dot absolute top-0 left-0 w-full h-4 rounded"
                  style={{ background: "linear-gradient(to bottom, transparent, #c8f060, transparent)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RULE BOTTOM ── */}
      <div className="hero-rule absolute bottom-0 left-0 w-full h-px bg-white/[0.07] pointer-events-none" />
    </section>
  );
}