"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Beaker } from "lucide-react";

export default function LabsPage() {
  return (
    <main className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Technical grid background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Main grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Finer grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "15px 15px",
          }}
        />
        {/* Scanline effect */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
          }}
        />
      </div>

      {/* Corner markers - laboratory aesthetic */}
      <div className="fixed top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-white/10" />
      <div className="fixed top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-white/10" />
      <div className="fixed bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-white/10" />
      <div className="fixed bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-white/10" />

      {/* Navigation - brutalist style matching main site */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between p-6 md:p-8">
          <Link
            href="/"
            className="group flex items-center gap-2 text-white hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm uppercase">Back</span>
          </Link>

          <div className="flex items-center gap-2 text-white">
            <Beaker className="h-5 w-5" />
            <span className="font-black text-lg">LABS</span>
          </div>
        </div>
      </nav>

      {/* Main hero content */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6">
        {/* Floating lab identifiers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute top-32 left-8 md:left-16 font-mono text-[10px] text-white/20 space-y-1"
        >
          <div>LAB_ID: 001</div>
          <div>STATUS: INIT</div>
          <div>ENV: DEV</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="absolute top-32 right-8 md:right-16 font-mono text-[10px] text-white/20 text-right space-y-1"
        >
          <div>VER: 0.0.1</div>
          <div>BUILD: ALPHA</div>
          <div>NODE: ACTIVE</div>
        </motion.div>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 border border-orange-500/40 bg-orange-500/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full bg-orange-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 bg-orange-500" />
            </span>
            <span className="font-mono text-xs uppercase text-orange-500 tracking-wider">
              Initializing
            </span>
          </div>
        </motion.div>

        {/* Giant outlined LABS text */}
        <div className="relative">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[20vw] md:text-[15vw] font-black tracking-tighter leading-none text-center"
            style={{
              WebkitTextStroke: "2px rgba(255,255,255,0.2)",
              WebkitTextFillColor: "transparent",
            }}
          >
            LABS
          </motion.h1>

          {/* Orange accent bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-1/2 left-0 right-0 h-1 bg-orange-500 origin-left"
          />

          {/* Decorative brackets */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 text-4xl md:text-6xl font-mono text-orange-500/30"
          >
            [
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 text-4xl md:text-6xl font-mono text-orange-500/30"
          >
            ]
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-lg md:text-2xl font-mono text-orange-500 text-center uppercase tracking-wider"
        >
          Experimental Zone
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-white/40 text-center max-w-lg leading-relaxed"
        >
          A playground for experimental projects, tools, and ideas.
          Mini-projects exploring the intersection of AI, design systems, and
          developer experience.
        </motion.p>

        {/* Terminal-style coming soon message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 font-mono text-sm text-white/30"
        >
          <span className="text-orange-500">{">"}</span> experiments loading
          <span className="animate-pulse">_</span>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/20" />
          <Beaker className="h-4 w-4 text-white/20" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/20" />
        </motion.div>
      </section>

      {/* Floating geometric elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="fixed bottom-1/4 left-8 md:left-16 w-px h-32 bg-gradient-to-b from-orange-500/20 to-transparent"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="fixed bottom-1/4 right-8 md:right-16 w-px h-32 bg-gradient-to-b from-orange-500/20 to-transparent"
      />

      {/* Cross markers */}
      <motion.div
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 1.4 }}
        className="fixed top-1/3 left-1/4 text-white/5 text-6xl font-black select-none"
      >
        +
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: 45 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-1/3 right-1/4 text-white/5 text-6xl font-black select-none"
      >
        +
      </motion.div>
    </main>
  );
}
