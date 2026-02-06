"use client";

import { motion } from "framer-motion";
import { techCategories } from "@/data/tech-stack";
import { GitHubActivity } from "@/components/github-activity";
import { SOCIAL_LINKS } from "@/lib/social-links";

const categoryOffsets = techCategories.reduce<number[]>((acc, cat, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + techCategories[i - 1].items.length);
  return acc;
}, []);

export function Variant4DashboardTiles() {
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
        {/* Dashboard container — equal-height panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10">
          {/* LEFT TILE: Tech Stack */}
          <div className="bg-stone-900 flex flex-col">
            {/* Tile header bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Tech Stack
                </span>
              </div>
              <span className="font-mono text-[10px] text-white/20">
                {techCategories.reduce((sum, c) => sum + c.items.length, 0)}{" "}
                technologies
              </span>
            </div>

            {/* Compact chip-style grid per category */}
            <div className="p-5 space-y-5 flex-1">
              {techCategories.map((category, catIndex) => {
                const categoryStartIndex = categoryOffsets[catIndex];
                return (
                  <div key={category.name}>
                    <span className="text-white/25 font-mono text-[9px] uppercase tracking-[0.2em] mb-2 block">
                      {category.name}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {category.items.map((tech, index) => (
                        <motion.div
                          key={tech.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: (categoryStartIndex + index) * 0.03,
                            duration: 0.25,
                          }}
                          className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1.5 hover:bg-orange-500/10 transition-colors cursor-default group border border-white/[0.04]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={tech.icon}
                            alt={tech.name}
                            className="w-4 h-4 object-contain"
                          />
                          <span className="text-[10px] font-mono uppercase text-white/50 group-hover:text-orange-500 transition-colors">
                            {tech.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom status bar */}
            <div className="px-5 py-2 border-t border-white/[0.06] flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/[0.04]">
                <div className="h-full bg-orange-500/30 w-full" />
              </div>
              <span className="font-mono text-[9px] text-white/20 uppercase">
                5 categories
              </span>
            </div>
          </div>

          {/* RIGHT TILE: GitHub Status Board */}
          <div className="bg-stone-900 flex flex-col">
            {/* Tile header bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Status Board
                </span>
              </div>
              <span className="font-mono text-[10px] text-green-500/50 uppercase">
                Connected
              </span>
            </div>

            {/* GitHub activity fills remaining space */}
            <div className="flex-1">
              <GitHubActivity username={SOCIAL_LINKS.github.username} />
            </div>

            {/* Bottom status bar */}
            <div className="px-5 py-2 border-t border-white/[0.06] flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/[0.04]">
                <motion.div
                  className="h-full bg-green-500/30"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </div>
              <span className="font-mono text-[9px] text-white/20 uppercase">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
