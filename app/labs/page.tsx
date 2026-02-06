"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Beaker, Sparkles, Zap, Code2, Rocket } from "lucide-react";

const upcomingProjects = [
  {
    title: "AI Component Generator",
    description: "Generate React components from natural language descriptions",
    icon: Sparkles,
    status: "In Development",
  },
  {
    title: "Design Token Visualizer",
    description: "Interactive tool to explore and test design tokens",
    icon: Zap,
    status: "Planned",
  },
  {
    title: "Code Pattern Library",
    description: "Curated collection of TypeScript patterns and snippets",
    icon: Code2,
    status: "Planned",
  },
  {
    title: "Performance Profiler",
    description: "Visual performance analysis for React applications",
    icon: Rocket,
    status: "Ideation",
  },
];

export default function LabsPage() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-200">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/90 backdrop-blur-lg border-b border-stone-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-2 text-purple-400">
            <Beaker className="h-5 w-5" />
            <span className="font-semibold">Labs</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            <span className="text-sm text-purple-300">Coming Soon</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="text-white">Mannan&apos;s</span>{" "}
            <span className="text-purple-400">Labs</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-stone-400 max-w-2xl mx-auto"
          >
            A playground for experimental projects, tools, and ideas.
            Mini-projects exploring the intersection of AI, design systems, and
            developer experience.
          </motion.p>
        </div>
      </section>

      {/* Upcoming Projects */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-mono text-stone-500 uppercase tracking-wider mb-8"
          >
            Upcoming Experiments
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="group relative rounded-xl border border-stone-800 bg-stone-900/50 p-6 hover:border-purple-500/30 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                      <project.icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-stone-800 text-stone-500">
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-stone-500">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="rounded-2xl border border-dashed border-stone-700 bg-stone-900/30 p-12"
          >
            <Beaker className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to be notified?
            </h3>
            <p className="text-stone-400 mb-6 max-w-md mx-auto">
              Follow me on GitHub to stay updated when new experiments drop.
            </p>
            <a
              href="https://github.com/sunnyimmortal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Follow on GitHub
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
