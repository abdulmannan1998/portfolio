"use client";

import { motion } from "framer-motion";

export type MarqueeTextProps = {
  text: string;
  direction?: number;
};

export function MarqueeText({ text, direction = 1 }: MarqueeTextProps) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="inline-flex"
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mx-4">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
