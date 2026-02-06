"use client";

import { useEffect } from "react";
import { RESUME_DATA } from "@/data/resume-data";
import { AnimatedCounter } from "@/components/animated-counter";
import { initScrollAnimations } from "@/hooks/use-scroll-animation";

export function MetricsSection() {
  useEffect(() => {
    const cleanup = initScrollAnimations();
    return cleanup;
  }, []);

  return (
    <section className="relative py-24 bg-black">
      <div className="px-6 md:px-12 mb-12">
        <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">
          Impact
        </span>
        <h2 className="text-5xl md:text-6xl font-black mt-2">
          MEASURABLE RESULTS
        </h2>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div
          className="flex gap-6 px-6 md:px-12 pb-6"
          style={{ width: "max-content" }}
        >
          {RESUME_DATA.metrics.map((metric, index) => (
            <div
              key={metric.id}
              className="relative w-80 h-96 bg-stone-900 rounded-none p-8 flex flex-col justify-between group hover:bg-stone-800 transition-colors fade-in-up"
              style={{ "--stagger-index": index } as React.CSSProperties}
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500" />

              <div>
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                  {metric.company}
                </span>
                <h3 className="text-xl font-bold text-white/80 mt-2">
                  {metric.label}
                </h3>
              </div>

              <div>
                <div className="text-6xl font-black text-orange-500 mb-4">
                  {metric.value.includes("→") ? (
                    metric.value
                  ) : (
                    <AnimatedCounter
                      value={metric.value}
                      suffix={metric.value.includes("%") ? "%" : ""}
                    />
                  )}
                </div>
                <p className="text-white/50 text-sm">{metric.context}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
