"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Mail, Beaker, ExternalLink } from "lucide-react";
import { techStack } from "@/data/tech-stack";
import { MarqueeText } from "@/components/marquee-text";
import { GitHubActivity } from "@/components/github-activity";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { MetricsSection } from "@/components/sections/metrics-section";
import { SOCIAL_LINKS } from "@/lib/social-links";

// Lazy load React Flow graph
const GraphSection = dynamic(
  () =>
    import("@/components/sections/graph-section").then(
      (mod) => mod.GraphSection,
    ),
  {
    ssr: false,
    loading: () => (
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="h-[600px] bg-stone-900 animate-pulse flex items-center justify-center">
            <span className="text-white/40 font-mono text-sm uppercase">
              Loading graph...
            </span>
          </div>
        </div>
      </section>
    ),
  },
);

// Generate random positions once for background pattern
const backgroundPattern = [...Array(20)].map(() => ({
  top: Math.random() * 100,
  left: Math.random() * 100,
  rotate: Math.random() * 360,
}));

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden"
    >
      {/* Fixed navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between p-6 md:p-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity"
          >
            <span className="text-lg font-black">MANNAN</span>
          </Link>

          <div className="flex items-center gap-6">
            {/* Labs Button with SOON badge */}
            <Link
              href="/labs"
              className="group relative flex items-center gap-2 px-4 py-2 border-2 border-dashed border-white/30 text-white hover:border-orange-500 hover:text-orange-500 transition-all"
            >
              <Beaker className="h-4 w-4" />
              <span className="font-mono text-sm uppercase">Labs</span>
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold bg-orange-500 text-black">
                SOON
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section - Brutalist typography */}
      <motion.section
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="sticky top-0 min-h-screen flex flex-col justify-center items-center px-6 bg-black"
      >
        {/* Giant name */}
        <div className="relative">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[15vw] md:text-[12vw] font-black tracking-tighter leading-none text-center"
            style={{
              WebkitTextStroke: "2px rgba(255,255,255,0.3)",
              WebkitTextFillColor: "transparent",
            }}
          >
            MANNAN
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-1/2 left-0 right-0 h-1 bg-orange-500 origin-left"
          />
        </div>

        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-2xl md:text-4xl font-mono text-orange-500 text-center"
        >
          SENIOR SOFTWARE ENGINEER
        </motion.p>

        {/* Social links */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex items-center gap-8"
        >
          <a
            href={SOCIAL_LINKS.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Github className="h-6 w-6" />
            <span className="font-mono text-sm uppercase">Github</span>
          </a>
          <a
            href={SOCIAL_LINKS.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Linkedin className="h-6 w-6" />
            <span className="font-mono text-sm uppercase">LinkedIn</span>
          </a>
          <a
            href={SOCIAL_LINKS.email.mailto}
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Mail className="h-6 w-6" />
            <span className="font-mono text-sm uppercase">Email</span>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* Scrolling marquee section */}
      <section className="relative bg-orange-500 py-8 -rotate-1">
        <div className="text-6xl md:text-8xl font-black text-black uppercase">
          <MarqueeText text="REACT * TYPESCRIPT * NEXT.JS * DATA VIZ * AI TOOLS *" />
        </div>
      </section>

      {/* About section - Split screen */}
      <section className="relative min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Left - Image/Pattern */}
        <div className="relative bg-stone-900 flex items-center justify-center p-12">
          <div className="absolute inset-0 opacity-20">
            {backgroundPattern.map((pos, i) => (
              <div
                key={i}
                className="absolute text-8xl font-black text-white/5"
                style={{
                  top: `${pos.top}%`,
                  left: `${pos.left}%`,
                  transform: `rotate(${pos.rotate}deg)`,
                }}
              >
                M
              </div>
            ))}
          </div>
          <div className="relative text-center">
            <span className="text-[200px] md:text-[300px] font-black text-white/10">
              4+
            </span>
            <p className="absolute bottom-1/3 left-1/2 -translate-x-1/2 text-2xl font-mono text-white/60">
              YEARS OF EXPERIENCE
            </p>
          </div>
        </div>

        {/* Right - Text */}
        <div className="relative bg-black flex items-center p-12 md:p-16">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-orange-500 font-mono text-sm uppercase tracking-widest"
            >
              About
            </motion.span>
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-black mt-4 mb-8 leading-tight"
            >
              BUILDING
              <br />
              <span className="text-orange-500">INTERFACES</span>
              <br />
              THAT FEEL ALIVE
            </motion.h2>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white/60 text-lg leading-relaxed max-w-md"
            >
              Senior Software Engineer specializing in React, TypeScript, and
              data visualization. I turn complex data into intuitive experiences
              and build design systems that scale.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Tech stack - Grid layout with icons */}
      <section className="relative py-24 bg-black">
        <div className="px-6 md:px-12 mb-16">
          <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">
            Technologies
          </span>
          <h2 className="text-5xl md:text-6xl font-black mt-2">MY STACK</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-white/10">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ backgroundColor: "rgba(249, 115, 22, 0.1)" }}
              className="bg-black p-6 md:p-8 flex flex-col items-center justify-center gap-3 group cursor-default"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tech.icon}
                alt={tech.name}
                className="w-10 h-10 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-white/60 group-hover:text-orange-500 transition-colors font-mono text-xs md:text-sm text-center uppercase">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience timeline */}
      <ExperienceTimeline />

      {/* Metrics section */}
      <MetricsSection />

      {/* React Flow Graph Section */}
      <section className="relative py-24 bg-stone-950">
        <div className="px-6 md:px-12 mb-12">
          <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">
            Interactive
          </span>
          <h2 className="text-5xl md:text-6xl font-black mt-2">CAREER GRAPH</h2>
          <p className="text-white/60 mt-4 max-w-xl">
            Explore my career journey through an interactive node graph. Click
            on achievements to reveal detailed insights.
          </p>
        </div>
        <GraphSection />
      </section>

      {/* GitHub Activity Section */}
      <section className="relative py-24 bg-black">
        <div className="px-6 md:px-12 mb-12">
          <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">
            Activity
          </span>
          <h2 className="text-5xl md:text-6xl font-black mt-2">LIVE CODE</h2>
        </div>

        <div className="px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GitHub Activity */}
            <GitHubActivity username={SOCIAL_LINKS.github.username} />

            {/* Social CTAs */}
            <div className="grid grid-rows-2 gap-6">
              {/* GitHub CTA */}
              <a
                href={SOCIAL_LINKS.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between bg-stone-900 p-8 hover:bg-stone-800 transition-colors"
              >
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 group-hover:bg-orange-500 transition-colors" />
                <div className="relative flex items-center gap-4">
                  <Github className="h-10 w-10 text-white" />
                  <div>
                    <h4 className="text-xl font-black text-white">GITHUB</h4>
                    <p className="text-sm text-white/40 font-mono">
                      VIEW OPEN SOURCE WORK
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-6 w-6 text-white/40 group-hover:text-white transition-colors" />
              </a>

              {/* LinkedIn CTA */}
              <a
                href={SOCIAL_LINKS.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between bg-stone-900 p-8 hover:bg-stone-800 transition-colors"
              >
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
                <div className="relative flex items-center gap-4">
                  <Linkedin className="h-10 w-10 text-blue-400" />
                  <div>
                    <h4 className="text-xl font-black text-white">LINKEDIN</h4>
                    <p className="text-sm text-white/40 font-mono">
                      CONNECT PROFESSIONALLY
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-6 w-6 text-white/40 group-hover:text-blue-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Footer */}
      <section className="relative py-24 bg-orange-500">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-5xl md:text-7xl font-black text-black mb-8">
            LET&apos;S BUILD
            <br />
            SOMETHING GREAT
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href={SOCIAL_LINKS.email.mailto}
              className="px-8 py-4 bg-black text-white font-bold text-lg hover:bg-stone-900 transition-colors"
            >
              GET IN TOUCH
            </a>
            <a
              href={SOCIAL_LINKS.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent border-2 border-black text-black font-bold text-lg hover:bg-black hover:text-white transition-colors"
            >
              VIEW GITHUB
            </a>
          </div>
        </div>
      </section>

      {/* Bottom marquee */}
      <section className="bg-black py-6 border-t border-white/10">
        <div className="text-4xl font-black text-white/20 uppercase">
          <MarqueeText
            text="MANNAN ABDUL * SENIOR SOFTWARE ENGINEER * LAHORE, PAKISTAN *"
            direction={-1}
          />
        </div>
      </section>
    </main>
  );
}
