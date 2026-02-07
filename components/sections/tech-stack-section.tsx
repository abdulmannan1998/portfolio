"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { TechCategory } from "@/data/tech-stack";
import { useHydrated } from "@/lib/use-hydrated";

type TechStackSectionProps = {
  categories: TechCategory[];
};

export function TechStackSection({ categories }: TechStackSectionProps) {
  const isHydrated = useHydrated();
  const categoryOffsets = categories.reduce<number[]>((acc, cat, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + categories[i - 1].items.length);
    return acc;
  }, []);

  return (
    <div className="lg:pr-14 space-y-8">
      {categories.map((category, catIndex) => {
        const categoryStartIndex = categoryOffsets[catIndex];
        return (
          <div key={category.name}>
            {/* Oversized category header */}
            <motion.h3
              initial={isHydrated ? { x: -30, opacity: 0 } : false}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
              key={isHydrated ? `animated-${category.name}` : category.name}
              className="text-2xl md:text-3xl font-black text-orange-500/25 uppercase leading-none mb-3"
            >
              {category.name}
            </motion.h3>

            {/* Compact icon cluster */}
            <div className="flex flex-wrap gap-3 pl-1">
              {category.items.map((tech, index) => (
                <motion.div
                  key={isHydrated ? `animated-${tech.name}` : tech.name}
                  initial={isHydrated ? { opacity: 0, y: 6 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: (categoryStartIndex + index) * 0.03,
                    duration: 0.3,
                  }}
                  className="flex items-center gap-2 cursor-default group"
                >
                  <Image
                    src={tech.icon}
                    alt={tech.name}
                    width={28}
                    height={28}
                    className="w-6 h-6 md:w-7 md:h-7 object-contain"
                    unoptimized
                  />
                  <span className="text-[10px] font-mono uppercase text-white/40 group-hover:text-orange-500 transition-colors">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Thin separator */}
            <div className="h-px bg-white/[0.08] mt-6" />
          </div>
        );
      })}
    </div>
  );
}
