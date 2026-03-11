"use client";

import { gsap } from "gsap";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";
import { servicesItem } from "@constants";
import React, { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function NoiseOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none z-10"
      style={{ mixBlendMode: "overlay" }}
    >
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

const accentColors = ["#FF4D00", "#00E5FF", "#B4FF00", "#FF0099", "#FFD600"];

// ── Detail panel that slides up when card is active ───────────────────────────
function DetailPanel({
  card,
  index,
  isActive,
  isExiting,
}: {
  card: any;
  index: number;
  isActive: boolean;
  isExiting: boolean;
}) {
  const accent = accentColors[index % accentColors.length];

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: isActive ? "all" : "none",
    transition: "opacity 0.5s ease",
    opacity: isActive ? 1 : 0,
  };

  const cardStyle: React.CSSProperties = {
    position: "relative",
    width: "min(92vw, 900px)",
    borderRadius: "24px",
    overflow: "hidden",
    background: "linear-gradient(145deg, #141414 0%, #0a0a0a 100%)",
    border: `1px solid ${accent}33`,
    boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 80px ${accent}22`,
    transform: isActive
      ? isExiting
        ? "translateY(-6%) scale(0.96)"
        : "translateY(0%) scale(1)"
      : "translateY(8%) scale(0.96)",
    transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease",
    opacity: isActive ? 1 : 0,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  };

  return (
    <div style={panelStyle}>
      {/* Backdrop blur */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(12px)",
          zIndex: -1,
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />

      <div style={cardStyle}>
        {/* Left — image */}
        <div style={{ position: "relative", height: "520px", overflow: "hidden" }}>
          <Image
            src={card.img}
            alt={card.title}
            fill
            className="object-cover"
            style={{
              transform: isActive ? "scale(1)" : "scale(1.06)",
              transition: "transform 0.8s ease",
            }}
          />
          {/* Gradient over image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${accent}22 0%, transparent 60%, #0a0a0a 100%)`,
            }}
          />
          {/* Index badge */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: accent,
              color: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "13px",
              fontFamily: "monospace",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Right — content */}
        <div
          style={{
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          {/* Top */}
          <div>
            {/* Accent bar */}
            <div
              style={{
                width: "40px",
                height: "3px",
                background: accent,
                marginBottom: "20px",
                borderRadius: "2px",
              }}
            />
            <p
              style={{
                color: accent,
                fontFamily: "monospace",
                fontSize: "11px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Service {String(index + 1).padStart(2, "0")} / {String(servicesItem.length).padStart(2, "0")}
            </p>
            <h2
              style={{
                color: "#fff",
                fontSize: "clamp(28px, 3vw, 42px)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              {card.title}
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "15px",
                lineHeight: 1.7,
                marginBottom: "28px",
              }}
            >
              {card.description}
            </p>

            {/* Feature bullets — generated from description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(card.features ?? [
                "End-to-end delivery",
                "Custom solutions",
                "Ongoing support",
              ]).map((feat: string, fi: number) => (
                <div
                  key={fi}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateX(0)" : "translateX(-10px)",
                    transition: `opacity 0.4s ease ${0.2 + fi * 0.08}s, transform 0.4s ease ${0.2 + fi * 0.08}s`,
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "1px",
                      background: accent,
                      transform: "rotate(45deg)",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px" }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — scroll hint */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: "11px",
                fontFamily: "monospace",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Scroll to continue
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {servicesItem.map((_, di) => (
                <div
                  key={di}
                  style={{
                    width: di === index ? "20px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: di === index ? accent : "rgba(255,255,255,0.15)",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Floating mini card (visible before panel opens) ───────────────────────────
function FloatingCard({
  card,
  index,
  cardRef,
}: {
  card: any;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const accent = accentColors[index % accentColors.length];

  return (
    <div
      ref={cardRef}
      className="absolute will-change-transform"
      style={{ left: "100%", top: "50%", width: "220px", zIndex: 20 + index }}
    >
      <div
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          background: "linear-gradient(145deg,#1a1a1a,#0d0d0d)",
          border: `1px solid ${accent}44`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${accent}22`,
        }}
      >
        <div style={{ position: "relative", height: "130px", overflow: "hidden" }}>
          <Image src={card.img} alt={card.title} fill className="object-cover" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 40%,#0d0d0d)" }} />
          <div
            style={{
              position: "absolute", top: 10, right: 10,
              background: accent, color: "#000",
              borderRadius: "50%", width: 28, height: 28,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "10px", fontWeight: 900, fontFamily: "monospace",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>
        <div style={{ padding: "14px 16px 16px" }}>
          <div style={{ width: 24, height: 2, background: accent, borderRadius: 1, marginBottom: 8 }} />
          <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {card.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Services() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const stickySectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [exitingIndex, setExitingIndex] = useState<number>(-1);
  const [progress, setProgress] = useState(0);

  const stickyHeight =
    typeof window !== "undefined" ? window.innerHeight * (servicesItem.length + 1) : 5000;

  const getCardTransform = (index: number, p: number) => {
    // Each card occupies a slice of scroll progress
    const sliceSize = 1 / (servicesItem.length + 1);
    const cardStart = index * sliceSize * 0.4;
    const cp = Math.max(0, Math.min((p - cardStart) * 3, 1));
    if (cp <= 0) return { x: 60, y: 0, rot: 8 - index * 3, opacity: 0 };

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const ec = ease(Math.min(cp, 0.5) * 2);

    const x = gsap.utils.interpolate(60, 18 - index * 5, ec);
    const y = gsap.utils.interpolate(30, -8 + index * 4, ec);
    const rot = gsap.utils.interpolate(8 - index * 3, -2 + index * 1.5, ec);

    return { x, y, rot, opacity: Math.min(cp * 4, 1) };
  };

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const sliceSize = 1 / (servicesItem.length + 1);

    ScrollTrigger.create({
      trigger: stickySectionRef.current,
      start: "top top",
      end: `+=${stickyHeight}px`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);

        // Determine which card panel should be active
        const rawIndex = Math.floor(p / sliceSize) - 1;
        const withinSlice = (p % sliceSize) / sliceSize;

        // Show panel for the first 80% of each slice, hide for the last 20%
        const shouldShow = withinSlice < 0.82;
        const targetIndex = rawIndex >= 0 && rawIndex < servicesItem.length && shouldShow
          ? rawIndex
          : -1;

        setActiveIndex((prev) => {
          if (prev !== targetIndex) {
            if (prev >= 0) setExitingIndex(prev);
            setTimeout(() => setExitingIndex(-1), 400);
          }
          return targetIndex;
        });

        // Animate floating mini-cards
        cardsRef.current.forEach((card, index) => {
          if (!card) return;
          const { x, y, rot, opacity } = getCardTransform(index, p);
          gsap.set(card, {
            xPercent: x,
            yPercent: y,
            rotation: rot,
            opacity,
          });
        });
      },
    });

    return () => {
      ScrollTrigger.killAll();
      lenis.destroy();
    };
  }, []);

  return (
    <div
      id="services"
      ref={stickySectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#080808" }}
    >
      <NoiseOverlay />

      {/* Detail panels — one per service */}
      {servicesItem.map((card, i) => (
        <DetailPanel
          key={card.id}
          card={card}
          index={i}
          isActive={activeIndex === i}
          isExiting={exitingIndex === i}
        />
      ))}

      {/* Radial spotlight */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Ghost counter */}
      <div
        className="absolute bottom-8 right-8 font-black leading-none select-none pointer-events-none z-0"
        style={{
          color: "rgba(255,255,255,0.025)",
          fontSize: "22vw",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(Math.max(activeIndex + 1, 1)).padStart(2, "0")}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-30">
        <div
          className="h-full bg-white/40 origin-left"
          style={{ transform: `scaleX(${progress})`, transition: "transform 0.1s linear" }}
        />
      </div>

      {/* Section title */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center">
          <p className="text-white/20 font-mono text-[11px] uppercase tracking-[0.4em] mb-4">
            What I Do
          </p>
          <h1
            className="font-black uppercase leading-[0.9] tracking-tight text-white"
            style={{ fontSize: "clamp(52px, 8vw, 110px)" }}
          >
            Services
            <br />
            <span
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.3)",
                color: "transparent",
              }}
            >
              I Provide
            </span>
          </h1>
        </div>
      </div>

      {/* Floating mini-cards */}
      {servicesItem.map((card, index) => (
        <FloatingCard
          key={card.id}
          card={card}
          index={index}
          cardRef={(el) => (cardsRef.current[index] = el)}
        />
      ))}
    </div>
  );
}