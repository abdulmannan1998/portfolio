import Link from "next/link";
import { Github, Linkedin, Mail, Beaker } from "lucide-react";
import { MarqueeText } from "@/components/marquee-text";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { MetricsSection } from "@/components/sections/metrics-section";
import { TechAndCodeSection } from "@/components/sections/tech-and-code-section";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { GraphSectionLoader } from "@/components/sections/graph-section-loader";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { mulberry32 } from "@/lib/seeded-random";
import { RESUME_DATA } from "@/data/resume-data";
import { experienceData } from "@/data/experience";
import { techCategories } from "@/data/tech-stack";
import { fetchGitHubCommits } from "@/lib/github";

// Generate deterministic positions for background pattern (seeded PRNG prevents hydration mismatches)
const bgRandom = mulberry32(137);
const backgroundPattern = [...Array(20)].map(() => ({
  top: bgRandom() * 100,
  left: bgRandom() * 100,
  rotate: bgRandom() * 360,
}));

// ISR revalidation is configured in lib/github.ts via fetch options (revalidate: 300)
export default async function Page() {
  const commits = await fetchGitHubCommits();

  return (
    <main className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
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

      <HeroSection />

      {/* Scrolling marquee section */}
      <section className="relative bg-orange-500 py-8 -rotate-1">
        <div className="text-6xl md:text-8xl font-black text-black uppercase">
          <MarqueeText text="REACT * TYPESCRIPT * NEXT.JS * DATA VIZ * AI TOOLS *" />
        </div>
      </section>

      <AboutSection backgroundPattern={backgroundPattern} />

      {/* Impact metrics */}
      <MetricsSection metrics={RESUME_DATA.metrics} />

      {/* Tech stack + GitHub activity combined */}
      <TechAndCodeSection categories={techCategories} commits={commits} />

      {/* Experience + Career Graph side by side */}
      <section className="relative py-24 bg-stone-950">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,400px)_1fr] gap-12 lg:gap-16">
            <ExperienceTimeline experiences={experienceData} />
            <GraphSectionLoader />
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
