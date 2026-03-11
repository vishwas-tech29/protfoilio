"use client";

import { motion, useInView, useAnimationFrame } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const experiences = [
  {
    year: "2023 – Present",
    role: "Innovation Engineer",
    company: "Starkin Solutions",
    description:
      "Developing cutting-edge drone technology for autonomous last-mile delivery systems. Engineered flight control firmware, obstacle avoidance pipelines, and real-time telemetry dashboards for commercial deployment.",
    tags: ["Drone Tech", "Flight Control", "ROS2", "Python", "Telemetry"],
  },
  {
    year: "2022 – 2023",
    role: "Robotics Engineer",
    company: "Taurean Surgical",
    description:
      "Worked on precision robotic arm systems for minimally invasive surgical procedures. Developed inverse kinematics solvers and real-time motion control algorithms with sub-millimeter accuracy.",
    tags: ["Robotic Arm", "Inverse Kinematics", "C++", "Embedded Systems", "ROS"],
  },
  {
    year: "2021 – 2022",
    role: "Freelance Developer",
    company: "Self-Employed",
    description:
      "Designed and developed high-performance websites and web applications for clients across multiple industries. Delivered responsive, accessible, and visually polished digital experiences.",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript", "UI/UX"],
  },
];

const GLITCH_CHARS = "█▓▒░#@&%$!?";

function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAnimationFrame((t) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const CELL = 48;
    const cols = Math.ceil(canvas.width / CELL) + 1;
    const rows = Math.ceil(canvas.height / CELL) + 1;
    const time = t * 0.001;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * CELL;
        const y = r * CELL;
        const wave = Math.sin(time + c * 0.4) * Math.cos(time * 0.7 + r * 0.4);
        const alpha = (wave + 1) / 2;

        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(32,32,32,${alpha * 0.18})`;
        ctx.fill();

        if ((c + r) % 7 === 0) {
          const pulse = (Math.sin(time * 2 + c + r) + 1) / 2;
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(32,32,32,${pulse * 0.35})`;
          ctx.fill();
        }
      }
    }

    const scanY = (time * 80) % canvas.height;
    const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
    grad.addColorStop(0, "rgba(32,32,32,0)");
    grad.addColorStop(0.5, "rgba(32,32,32,0.06)");
    grad.addColorStop(1, "rgba(32,32,32,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 40, canvas.width, 80);
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

function GlitchTitle() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState("ABOUT".split("").map(() => ""));
  const [glitch, setGlitch] = useState(false);
  const target = "ABOUT";

  useEffect(() => {
    if (!isInView) return;
    target.split("").forEach((char, i) => {
      let iterations = 0;
      const total = 10 + i * 5;
      const interval = setInterval(() => {
        setDisplayed((prev) => {
          const next = [...prev];
          next[i] =
            iterations < total
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
              : char;
          return next;
        });
        iterations++;
        if (iterations > total) clearInterval(interval);
      }, 40);
    });
  }, [isInView]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="overflow-hidden pb-2">
      <h1
        className="relative text-[#202020] uppercase leading-none font-black tracking-tight select-none text-center"
        style={{ fontSize: "clamp(72px, 12vw, 140px)" }}
      >
        {displayed.map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: "110%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="inline-block relative"
            style={{
              textShadow: glitch
                ? `${(Math.random() * 8 - 4).toFixed(1)}px 0 #ff003c, ${(
                    Math.random() * -8 + 4
                  ).toFixed(1)}px 0 #00eaff`
                : "none",
              color: glitch && i === 2 ? "#ff003c" : "#202020",
              transition: glitch ? "none" : "color 0.3s",
            }}
          >
            {char || " "}
          </motion.span>
        ))}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)",
          }}
        />
      </h1>
    </div>
  );
}

function PixelReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ delay, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

const cardIcons: Record<string, string> = {
  "Starkin Solutions": "🚁",
  "Taurean Surgical": "🦾",
  "Self-Employed": "💻",
};

function ExperienceCard({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ delay: index * 0.15, duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      className="group relative border border-[#e0e0e0] bg-white/70 backdrop-blur-sm p-8 text-center hover:border-[#202020] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
    >
      {/* Corner accents */}
      {(["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"] as const).map((pos) => (
        <span
          key={pos}
          className={`absolute ${pos} w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            pos === "top-0 left-0" ? "border-t-2 border-l-2 border-[#202020]" :
            pos === "top-0 right-0" ? "border-t-2 border-r-2 border-[#202020]" :
            pos === "bottom-0 left-0" ? "border-b-2 border-l-2 border-[#202020]" :
            "border-b-2 border-r-2 border-[#202020]"
          }`}
        />
      ))}

      {/* Icon */}
      <div className="text-4xl mb-4">
        {cardIcons[exp.company]}
      </div>

      <p className="text-[11px] font-mono text-[#999] mb-2 tracking-[0.2em] uppercase">
        {exp.year}
      </p>

      <h3 className="text-[#202020] font-bold text-xl leading-tight mb-1">
        {exp.role}
      </h3>

      <p className="text-[#777] text-xs font-semibold mb-4 tracking-widest uppercase font-mono">
        {exp.company}
      </p>

      <p className="text-[#555] text-sm leading-relaxed max-w-sm mx-auto mb-6">
        {exp.description}
      </p>

      <div className="flex flex-wrap gap-2 justify-center">
        {exp.tags.map((tag, t) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.15 + 0.4 + t * 0.06, duration: 0.3 }}
            className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 border border-[#d0d0d0] text-[#555] group-hover:border-[#202020] group-hover:text-[#202020] transition-all duration-200 cursor-default"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <section className="relative w-full py-[100px] overflow-hidden" id="about">
      <GridBackground />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.95) 100%)",
          zIndex: 1,
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 md:px-12">
        <GlitchTitle />

        <PixelReveal delay={0.4}>
          <p className="mt-8 mb-6 text-[#555] text-lg leading-relaxed max-w-2xl font-light text-center">
            From flying drones to surgical robotic arms — I engineer intelligent
            systems that operate in the real world. I blend deep hardware expertise
            with modern software to build technology that moves, thinks, and delivers.
          </p>
        </PixelReveal>

        {/* Stats */}
        <PixelReveal delay={0.55}>
          <div className="flex gap-12 mb-16 mt-2 justify-center flex-wrap">
            {[
              { value: "3+", label: "Years Experience" },
              { value: "2", label: "Tech Companies" },
              { value: "∞", label: "Problems Solved" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-[#202020] font-black text-4xl leading-none">
                  {value}
                </span>
                <span className="text-[11px] font-mono text-[#aaa] uppercase tracking-widest mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </PixelReveal>

        <PixelReveal delay={0.65}>
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#bbb] mb-10 text-center">
            [ Working Experience ]
          </p>
        </PixelReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {experiences.map((exp, i) => (
            <ExperienceCard key={i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}