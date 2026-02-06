"use client";

import { motion } from "framer-motion";
import { techCategories } from "@/data/tech-stack";
import { GitHubActivity } from "@/components/github-activity";
import { SOCIAL_LINKS } from "@/lib/social-links";

const categoryOffsets = techCategories.reduce<number[]>((acc, cat, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + techCategories[i - 1].items.length);
  return acc;
}, []);

export function Variant5BrutalistMagazine() {
  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Section header */}
      <div className="px-6 md:px-12 mb-16">
        <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">
          Technologies
        </span>
        <h2 className="text-5xl md:text-6xl font-black mt-2">STACK & CODE</h2>
      </div>

      <div className="px-6 md:px-12">
        {/* Magazine spread container */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2">
          {/* Diagonal orange stripe at junction */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-20 z-10 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 bg-orange-500"
              style={{
                clipPath: "polygon(30% 0%, 70% 0%, 50% 100%, 10% 100%)",
              }}
            />
          </div>

          {/* LEFT PAGE: Tech Stack — dramatic stacked layout */}
          <div className="lg:pr-14 space-y-8">
            {techCategories.map((category, catIndex) => {
              const categoryStartIndex = categoryOffsets[catIndex];
              return (
                <div key={category.name}>
                  {/* Oversized category header */}
                  <motion.h3
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIndex * 0.1 }}
                    className="text-2xl md:text-3xl font-black text-white/[0.07] uppercase leading-none mb-3"
                  >
                    {category.name}
                  </motion.h3>

                  {/* Compact icon cluster */}
                  <div className="flex flex-wrap gap-3 pl-1">
                    {category.items.map((tech, index) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: (categoryStartIndex + index) * 0.03,
                          duration: 0.3,
                        }}
                        className="flex items-center gap-2 cursor-default group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tech.icon}
                          alt={tech.name}
                          className="w-6 h-6 md:w-7 md:h-7 object-contain"
                        />
                        <span className="text-[10px] font-mono uppercase text-white/40 group-hover:text-orange-500 transition-colors">
                          {tech.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Thin separator */}
                  <div className="h-px bg-white/[0.04] mt-6" />
                </div>
              );
            })}
          </div>

          {/* Mobile orange divider */}
          <div className="lg:hidden h-1 bg-orange-500 my-10" />

          {/* RIGHT PAGE: GitHub — magazine sidebar */}
          <div className="lg:pl-14">
            {/* "Live" masthead */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl md:text-5xl font-black text-white/[0.07] uppercase leading-none">
                  LIVE
                </span>
                <div className="w-2 h-2 bg-orange-500 animate-pulse" />
              </div>
              <div className="h-px bg-white/20" />
            </div>

            {/* GitHub activity */}
            <GitHubActivity username={SOCIAL_LINKS.github.username} />

            {/* Index footer */}
            <div className="mt-10 pt-6 border-t border-white/[0.06]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-white/20 font-mono text-[9px] uppercase tracking-widest block mb-1">
                    Source
                  </span>
                  <span className="text-white/40 font-mono text-xs">
                    GitHub API
                  </span>
                </div>
                <div>
                  <span className="text-white/20 font-mono text-[9px] uppercase tracking-widest block mb-1">
                    Refresh
                  </span>
                  <span className="text-white/40 font-mono text-xs">
                    5 min cache
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
