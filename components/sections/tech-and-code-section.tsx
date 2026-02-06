"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, ExternalLink } from "lucide-react";
import { techCategories } from "@/data/tech-stack";
import { GitHubActivity } from "@/components/github-activity";
import { SOCIAL_LINKS } from "@/lib/social-links";

// Precompute animation offset per category (cumulative icon count)
const categoryOffsets = techCategories.reduce<number[]>((acc, cat, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + techCategories[i - 1].items.length);
  return acc;
}, []);

export function TechAndCodeSection() {
  return (
    <section className="relative py-24 bg-black">
      <div className="px-6 md:px-12 mb-16">
        <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">
          Technologies
        </span>
        <h2 className="text-5xl md:text-6xl font-black mt-2">STACK & CODE</h2>
      </div>

      <div className="px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left Column - Tech Stack */}
          <div className="space-y-8">
            {techCategories.map((category, catIndex) => {
              const categoryStartIndex = categoryOffsets[catIndex];

              return (
                <div key={category.name}>
                  {/* Category label with orange left border accent */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-0.5 h-4 bg-orange-500" />
                    <span className="text-white/40 font-mono text-xs uppercase tracking-widest">
                      {category.name}
                    </span>
                  </div>

                  {/* Icon grid */}
                  <div className="flex flex-wrap gap-3">
                    {category.items.map((tech, index) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: (categoryStartIndex + index) * 0.03,
                          duration: 0.3,
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="group flex flex-col items-center gap-2 w-20 cursor-default"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tech.icon}
                          alt={tech.name}
                          className="w-10 h-10 object-contain"
                        />
                        <span className="text-[10px] font-mono uppercase text-white/50 group-hover:text-orange-500 transition-colors text-center leading-tight">
                          {tech.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column - Activity Panel */}
          <div className="space-y-6">
            {/* Card 1: GitHub Live Feed */}
            <GitHubActivity username={SOCIAL_LINKS.github.username} />

            {/* Card 2: Social CTAs */}
            <div className="space-y-3">
              {/* GitHub CTA */}
              <a
                href={SOCIAL_LINKS.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between bg-stone-900 p-4 hover:bg-stone-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Github className="h-6 w-6 text-white" />
                  <div>
                    <h4 className="text-sm font-black text-white">GITHUB</h4>
                    <p className="text-xs text-white/40 font-mono">
                      VIEW OPEN SOURCE WORK
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-orange-500 transition-colors" />
              </a>

              {/* LinkedIn CTA */}
              <a
                href={SOCIAL_LINKS.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between bg-stone-900 p-4 hover:bg-stone-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Linkedin className="h-6 w-6 text-blue-400" />
                  <div>
                    <h4 className="text-sm font-black text-white">LINKEDIN</h4>
                    <p className="text-xs text-white/40 font-mono">
                      CONNECT PROFESSIONALLY
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-blue-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
