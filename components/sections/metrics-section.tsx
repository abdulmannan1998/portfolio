"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/animated-counter";
import { useHydrated } from "@/lib/use-hydrated";

export type Metric = {
  id: string;
  label: string;
  value: string;
  context: string;
  company: string;
};

type MetricsSectionProps = {
  metrics: Metric[];
};

export function MetricsSection({ metrics }: MetricsSectionProps) {
  const isHydrated = useHydrated();

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
          {metrics.map((metric, index) => (
            <motion.div
              key={isHydrated ? `animated-${metric.id}` : metric.id}
              initial={isHydrated ? { opacity: 0, y: 50 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative w-80 h-96 bg-stone-900 rounded-none p-8 flex flex-col justify-between group hover:bg-stone-800 transition-colors"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
