"use client";
import { useEffect, useState } from "react";

const messages = [
  "Welcome",
  "స్వాగతం",
  "स्वागत",
  "வரவேற்கிறோம்",
  "ಸ್ವಾಗತ",
  "സ്വാഗതം",
  "স্বাগতম",
  "欢迎",
  "Bienvenue",
  "Willkommen",
];

export default function Loader({ onComplete }: { onComplete?: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((p) => (p + 1) % messages.length);
    }, 250);

    const done = setTimeout(() => {
      onComplete?.();
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div className="loader">
      <div className="glitch" data-text={messages[index]}>
        {messages[index]}
      </div>

      <div className="scanlines" />

      <style jsx>{`
        .loader {
          position: fixed;
          inset: 0;
          background: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          font-family: monospace;
        }

        .glitch {
          font-size: clamp(40px, 8vw, 100px);
          font-weight: bold;
          color: white;
          position: relative;
          animation: flicker 1.5s infinite;
        }

        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          overflow: hidden;
        }

        .glitch::before {
          color: #0ff;
          z-index: -1;
          animation: glitchTop 0.6s infinite linear alternate-reverse;
        }

        .glitch::after {
          color: #f0f;
          z-index: -2;
          animation: glitchBottom 0.8s infinite linear alternate-reverse;
        }

        @keyframes glitchTop {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, -2px);
          }
          40% {
            transform: translate(-4px, 2px);
          }
          60% {
            transform: translate(2px, -1px);
          }
          80% {
            transform: translate(-1px, 3px);
          }
          100% {
            transform: translate(0);
          }
        }

        @keyframes glitchBottom {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(2px, 2px);
          }
          40% {
            transform: translate(4px, -2px);
          }
          60% {
            transform: translate(-2px, 1px);
          }
          80% {
            transform: translate(1px, -3px);
          }
          100% {
            transform: translate(0);
          }
        }

        @keyframes flicker {
          0% {
            opacity: 0.9;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.95;
          }
        }

        .scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.04) 3px
          );
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}