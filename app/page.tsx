"use client";

import dynamic from "next/dynamic";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { MetricsSection } from "@/components/sections/metrics-section";
import { FooterSection } from "@/components/sections/footer-section";

// Lazy load heavy components
const GraphSection = dynamic(
  () =>
    import("@/components/sections/graph-section").then(
      (mod) => mod.GraphSection
    ),
  {
    ssr: false,
    loading: () => (
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="h-[600px] rounded-xl border border-stone-800 bg-stone-900/50 animate-pulse flex items-center justify-center">
            <span className="text-stone-500 font-mono text-sm">
              Loading interactive graph...
            </span>
          </div>
        </div>
      </section>
    ),
  }
);

const GitHubActivitySection = dynamic(
  () =>
    import("@/components/sections/github-activity-section").then(
      (mod) => mod.GitHubActivitySection
    ),
  {
    ssr: false,
    loading: () => (
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="h-64 rounded-xl border border-stone-800 bg-stone-900/50 animate-pulse" />
        </div>
      </section>
    ),
  }
);

export default function Page() {
  return (
    <main className="relative min-h-screen bg-stone-950 font-sans text-stone-200 selection:bg-orange-500/30">
      <Navigation />

      <HeroSection />

      <div id="about">
        <AboutSection />
      </div>

      <div id="stack">
        <TechStackSection />
      </div>

      <div id="experience">
        <ExperienceSection />
      </div>

      <GraphSection />

      <GitHubActivitySection username="sunnyimmortal" />

      <MetricsSection />

      <FooterSection />
    </main>
  );
}
