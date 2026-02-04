"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CSSPreloader } from "@/components/css-preloader";
import { RESUME_DATA } from "@/data/resume-data";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";

// Lazy load heavy components to improve initial load
const DashboardBackground = dynamic(
  () =>
    import("@/components/dashboard-background").then(
      (mod) => mod.DashboardBackground,
    ),
  {
    ssr: false, // Disable SSR for React Flow (uses browser APIs)
  },
);

const LiveMetricWidget = dynamic(
  () =>
    import("@/components/live-metric-widget").then(
      (mod) => mod.LiveMetricWidget,
    ),
  {
    ssr: false,
  },
);

const MobileHero = dynamic(
  () => import("@/components/mobile-hero").then((mod) => mod.MobileHero),
  {
    ssr: false,
  },
);

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const { isMobile } = useResponsiveLayout();

  // Hide preloader once content is mounted and ready
  useEffect(() => {
    if (contentReady) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [contentReady]);

  return (
    <main className="relative min-h-screen bg-stone-950 font-sans text-stone-200 selection:bg-orange-500/30">
      {/* CSS preloader - stays visible until content is ready */}
      {loading && <CSSPreloader />}

      {/* Main content - starts loading immediately but hidden behind preloader */}
      <div style={{ opacity: loading ? 0 : 1, transition: "opacity 0.5s" }}>
        {isMobile ? (
          <MobileHero onContentReady={() => setContentReady(true)} />
        ) : (
          <DashboardBackground>
            <div className="pointer-events-none absolute inset-0 flex flex-col p-6 md:p-12">
              {/* Header / Nav Area */}
              <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onAnimationComplete={() => setContentReady(true)}
                className="pointer-events-auto flex items-start justify-between"
              >
                <div>
                  <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
                    {RESUME_DATA.personal.name}
                  </h1>
                  <p className="mt-2 text-xl text-orange-500 font-mono">
                    {RESUME_DATA.personal.title}
                  </p>
                </div>

                <div className="text-right text-sm text-stone-500 font-mono">
                  <p>STATUS: ONLINE</p>
                  <p>LOC: {RESUME_DATA.personal.location}</p>
                </div>
              </motion.header>

              {/* Metrics Grid */}
              <div className="mt-auto pointer-events-auto grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {RESUME_DATA.metrics.map((metric, i) => (
                  <LiveMetricWidget
                    key={metric.id}
                    data={metric}
                    delay={1 + i * 0.1}
                  />
                ))}
              </div>
            </div>
          </DashboardBackground>
        )}
      </div>
    </main>
  );
}
