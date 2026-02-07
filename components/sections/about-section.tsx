"use client";

import { motion } from "framer-motion";
import { useHydrated } from "@/lib/use-hydrated";

type BackgroundPatternItem = {
  top: number;
  left: number;
  rotate: number;
};

type AboutSectionProps = {
  backgroundPattern: BackgroundPatternItem[];
};

export function AboutSection({ backgroundPattern }: AboutSectionProps) {
  const isHydrated = useHydrated();

  return (
    <section className="relative min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left - Image/Pattern */}
      <div className="relative bg-stone-900 flex items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          {backgroundPattern.map((pos, i) => (
            <div
              key={i}
              className="absolute text-8xl font-black text-white/5"
              style={{
                top: `${pos.top}%`,
                left: `${pos.left}%`,
                transform: `rotate(${pos.rotate}deg)`,
              }}
            >
              M
            </div>
          ))}
        </div>
        <div className="relative text-center">
          <span className="text-[200px] md:text-[300px] font-black text-white/10">
            4+
          </span>
          <p className="absolute bottom-1/3 left-1/2 -translate-x-1/2 text-2xl font-mono text-white/60">
            YEARS OF EXPERIENCE
          </p>
        </div>
      </div>

      {/* Right - Text */}
      <div className="relative bg-black flex items-center p-12 md:p-16">
        <div>
          <motion.span
            initial={isHydrated ? { opacity: 0 } : false}
            whileInView={{ opacity: 1 }}
            key={isHydrated ? "animated" : "static"}
            className="text-orange-500 font-mono text-sm uppercase tracking-widest"
          >
            About
          </motion.span>
          <motion.h2
            initial={isHydrated ? { y: 50, opacity: 0 } : false}
            whileInView={{ y: 0, opacity: 1 }}
            key={isHydrated ? "animated" : "static"}
            className="text-4xl md:text-5xl font-black mt-4 mb-8 leading-tight"
          >
            BUILDING
            <br />
            <span className="text-orange-500">INTERFACES</span>
            <br />
            THAT FEEL ALIVE
          </motion.h2>
          <motion.p
            initial={isHydrated ? { y: 30, opacity: 0 } : false}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            key={isHydrated ? "animated" : "static"}
            className="text-white/60 text-lg leading-relaxed max-w-md mb-4"
          >
            I build data-dense dashboards, complex state systems, and the
            architectural scaffolding that makes frontend codebases scale. My
            work tends toward the internal tooling and pattern-setting that
            raises the ceiling for entire engineering teams.
          </motion.p>
          <motion.p
            initial={isHydrated ? { y: 30, opacity: 0 } : false}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            key={isHydrated ? "animated" : "static"}
            className="text-white/60 text-lg leading-relaxed max-w-md"
          >
            I tend to be the engineer who gets routed the unclear or difficult
            problems — the ones other developers would rather avoid. That&apos;s
            where I do my best work: absorbing complexity and turning it into
            something maintainable.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
