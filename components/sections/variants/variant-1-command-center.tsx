"use client";

import { motion } from "framer-motion";
import { techCategories } from "@/data/tech-stack";
import { GitHubActivity } from "@/components/github-activity";
import { SOCIAL_LINKS } from "@/lib/social-links";

const categoryOffsets = techCategories.reduce<number[]>((acc, cat, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + techCategories[i - 1].items.length);
  return acc;
}, []);

export function Variant1CommandCenter() {
  return (
    <section className="relative py-24 bg-black">
      {/* Section header */}
      <div className="px-6 md:px-12 mb-16">
        <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">
          Technologies
        </span>
        <h2 className="text-5xl md:text-6xl font-black mt-2">STACK & CODE</h2>
      </div>

      <div className="px-6 md:px-12">
        {/* Side-by-side container */}
        <div className="border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* LEFT: Tech Grid — 2/3 width */}
            <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-white/10">
              {/* Panel header bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/[0.02]">
                <div className="w-2 h-2 bg-orange-500" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                  TECH MANIFEST
                </span>
                <span className="ml-auto font-mono text-[10px] text-white/20">
                  {techCategories.reduce((sum, c) => sum + c.items.length, 0)}{" "}
                  ITEMS
                </span>
              </div>

              {/* Grid content */}
              <div className="p-4 md:p-6 space-y-4">
                {techCategories.map((category, catIndex) => {
                  const categoryStartIndex = categoryOffsets[catIndex];
                  return (
                    <div key={category.name}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-0.5 h-3 bg-orange-500" />
                        <span className="text-white/30 font-mono text-[10px] uppercase tracking-widest">
                          {category.name}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-px bg-white/[0.06]">
                        {category.items.map((tech, index) => (
                          <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              delay: (categoryStartIndex + index) * 0.03,
                              duration: 0.3,
                            }}
                            className="bg-black p-3 md:p-4 flex flex-col items-center gap-1.5 hover:bg-orange-500/10 transition-colors cursor-default group"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={tech.icon}
                              alt={tech.name}
                              className="w-7 h-7 md:w-8 md:h-8 object-contain"
                            />
                            <span className="text-[9px] font-mono uppercase text-white/40 group-hover:text-orange-500 transition-colors text-center leading-tight">
                              {tech.name}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: GitHub Terminal — 1/3 width */}
            <div className="bg-stone-950 flex flex-col">
              {/* Terminal header bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/[0.02]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-green-500/60">
                  LIVE TERMINAL
                </span>
              </div>

              {/* GitHub activity */}
              <div className="flex-1 p-0">
                <GitHubActivity username={SOCIAL_LINKS.github.username} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
