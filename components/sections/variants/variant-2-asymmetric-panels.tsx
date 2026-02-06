"use client";

import { motion } from "framer-motion";
import { techCategories } from "@/data/tech-stack";
import { GitHubActivity } from "@/components/github-activity";
import { SOCIAL_LINKS } from "@/lib/social-links";

const categoryOffsets = techCategories.reduce<number[]>((acc, cat, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + techCategories[i - 1].items.length);
  return acc;
}, []);

export function Variant2AsymmetricPanels() {
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* LEFT: Tech Stack — 3/5 width (60%) */}
          <div className="lg:col-span-3">
            {/* Horizontal category rows — inline layout */}
            <div className="space-y-0">
              {techCategories.map((category, catIndex) => {
                const categoryStartIndex = categoryOffsets[catIndex];
                return (
                  <div
                    key={category.name}
                    className="border-b border-white/[0.06] py-5 first:pt-0 last:border-b-0"
                  >
                    {/* Category label — left-aligned, small */}
                    <span className="text-white/25 font-mono text-[10px] uppercase tracking-[0.2em] mb-3 block">
                      {category.name}
                    </span>

                    {/* Inline tech items — horizontal flow */}
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                      {category.items.map((tech, index) => (
                        <motion.div
                          key={tech.name}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: (categoryStartIndex + index) * 0.04,
                            duration: 0.3,
                          }}
                          className="flex items-center gap-2 group cursor-default"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={tech.icon}
                            alt={tech.name}
                            className="w-5 h-5 object-contain"
                          />
                          <span className="text-xs font-mono text-white/50 group-hover:text-orange-500 transition-colors uppercase">
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

          {/* DIVIDER: Thick orange vertical bar */}
          <div className="hidden lg:flex items-stretch justify-center">
            <div className="w-1 bg-orange-500 self-stretch" />
          </div>
          {/* Mobile divider */}
          <div className="lg:hidden h-1 bg-orange-500 my-8" />

          {/* RIGHT: GitHub Activity — 1/5 width (but expands into divider col) */}
          <div className="lg:col-span-1 flex flex-col justify-center lg:pl-8">
            <GitHubActivity username={SOCIAL_LINKS.github.username} />
          </div>
        </div>
      </div>
    </section>
  );
}
