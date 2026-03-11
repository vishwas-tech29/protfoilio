// ─────────────────────────────────────────────────────────────────────────────
// MOTION VARIANTS  —  Cinematic / Morphic design language
// Easing vocabulary:
//   SNAP    → explosive entry, instant settle
//   DRIFT   → slow, weighted, atmospheric
//   ELASTIC → overshoots and settles with life
//   FOLD    → perspective collapse / unfold
// ─────────────────────────────────────────────────────────────────────────────

const SNAP    = [0.22, 1.0,  0.36, 1.0]  as const;
const DRIFT   = [0.25, 0.46, 0.45, 0.94] as const;
const ELASTIC = [0.68, -0.55, 0.27, 1.55] as const;
const FOLD    = [0.76, 0.0,  0.24, 1.0]  as const;
const CINEMATIC = [0.87, 0.0, 0.13, 1.0] as const;

// ─── 1. TEXT LINE REVEAL ─────────────────────────────────────────────────────
// Each line slices up from below with a slight rotation — like film titles
export const animation = {
    initial: {
        y: "110%",
        rotate: 4,
        opacity: 0,
    },
    enter: (i: number) => ({
        y: "0%",
        rotate: 0,
        opacity: 1,
        transition: {
            duration: 0.9,
            ease: SNAP,
            delay: 0.08 * i,
            opacity: { duration: 0.4, ease: "linear" },
        },
    }),
    exit: (i: number) => ({
        y: "-110%",
        rotate: -3,
        opacity: 0,
        transition: {
            duration: 0.55,
            ease: FOLD,
            delay: 0.05 * i,
        },
    }),
};

// ─── 2. NAV BAR ──────────────────────────────────────────────────────────────
// Drops in from above with a subtle blur clearing — feels like glass lifting
export const navVarients = {
    initial: {
        y: "-120%",
        opacity: 0,
        filter: "blur(12px)",
    },
    vissible: {
        y: "0%",
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            duration: 1.1,
            ease: CINEMATIC,
            opacity: { duration: 0.6, delay: 0.2 },
            filter: { duration: 0.7, delay: 0.15 },
        },
    },
    hidden: {
        y: "-120%",
        opacity: 0,
        filter: "blur(8px)",
        transition: {
            duration: 0.7,
            ease: FOLD,
        },
    },
};

// ─── 3. HERO SECTION ─────────────────────────────────────────────────────────
// Rises from below with a scale punch — weighted, cinematic
export const heroVarients = {
    initial: {
        y: "60px",
        opacity: 0,
        scale: 0.96,
        filter: "blur(6px)",
    },
    vissible: {
        y: "0px",
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 1.2,
            ease: CINEMATIC,
            delay: 0.9,
            scale: { duration: 1.4, ease: SNAP },
            opacity: { duration: 0.7, delay: 0.9 },
            filter: { duration: 0.8, delay: 1.0 },
        },
    },
    exit: {
        y: "-40px",
        opacity: 0,
        scale: 1.02,
        filter: "blur(4px)",
        transition: {
            duration: 0.6,
            ease: DRIFT,
        },
    },
};

// ─── 4. SCALE / CURSOR POPUP ─────────────────────────────────────────────────
// Morphs from a point with elastic overshoot — feels alive
export const scaleAnimation = {
    initial: {
        scale: 0,
        x: "-50%",
        y: "-50%",
        rotate: -8,
        opacity: 0,
    },
    enter: {
        scale: 1,
        x: "-50%",
        y: "-50%",
        rotate: 0,
        opacity: 1,
        transition: {
            duration: 0.55,
            ease: ELASTIC,
            opacity: { duration: 0.2, ease: "linear" },
            rotate: { duration: 0.45, ease: SNAP },
        },
    },
    closed: {
        scale: 0,
        x: "-50%",
        y: "-50%",
        rotate: 6,
        opacity: 0,
        transition: {
            duration: 0.35,
            ease: FOLD,
            opacity: { duration: 0.2 },
        },
    },
};

// ─── 5. MENU CONTAINER ───────────────────────────────────────────────────────
// Expands from a pill into full panel — morphic shape transition
export const menu = {
    open: {
        width: "auto",
        height: "auto",
        top: "-12px",
        right: "-12px",
        borderRadius: "24px",
        transition: {
            duration: 0.8,
            type: "tween" as const,
            ease: CINEMATIC,
            borderRadius: { duration: 0.5, delay: 0.1 },
        },
    },
    closed: {
        width: "108px",
        height: "44px",
        top: "0px",
        right: "0px",
        borderRadius: "100px",
        transition: {
            duration: 0.7,
            delay: 0.25,
            type: "tween" as const,
            ease: FOLD,
            borderRadius: { duration: 0.4, delay: 0.45 },
        },
    },
};

// ─── 6. PERSPECTIVE NAV LINKS ────────────────────────────────────────────────
// Each item tumbles in on the X axis like a rolodex card flipping
export const perspective = {
    initial: {
        opacity: 0,
        rotateX: 75,
        y: 60,
        x: -12,
        scale: 0.92,
    },
    enter: (i: number) => ({
        opacity: 1,
        rotateX: 0,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            delay: 0.35 + i * 0.08,
            ease: SNAP,
            opacity: { duration: 0.3, delay: 0.35 + i * 0.08 },
            scale:   { duration: 0.6, ease: ELASTIC },
        },
    }),
    exit: (i: number) => ({
        opacity: 0,
        rotateX: -50,
        y: -30,
        scale: 0.95,
        transition: {
            duration: 0.4,
            delay: i * 0.04,
            ease: DRIFT,
        },
    }),
};

// ─── 7. SLIDE-IN SECONDARY LINKS ─────────────────────────────────────────────
// Drifts in from the side with a stagger — like pages fanning out
export const slideIn = {
    initial: {
        opacity: 0,
        x: -24,
        y: 8,
        scale: 0.97,
    },
    enter: (i: number) => ({
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            delay: 0.6 + i * 0.07,
            ease: SNAP,
            opacity: { duration: 0.35, ease: "linear" },
        },
    }),
    exit: (i: number) => ({
        opacity: 0,
        x: 16,
        y: -4,
        transition: {
            duration: 0.35,
            delay: i * 0.03,
            ease: DRIFT,
        },
    }),
};

// ─── 8. STAGGER CONTAINER (bonus) ────────────────────────────────────────────
// Orchestrates children with a wave-like stagger
export const staggerContainer = {
    initial: {},
    vissible: {
        transition: {
            staggerChildren: 0.09,
            delayChildren: 0.2,
        },
    },
    exit: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1 as const,
        },
    },
};

// ─── 9. FADE BLUR (bonus) ────────────────────────────────────────────────────
// Atmospheric reveal — content emerges from haze
export const fadeBlur = {
    initial: {
        opacity: 0,
        filter: "blur(20px)",
        scale: 1.04,
    },
    vissible: (i: number = 0) => ({
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        transition: {
            duration: 1.0,
            delay: i * 0.12,
            ease: CINEMATIC,
            filter: { duration: 0.8 },
            scale:  { duration: 1.1, ease: DRIFT },
        },
    }),
    exit: {
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.98,
        transition: { duration: 0.5, ease: DRIFT },
    },
};

// ─── 10. CLIP WIPE (bonus) ───────────────────────────────────────────────────
// Element is revealed by a clip-path wipe — sharp and editorial
export const clipWipe = {
    initial: {
        clipPath: "inset(0% 100% 0% 0%)",
        opacity: 1,
    },
    vissible: (i: number = 0) => ({
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        transition: {
            duration: 0.85,
            delay: i * 0.1,
            ease: CINEMATIC,
        },
    }),
    exit: {
        clipPath: "inset(0% 0% 0% 100%)",
        transition: { duration: 0.5, ease: FOLD },
    },
};