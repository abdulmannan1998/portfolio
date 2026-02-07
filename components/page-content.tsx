"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Mail, Beaker } from "lucide-react";
import { MarqueeText } from "@/components/marquee-text";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { MetricsSection } from "@/components/sections/metrics-section";
import { TechAndCodeSection } from "@/components/sections/tech-and-code-section";
import { HeroSection } from "@/components/sections/hero-section";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { mulberry32 } from "@/lib/seeded-random";
import type { RedactedCommit } from "@/lib/github";

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

// Generate deterministic positions for background pattern (seeded PRNG prevents hydration mismatches)
const bgRandom = mulberry32(137);
const backgroundPattern = [...Array(20)].map(() => ({
  top: bgRandom() * 100,
  left: bgRandom() * 100,
  rotate: bgRandom() * 360,
}));

type PageContentProps = {
  commits: RedactedCommit[];
};

export function PageContent({ commits }: PageContentProps) {
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
            <span className="text-lg font-black">PORTFOLIO</span>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href={SOCIAL_LINKS.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-orange-500 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-orange-500 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.email.mailto}
              className="text-white hover:text-orange-500 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
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

      <HeroSection heroScale={heroScale} heroOpacity={heroOpacity} />

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
              className="text-white/60 text-lg leading-relaxed max-w-md mb-4"
            >
              I build data-dense dashboards, complex state systems, and the
              architectural scaffolding that makes frontend codebases scale. My
              work tends toward the internal tooling and pattern-setting that
              raises the ceiling for entire engineering teams.
            </motion.p>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-white/60 text-lg leading-relaxed max-w-md"
            >
              I tend to be the engineer who gets routed the unclear or difficult
              problems — the ones other developers would rather avoid.
              That&apos;s where I do my best work: absorbing complexity and
              turning it into something maintainable.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Impact metrics */}
      <MetricsSection />

      {/* Tech stack + GitHub activity combined */}
      <TechAndCodeSection commits={commits} />

      {/* Experience + Career Graph side by side */}
      <section className="relative py-24 bg-stone-950">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,400px)_1fr] gap-12 lg:gap-16">
            <ExperienceTimeline />
            <GraphSection />
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
