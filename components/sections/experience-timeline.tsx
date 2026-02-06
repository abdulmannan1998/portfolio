"use client";

import { motion } from "framer-motion";
import { experienceData, type ExperienceItem } from "@/data/experience";

// Tailwind purges unused classes - use explicit mappings
const colorMap: Record<ExperienceItem["color"], { bg: string; text: string }> =
  {
    orange: { bg: "bg-orange-500", text: "text-orange-500" },
    blue: { bg: "bg-blue-500", text: "text-blue-500" },
    purple: { bg: "bg-purple-500", text: "text-purple-500" },
  };

export function ExperienceTimeline() {
  return (
    <div>
      <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">
        Journey
      </span>
      <h2 className="text-5xl md:text-6xl font-black mt-2 mb-16">EXPERIENCE</h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/20" />

        {experienceData.map((item, index) => {
          const isLast = index === experienceData.length - 1;
          const colors = colorMap[item.color];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={`relative pl-12 ${isLast ? "" : "pb-16"}`}
            >
              <div
                className={`absolute left-0 top-2 w-3 h-3 ${colors.bg} -translate-x-1/2`}
              />
              <span className="text-white/40 font-mono text-sm">
                {item.period}
              </span>
              <h3 className="text-3xl font-black mt-2">{item.company}</h3>
              <p className={`${colors.text} font-mono text-sm mt-1`}>
                {item.role}
              </p>
              <ul className="mt-4 space-y-2 text-white/60">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>* {highlight}</li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
