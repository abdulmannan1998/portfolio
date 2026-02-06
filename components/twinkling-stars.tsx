"use client";

import { useMemo } from "react";

// Seeded PRNG to ensure deterministic star positions (prevents hydration mismatches)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number; // 1 or 2 px
  baseOpacity: number; // 0.05 to 0.25
  peakOpacity: number; // base * 3, capped at 0.6
  animationDelay: string; // "0s" to "5s"
  animationDuration: string; // "2s" to "5s"
};

export function TwinklingStars() {
  const stars = useMemo(() => {
    const random = mulberry32(42); // Fixed seed for deterministic generation
    const starCount = 40;
    const generatedStars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const x = random() * 100;
      const y = random() * 100;
      const size = random() < 0.7 ? 1 : 2; // 70% are 1px, 30% are 2px
      const baseOpacity = 0.05 + random() * 0.2; // 0.05 to 0.25
      const peakOpacity = Math.min(baseOpacity * 3, 0.6);
      const animationDelay = `${(random() * 5).toFixed(1)}s`;
      const animationDuration = `${(2 + random() * 3).toFixed(1)}s`;

      generatedStars.push({
        x,
        y,
        size,
        baseOpacity,
        peakOpacity,
        animationDelay,
        animationDuration,
      });
    }

    return generatedStars;
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: var(--star-base-opacity);
          }
          50% {
            opacity: var(--star-peak-opacity);
          }
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star, index) => (
          <div
            key={index}
            style={
              {
                position: "absolute",
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: "white",
                borderRadius: "9999px",
                "--star-base-opacity": star.baseOpacity,
                "--star-peak-opacity": star.peakOpacity,
                animation: `twinkle ${star.animationDuration} ${star.animationDelay} infinite ease-in-out`,
              } as React.CSSProperties & {
                "--star-base-opacity": number;
                "--star-peak-opacity": number;
              }
            }
          />
        ))}
      </div>
    </>
  );
}
