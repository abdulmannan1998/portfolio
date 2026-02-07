"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const GraphSection = dynamic(
  () =>
    import("@/components/sections/graph-section").then(
      (mod) => mod.GraphSection,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-[500px] md:h-[700px] rounded-xl border border-stone-800 bg-stone-950/50 animate-pulse flex items-center justify-center">
        <span className="text-white/40 font-mono text-sm uppercase">
          Loading graph...
        </span>
      </div>
    ),
  },
);

export function GraphSectionLoader() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(() => {
    // Lazy initialization: check viewport width on mount (client-only)
    if (typeof window === "undefined") return null;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (!isDesktop) return null;

  return <GraphSection />;
}
