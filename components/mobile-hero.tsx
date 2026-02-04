"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RESUME_DATA } from "@/data/resume-data";
import dynamic from "next/dynamic";

const LiveMetricWidget = dynamic(
  () =>
    import("@/components/live-metric-widget").then(
      (mod) => mod.LiveMetricWidget,
    ),
  {
    ssr: false,
  },
);

type MobileHeroProps = {
  onContentReady?: () => void;
};

export function MobileHero({ onContentReady }: MobileHeroProps) {
  useEffect(() => {
    // Notify parent when component is mounted
    if (onContentReady) {
      const timer = setTimeout(() => {
        onContentReady();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [onContentReady]);

  return (
    <div className="min-h-screen bg-stone-950 p-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          {RESUME_DATA.personal.name}
        </h1>
        <p className="mt-2 text-lg text-orange-500 font-mono">
          {RESUME_DATA.personal.title}
        </p>
        <div className="mt-4 text-sm text-stone-500 font-mono">
          <p>STATUS: ONLINE</p>
          <p>LOC: {RESUME_DATA.personal.location}</p>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="mb-4 text-sm font-mono text-stone-500">
          CAREER TIMELINE
        </h2>
        <div className="space-y-4">
          {RESUME_DATA.roles.map((role, index) => (
            <motion.div
              key={role.company}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="rounded-lg border border-stone-800 bg-stone-900/50 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {role.company}
                  </h3>
                  <p className="text-sm text-stone-400">{role.title}</p>
                </div>
                <span className="text-xs font-mono text-stone-500">
                  {role.period}
                </span>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="rounded-lg border border-stone-800 bg-stone-900/50 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Bilkent University
                </h3>
                <p className="text-sm text-stone-400">Education</p>
              </div>
              <span className="text-xs font-mono text-stone-500">
                2017-2021
              </span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <h2 className="mb-4 text-sm font-mono text-stone-500">
          KEY ACHIEVEMENTS
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {RESUME_DATA.metrics.map((metric, i) => (
            <LiveMetricWidget
              key={metric.id}
              data={metric}
              delay={1 + i * 0.1}
            />
          ))}
        </div>
      </motion.section>
    </div>
  );
}
