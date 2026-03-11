"use client";

import Link from "next/link";
import { TnavProps } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { footerLinks, links } from "@/constants";
import { useEffect, useRef, useState } from "react";

// ── Glitch text hook ──────────────────────────────────────────────────────────
const GLITCH_CHARS = "█▓▒░@#$%&?!X";

function useGlitchText(original: string, active: boolean) {
  const [text, setText] = useState(original);
  const frameRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!active) {
      setText(original);
      return;
    }
    let iter = 0;
    const total = original.length * 3;
    const run = () => {
      setText(
        original
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iter / 3) return char;
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );
      iter++;
      if (iter <= total) frameRef.current = setTimeout(run, 28);
      else setText(original);
    };
    run();
    return () => { if (frameRef.current) clearTimeout(frameRef.current); };
  }, [active, original]);

  return text;
}

// ── Single nav link with glitch ───────────────────────────────────────────────
function GlitchNavLink({
  title,
  href,
  index,
  isActive,
  onClick,
}: {
  title: string;
  href: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [glitchShift, setGlitchShift] = useState(false);
  const glitchedText = useGlitchText(title, hovered);

  // Periodic random glitch shift on active link
  useEffect(() => {
    if (!isActive) return;
    const iv = setInterval(() => {
      setGlitchShift(true);
      setTimeout(() => setGlitchShift(false), 120);
    }, 3500 + index * 700);
    return () => clearInterval(iv);
  }, [isActive, index]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -60, filter: "blur(12px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -40, filter: "blur(8px)" }}
      transition={{
        delay: index * 0.07,
        duration: 0.55,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`#${href}`}
        onClick={onClick}
        className="relative block py-1 select-none"
        style={{ textDecoration: "none" }}
      >
        {/* Main text */}
        <span
          className="relative block font-black uppercase leading-none tracking-tight transition-colors duration-200"
          style={{
            fontSize: "clamp(36px, 5vw, 52px)",
            color: hovered ? "#fff" : isActive ? "#fff" : "rgba(255,255,255,0.75)",
            textShadow: glitchShift
              ? "3px 0 #ff003c, -3px 0 #00eaff"
              : hovered
              ? "2px 0 #ff003c, -2px 0 #00eaff"
              : "none",
            transform: glitchShift ? `translateX(${Math.random() > 0.5 ? 3 : -3}px)` : "none",
            transition: glitchShift ? "none" : "color 0.2s, text-shadow 0.2s",
          }}
        >
          {glitchedText}
        </span>

        {/* Ghost layer 1 — red offset */}
        <span
          aria-hidden
          className="absolute inset-0 block font-black uppercase leading-none tracking-tight py-1 pointer-events-none"
          style={{
            fontSize: "clamp(36px, 5vw, 52px)",
            color: "#ff003c",
            opacity: hovered ? 0.35 : 0,
            transform: "translate(4px, -2px)",
            transition: "opacity 0.15s",
            mixBlendMode: "screen",
          }}
        >
          {title}
        </span>

        {/* Ghost layer 2 — cyan offset */}
        <span
          aria-hidden
          className="absolute inset-0 block font-black uppercase leading-none tracking-tight py-1 pointer-events-none"
          style={{
            fontSize: "clamp(36px, 5vw, 52px)",
            color: "#00eaff",
            opacity: hovered ? 0.35 : 0,
            transform: "translate(-4px, 2px)",
            transition: "opacity 0.15s",
            mixBlendMode: "screen",
          }}
        >
          {title}
        </span>

        {/* Underline sweep */}
        <span
          className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left"
          style={{
            background: "linear-gradient(90deg, #ff003c, #00eaff)",
            transform: hovered ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />

        {/* Index number */}
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[11px] tracking-widest"
          style={{
            color: hovered ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)",
            transition: "color 0.2s",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </Link>

      {/* Scanline flash on hover */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: hovered
            ? "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.015) 3px,rgba(255,255,255,0.015) 4px)"
            : "none",
        }}
      />
    </motion.div>
  );
}

// ── Footer social link ────────────────────────────────────────────────────────
function FooterLink({
  title,
  href,
  index,
}: {
  title: string;
  href: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.35 + index * 0.06, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="w-[50%] mt-[6px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={href}
        className="relative inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest"
        style={{
          color: hovered ? "#fff" : "rgba(255,255,255,0.3)",
          textShadow: hovered ? "1px 0 #ff003c, -1px 0 #00eaff" : "none",
          transition: "color 0.2s, text-shadow 0.2s",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 4,
            height: 4,
            borderRadius: 1,
            background: hovered ? "#00eaff" : "rgba(255,255,255,0.2)",
            transform: "rotate(45deg)",
            transition: "background 0.2s",
            flexShrink: 0,
          }}
        />
        {title}
      </Link>
    </motion.div>
  );
}

// ── Background: animated glitch grid ─────────────────────────────────────────
function GlitchGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const draw = (t: number) => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const CELL = 52;
      const cols = Math.ceil(canvas.width / CELL) + 1;
      const rows = Math.ceil(canvas.height / CELL) + 1;
      const time = t * 0.0007;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL;
          const y = r * CELL;
          const wave = Math.sin(time + c * 0.5) * Math.cos(time * 0.6 + r * 0.4);
          const alpha = ((wave + 1) / 2) * 0.12;

          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fill();

          // Glowing nodes
          if ((c * 3 + r * 7) % 11 === 0) {
            const pulse = (Math.sin(time * 2.5 + c + r) + 1) / 2;
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,234,255,${pulse * 0.2})`;
            ctx.fill();
          }
        }
      }

      // Horizontal scan line
      const scanY = (time * 60) % canvas.height;
      const g = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      g.addColorStop(0, "rgba(0,234,255,0)");
      g.addColorStop(0.5, "rgba(0,234,255,0.07)");
      g.addColorStop(1, "rgba(0,234,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, scanY - 30, canvas.width, 60);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ── Main Nav ──────────────────────────────────────────────────────────────────
export default function Nav({ toggleMenu }: TnavProps) {
  const pathname = usePathname();
  const [randomGlitch, setRandomGlitch] = useState<number | null>(null);

  // Random glitch burst across a random link every few seconds
  useEffect(() => {
    const iv = setInterval(() => {
      const i = Math.floor(Math.random() * links.length);
      setRandomGlitch(i);
      setTimeout(() => setRandomGlitch(null), 600);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      className="relative flex flex-col justify-between h-full overflow-hidden"
      style={{
        padding: "72px 72px 40px 40px",
        background: "linear-gradient(135deg, #0a0a0a 0%, #111 100%)",
      }}
    >
      {/* Animated grid bg */}
      <GlitchGrid />

      {/* Noise overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none z-10" style={{ mixBlendMode: "overlay" }}>
        <filter id="nav-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#nav-noise)" />
      </svg>

      {/* Left accent bar */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="absolute left-0 top-[10%] bottom-[10%] w-[2px] origin-top"
        style={{
          background: "linear-gradient(to bottom, transparent, #00eaff 30%, #ff003c 70%, transparent)",
          zIndex: 20,
        }}
      />

      {/* Content */}
      <div className="relative z-20">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-mono text-[10px] uppercase tracking-[0.4em] mb-8"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          [ Navigation ]
        </motion.p>

        {/* Nav links */}
        <nav className="flex flex-col gap-1">
          {links.map((link, i) => (
            <GlitchNavLink
              key={`link_${i}`}
              title={link.title}
              href={link.href}
              index={i}
              isActive={pathname === `/${link.href}` || randomGlitch === i}
              onClick={toggleMenu}
            />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="relative z-20">
        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-[1px] mb-6 origin-left"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0.15), transparent)",
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] mb-4"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          [ Socials ]
        </motion.p>

        <div className="flex flex-wrap">
          {footerLinks.map((link, i) => (
            <FooterLink key={`f_${i}`} title={link.title} href={link.href} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}