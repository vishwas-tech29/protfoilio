"use client";
import { project } from "@constants";
import { useRef, useState } from "react";
import ProjectCard from "./project-card";
import { Marquee, Modal } from "@animation";
import {
  useScroll,
  useTransform,
  useSpring,
  motion,
  MotionValue,
} from "framer-motion";

// ── Per-column scroll offsets (alternating) ──────────────────────────────────
function useColumnY(
  scrollYProgress: MotionValue<number>,
  direction: 1 | -1
): MotionValue<number> {
  const raw = useTransform(
    scrollYProgress,
    [0, 1],
    [0, direction * 140]
  );
  return useSpring(raw, { stiffness: 60, damping: 20, restDelta: 0.001 });
}

// ── Section index label ──────────────────────────────────────────────────────
function IndexLabel({ n }: { n: number }) {
  return (
    <span
      className="text-[10px] tracking-[0.22em] text-white/20 select-none"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}

export default function Project() {
  const container = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState({ active: false, index: 0 });

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  // Two columns with opposing parallax
  const colAY = useColumnY(scrollYProgress, -1);
  const colBY = useColumnY(scrollYProgress,  1);

  // Split projects into two columns
  const colA = project.filter((_, i) => i % 2 === 0);
  const colB = project.filter((_, i) => i % 2 !== 0);

  // Marquee progress-tied opacity
  const marqOpacity = useTransform(scrollYProgress, [0, 0.08, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section
      id="projects"
      className="relative w-full bg-[#080808] text-[#f0ede6] overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── TOP RULE ── */}
      <div className="w-full h-px bg-white/[0.07]" />

      {/* ── SECTION HEADER ── */}
      <div className="flex items-center justify-between px-8 sm:px-4 py-10 border-b border-white/[0.07]">
        <div className="flex items-center gap-5">
          <IndexLabel n={2} />
          <span className="w-px h-4 bg-white/15" />
          <span className="text-[11px] tracking-[0.22em] uppercase text-white/35">
            Selected Work
          </span>
        </div>
        <span
          className="text-[11px] tracking-[0.18em] uppercase text-white/25"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {project.length} Projects
        </span>
      </div>

      {/* ── MARQUEE ── */}
      <motion.div
        style={{ opacity: marqOpacity }}
        className="py-6 border-b border-white/[0.05] overflow-hidden"
      >
        <Marquee baseVelocity={2.5}>
          <div className="flex items-center gap-0">
            {["Selected", "Projects", "Selected", "Projects", "Selected", "Projects"].map(
              (word, i) => (
                <span
                  key={i}
                  className="flex items-center"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {i % 2 === 0 ? (
                    <span className="text-[96px] sm:text-[60px] font-black uppercase tracking-[-0.04em] text-white/[0.06] leading-none px-6 select-none">
                      {word}
                    </span>
                  ) : (
                    <>
                      <span className="text-[96px] sm:text-[60px] font-black uppercase tracking-[-0.04em] leading-none px-6 select-none"
                        style={{ WebkitTextStroke: "1px rgba(200,240,96,0.25)", color: "transparent" }}>
                        {word}
                      </span>
                      <span className="w-3 h-3 rounded-full bg-[#c8f060]/30 mx-4 shrink-0" />
                    </>
                  )}
                </span>
              )
            )}
          </div>
        </Marquee>
      </motion.div>

      {/* ── TWO-COLUMN GRID ── */}
      <div
        ref={container}
        className="relative flex gap-5 px-8 sm:px-4 py-16 sm:flex-col"
        style={{ alignItems: "flex-start" }}
      >
        {/* Column A — shifts UP on scroll */}
        <motion.div
          style={{ y: colAY }}
          className="flex flex-col gap-5 flex-1 sm:w-full"
        >
          {colA.map((item, i) => (
            <ProjectCard
              key={item.id}
              item={item}
              index={i * 2}
              setModal={setModal}
            />
          ))}
        </motion.div>

        {/* Column B — shifts DOWN on scroll, offset top */}
        <motion.div
          style={{ y: colBY }}
          className="flex flex-col gap-5 flex-1 sm:w-full"
          // Offset second column downward for asymmetric stagger
          initial={{ marginTop: "80px" }}
        >
          {colB.map((item, i) => (
            <ProjectCard
              key={item.id}
              item={item}
              index={i * 2 + 1}
              setModal={setModal}
            />
          ))}
        </motion.div>

        {/* ── VERTICAL RULE between columns (desktop only) ── */}
        <div className="absolute left-1/2 top-16 bottom-16 w-px bg-white/[0.06] -translate-x-1/2 sm:hidden pointer-events-none" />
      </div>

      {/* ── BOTTOM META ROW ── */}
      <div className="flex items-center justify-between px-8 sm:px-4 py-8 border-t border-white/[0.07]">
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/20"
          style={{ fontFamily: "'DM Mono', monospace" }}>
          2021 — Present
        </span>
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8f060]/50" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/25"
            style={{ fontFamily: "'DM Mono', monospace" }}>
            Available for work
          </span>
        </div>
      </div>

      {/* ── BOTTOM RULE ── */}
      <div className="w-full h-px bg-white/[0.07]" />

      {/* ── MODAL ── */}
      <Modal projects={project} modal={modal} />
    </section>
  );
}