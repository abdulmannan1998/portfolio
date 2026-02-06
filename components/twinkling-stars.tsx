"use client";

import { useMemo } from "react";
import { mulberry32 } from "@/lib/seeded-random";

type Star = {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number; // 1 or 2 px
  baseOpacity: number; // 0.1 to 0.45
  peakOpacity: number; // base * 2.5, capped at 0.8
  animationDelay: string; // "0s" to "5s"
  animationDuration: string; // "2s" to "5s"
};

export function TwinklingStars() {
  const stars = useMemo(() => {
    const random = mulberry32(42); // Fixed seed for deterministic generation
    const starCount = 50;
    const generatedStars: Star[] = [];

    // Exclusion zone: central area where name + title sit
    const isInExclusionZone = (x: number, y: number) =>
      x > 20 && x < 80 && y > 30 && y < 70;

    for (let i = 0; i < starCount; i++) {
      let x = random() * 100;
      let y = random() * 100;

      // Redistribute stars that land in the exclusion zone to the edges
      if (isInExclusionZone(x, y)) {
        // Push to outer regions deterministically
        if (random() < 0.5) {
          y = random() < 0.5 ? random() * 25 : 75 + random() * 25;
        } else {
          x = random() < 0.5 ? random() * 18 : 82 + random() * 18;
        }
      }

      const size = random() < 0.6 ? 1 : 2;
      const baseOpacity = 0.1 + random() * 0.35; // 0.1 to 0.45
      const peakOpacity = Math.min(baseOpacity * 2.5, 0.8);
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
      <style>{`
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
