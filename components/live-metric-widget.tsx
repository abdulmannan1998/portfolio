"use client";

import { motion } from "framer-motion";
import { type RESUME_DATA } from "@/data/resume-data";

type MetricProps = {
  data: (typeof RESUME_DATA.metrics)[0];
  delay?: number;
};

export function LiveMetricWidget({ data, delay = 0 }: MetricProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="group relative overflow-hidden border border-stone-800 bg-stone-900/80 backdrop-blur-sm p-4 hover:border-orange-500/50 transition-colors"
    >
      <div className="absolute top-0 right-0 h-1 w-1 bg-stone-700 group-hover:bg-orange-500 transition-colors" />
      <div className="absolute bottom-0 left-0 h-1 w-1 bg-stone-700 group-hover:bg-orange-500 transition-colors" />

      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
          {data.company} • {data.label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white group-hover:text-orange-500 transition-colors">
            {data.value}
          </span>
        </div>
        <p className="text-sm text-stone-400 leading-tight">{data.context}</p>
      </div>
    </motion.div>
  );
}
