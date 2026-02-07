"use client";

import dynamic from "next/dynamic";

// Lazy load React Flow graph (client-only component wrapper)
const GraphSection = dynamic(
  () =>
    import("@/components/sections/graph-section").then(
      (mod) => mod.GraphSection,
    ),
  {
    ssr: false,
    loading: () => (
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="h-[600px] bg-stone-900 animate-pulse flex items-center justify-center">
            <span className="text-white/40 font-mono text-sm uppercase">
              Loading graph...
            </span>
          </div>
        </div>
      </section>
    ),
  },
);

export function GraphSectionLoader() {
  return <GraphSection />;
}
