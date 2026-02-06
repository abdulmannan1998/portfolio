"use client";

import { motion } from "framer-motion";
import { techCategories } from "@/data/tech-stack";
import { GitHubActivity } from "@/components/github-activity";
import { SOCIAL_LINKS } from "@/lib/social-links";

const categoryOffsets = techCategories.reduce<number[]>((acc, cat, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + techCategories[i - 1].items.length);
  return acc;
}, []);

export function Variant3NewspaperEditorial() {
  return (
    <section className="relative py-24 bg-black">
      {/* Section header — editorial masthead style */}
      <div className="px-6 md:px-12 mb-4">
        <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">
          Technologies
        </span>
        <h2 className="text-5xl md:text-6xl font-black mt-2">STACK & CODE</h2>
      </div>

      {/* Double rule line — newspaper style */}
      <div className="mx-6 md:mx-12 mb-10">
        <div className="h-px bg-white/40" />
        <div className="h-px bg-white/40 mt-[3px]" />
      </div>

      <div className="px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* LEFT: Tech Classifieds — 8/12 columns */}
          <div className="lg:col-span-8 lg:pr-8 lg:border-r border-white/10">
            {/* Dense multi-column classified layout */}
            <div className="space-y-6">
              {techCategories.map((category, catIndex) => {
                const categoryStartIndex = categoryOffsets[catIndex];
                return (
                  <div key={category.name}>
                    {/* Category header — black bg label */}
                    <div className="inline-block bg-white px-3 py-1 mb-3">
                      <span className="text-black font-black text-[11px] uppercase tracking-wider">
                        {category.name}
                      </span>
                    </div>

                    {/* Dense grid — newspaper column feel */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                      {category.items.map((tech, index) => (
                        <motion.div
                          key={tech.name}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: (categoryStartIndex + index) * 0.03,
                            duration: 0.4,
                          }}
                          className="flex items-center gap-2 py-1 border-b border-white/[0.04] group cursor-default"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={tech.icon}
                            alt={tech.name}
                            className="w-4 h-4 object-contain shrink-0"
                          />
                          <span className="text-[11px] font-mono text-white/60 group-hover:text-orange-500 transition-colors uppercase truncate">
                            {tech.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Thin rule after each category */}
                    <div className="h-px bg-white/[0.06] mt-4" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Dispatch Sidebar — 4/12 columns */}
          <div className="lg:col-span-4 lg:pl-8 mt-10 lg:mt-0">
            {/* Dispatch header */}
            <div className="mb-6">
              <div className="inline-block bg-orange-500 px-3 py-1 mb-2">
                <span className="text-black font-black text-[11px] uppercase tracking-wider">
                  DISPATCH
                </span>
              </div>
              <div className="h-px bg-white/20 mt-2" />
            </div>

            <GitHubActivity username={SOCIAL_LINKS.github.username} />

            {/* Bottom editorial flourish */}
            <div className="mt-8 pt-4 border-t border-white/10">
              <p className="text-white/20 font-mono text-[9px] uppercase tracking-widest">
                Updated in real-time via GitHub API
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom double rule */}
      <div className="mx-6 md:mx-12 mt-16">
        <div className="h-px bg-white/40" />
        <div className="h-px bg-white/40 mt-[3px]" />
      </div>
    </section>
  );
}
