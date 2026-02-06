"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Terminal, Sparkles } from "lucide-react";
import { RESUME_DATA } from "@/data/resume-data";

export function AboutSection() {
  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950/95 to-stone-950 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Text content */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-orange-500/50 to-transparent max-w-16" />
              <span className="text-xs font-mono text-orange-500 uppercase tracking-[0.2em]">
                About Me
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Building interfaces that
              <span className="text-orange-500"> feel alive</span>
            </h2>

            <p className="text-lg text-stone-400 leading-relaxed">
              Senior Software Engineer with 4+ years crafting production-grade
              web applications. I specialize in turning complex data into
              intuitive visualizations and building design systems that scale.
            </p>

            <p className="text-stone-500 leading-relaxed">
              At Intenseye, I led the frontend architecture for enterprise
              safety platforms, pioneered AI-assisted development workflows, and
              mentored engineers on advanced TypeScript patterns. My work has
              driven measurable impact: 40% productivity gains, 30% bug
              reduction, and POC velocity from weeks to days.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-stone-400">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="text-sm">{RESUME_DATA.personal.location}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <Mail className="h-4 w-4 text-orange-500" />
                <span className="text-sm">{RESUME_DATA.personal.email}</span>
              </div>
            </div>
          </div>

          {/* Right: Visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-stone-800 bg-stone-900/50 p-8 backdrop-blur-sm overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-stone-600 font-mono ml-3">
                  mannan@portfolio
                </span>
              </div>

              {/* Terminal content */}
              <div className="font-mono text-sm space-y-3">
                <div className="flex items-start gap-2">
                  <Terminal className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                  <span className="text-stone-400">
                    <span className="text-emerald-400">const</span>{" "}
                    <span className="text-blue-400">mannan</span> = {"{"}
                  </span>
                </div>

                <div className="pl-8 space-y-1 text-stone-500">
                  <p>
                    <span className="text-purple-400">role</span>:{" "}
                    <span className="text-amber-300">
                      &quot;Senior Software Engineer&quot;
                    </span>
                    ,
                  </p>
                  <p>
                    <span className="text-purple-400">focus</span>: [
                    <span className="text-amber-300">
                      &quot;React&quot;, &quot;TypeScript&quot;, &quot;Data
                      Viz&quot;
                    </span>
                    ],
                  </p>
                  <p>
                    <span className="text-purple-400">passion</span>:{" "}
                    <span className="text-amber-300">
                      &quot;AI-Assisted Development&quot;
                    </span>
                    ,
                  </p>
                  <p>
                    <span className="text-purple-400">status</span>:{" "}
                    <span className="text-emerald-400">
                      &quot;Building something cool&quot;
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-400">{"}"}</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
                  <span className="text-stone-500">
                    Ready to collaborate...
                    <span className="animate-pulse">_</span>
                  </span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
