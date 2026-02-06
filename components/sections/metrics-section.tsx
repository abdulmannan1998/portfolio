"use client";

import { motion } from "framer-motion";
import { RESUME_DATA } from "@/data/resume-data";
import { TrendingUp, TrendingDown, Zap, Target, Users } from "lucide-react";

const icons = {
  productivity: TrendingUp,
  bugs: TrendingDown,
  poc: Zap,
  typesafety: Target,
  "client-sat": Users,
};

export function MetricsSection() {
  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900/50 to-stone-950" />

      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-orange-500/10 via-transparent to-transparent blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-orange-500/50" />
            <span className="text-xs font-mono text-orange-500 uppercase tracking-[0.2em]">
              Impact
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-orange-500/50" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Measurable Results
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto">
            Real metrics from my work at Intenseye and Layermark
          </p>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {RESUME_DATA.metrics.map((metric, index) => {
            const Icon = icons[metric.id as keyof typeof icons] || Target;
            const isPositive =
              metric.value.startsWith("+") || metric.value.includes("→");
            const isNegative = metric.value.startsWith("-");

            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-xl border border-stone-800 bg-stone-900/50 p-6 hover:border-orange-500/30 transition-all overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-stone-700/50 group-hover:border-orange-500/30 transition-colors" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-stone-700/50 group-hover:border-orange-500/30 transition-colors" />

                <div className="relative">
                  {/* Company badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-stone-600 uppercase tracking-wider">
                      {metric.company}
                    </span>
                    <Icon
                      className={`h-4 w-4 ${
                        isPositive
                          ? "text-emerald-500"
                          : isNegative
                            ? "text-emerald-500"
                            : "text-orange-500"
                      }`}
                    />
                  </div>

                  {/* Value */}
                  <div className="mb-2">
                    <span
                      className={`text-3xl font-bold ${
                        isPositive || isNegative
                          ? "text-white"
                          : "text-orange-500"
                      } group-hover:text-orange-400 transition-colors`}
                    >
                      {metric.value}
                    </span>
                  </div>

                  {/* Label */}
                  <p className="text-sm font-medium text-stone-300 mb-1">
                    {metric.label}
                  </p>

                  {/* Context */}
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {metric.context}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
