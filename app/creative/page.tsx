"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Mail,
  ArrowLeft,
  Beaker,
  ExternalLink,
  GitCommit,
  Lock,
  Globe,
} from "lucide-react";
import { RESUME_DATA } from "@/data/resume-data";

// Lazy load React Flow graph
const GraphSection = dynamic(
  () =>
    import("@/components/sections/graph-section").then(
      (mod) => mod.GraphSection
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
  }
);

// Tech stack with icons
const techStack = [
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "Vue.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "GraphQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  },
  {
    name: "Tailwind",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    name: "Framer",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg",
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "AWS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  },
  {
    name: "Figma",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  },
  {
    name: "ECharts",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apacheecharts/apacheecharts-original.svg",
  },
  {
    name: "Prisma",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg",
  },
  {
    name: "Zustand",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "React Flow",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
];

// GitHub types
type GitHubEvent = {
  id: string;
  type: string;
  repo: { name: string; url: string };
  payload: {
    commits?: { message: string; sha: string }[];
    ref?: string;
    action?: string;
  };
  created_at: string;
  public: boolean;
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getCommitMessage(event: GitHubEvent): string {
  if (event.type === "PushEvent" && event.payload.commits?.length) {
    const message = event.payload.commits[0].message;
    return message.length > 50 ? message.substring(0, 50) + "..." : message;
  }
  if (event.type === "CreateEvent")
    return `Created ${event.payload.ref || "repository"}`;
  if (event.type === "PullRequestEvent")
    return `${event.payload.action} pull request`;
  return event.type.replace("Event", "");
}

// Marquee text component
function MarqueeText({
  text,
  direction = 1,
}: {
  text: string;
  direction?: number;
}) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="inline-flex"
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mx-4">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// Animated counter
function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/\D/g, "")) || 0;

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [numericValue]);

  return (
    <span>
      {value.startsWith("+") ? "+" : value.startsWith("-") ? "-" : ""}
      {count}
      {suffix}
    </span>
  );
}

// GitHub Activity Component (Brutalist Style)
function GitHubActivity({ username = "sunnyimmortal" }: { username?: string }) {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHubActivity() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=5`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setEvents(data);
      } catch {
        setError("Unable to load activity");
      } finally {
        setLoading(false);
      }
    }
    fetchGitHubActivity();
  }, [username]);

  const latestEvent = events[0];

  return (
    <div className="relative bg-stone-900 p-8 md:p-12">
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-orange-500" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Github className="h-8 w-8 text-white" />
            <div>
              <span className="text-white/40 font-mono text-xs uppercase tracking-wider">
                Live Feed
              </span>
              <h3 className="text-2xl font-black text-white">GITHUB</h3>
            </div>
          </div>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold text-sm hover:bg-orange-500 transition-colors"
          >
            VIEW PROFILE
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Latest Push */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
              Latest Push
            </span>
            {!loading && latestEvent && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-500 text-black text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                {formatTimeAgo(latestEvent.created_at)}
              </span>
            )}
          </div>

          {loading ? (
            <div className="h-8 w-3/4 bg-white/10 animate-pulse" />
          ) : error ? (
            <p className="text-white/40 font-mono">{error}</p>
          ) : latestEvent ? (
            <>
              <p className="text-2xl md:text-3xl text-white font-black leading-tight mb-4">
                &quot;{getCommitMessage(latestEvent)}&quot;
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-white/40 font-mono">REPO:</span>
                {latestEvent.public ? (
                  <a
                    href={`https://github.com/${latestEvent.repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1 font-bold"
                  >
                    <Globe className="h-3 w-3" />
                    {latestEvent.repo.name.split("/")[1]}
                  </a>
                ) : (
                  <span className="text-orange-500 flex items-center gap-1 font-bold">
                    <Lock className="h-3 w-3" />
                    PRIVATE
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="text-white/40 font-mono">No recent activity</p>
          )}
        </div>

        {/* Recent Activity */}
        {!loading && events.length > 1 && (
          <div className="pt-8 border-t border-white/10">
            <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-4">
              Recent Activity
            </p>
            <div className="space-y-3">
              {events.slice(1, 4).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 text-sm"
                >
                  <GitCommit className="h-4 w-4 text-white/40" />
                  <span className="text-white/60 truncate flex-1 font-mono">
                    {getCommitMessage(event)}
                  </span>
                  <span className="text-white/40 text-xs font-mono">
                    {formatTimeAgo(event.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreativePage() {
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
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-mono uppercase">Standard View</span>
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
            href="https://github.com/sunnyimmortal"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Github className="h-6 w-6" />
            <span className="font-mono text-sm uppercase">Github</span>
          </a>
          <a
            href="https://linkedin.com/in/mannanabdul"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Linkedin className="h-6 w-6" />
            <span className="font-mono text-sm uppercase">LinkedIn</span>
          </a>
          <a
            href="mailto:abdul.1998.17@gmail.com"
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
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-8xl font-black text-white/5"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
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

      {/* Experience timeline - Vertical */}
      <section className="relative py-24 bg-stone-950">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">
            Journey
          </span>
          <h2 className="text-5xl md:text-6xl font-black mt-2 mb-16">
            EXPERIENCE
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/20" />

            {/* Intenseye */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative pl-12 pb-16"
            >
              <div className="absolute left-0 top-2 w-3 h-3 bg-orange-500 -translate-x-1/2" />
              <span className="text-white/40 font-mono text-sm">
                06/2022 — 11/2025
              </span>
              <h3 className="text-3xl font-black mt-2">INTENSEYE</h3>
              <p className="text-orange-500 font-mono text-sm mt-1">
                Senior Front-end Engineer
              </p>
              <ul className="mt-4 space-y-2 text-white/60">
                <li>* Enterprise safety dashboards with React & ECharts</li>
                <li>* Shadcn-based design system for the organization</li>
                <li>* ReactFlow scenario builder with AI integration</li>
                <li>* React Query rollout - 30% fewer bugs</li>
              </ul>
            </motion.div>

            {/* Layermark */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative pl-12 pb-16"
            >
              <div className="absolute left-0 top-2 w-3 h-3 bg-blue-500 -translate-x-1/2" />
              <span className="text-white/40 font-mono text-sm">
                06/2021 — 04/2022
              </span>
              <h3 className="text-3xl font-black mt-2">LAYERMARK</h3>
              <p className="text-blue-500 font-mono text-sm mt-1">
                Software Engineer
              </p>
              <ul className="mt-4 space-y-2 text-white/60">
                <li>* Geospatial visualizations with Vue.js & ArcGIS</li>
                <li>* Spring Boot service for no-code platform</li>
                <li>* Client satisfaction improved by 30%</li>
              </ul>
            </motion.div>

            {/* Bilkent */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative pl-12"
            >
              <div className="absolute left-0 top-2 w-3 h-3 bg-purple-500 -translate-x-1/2" />
              <span className="text-white/40 font-mono text-sm">
                09/2018 — 06/2022
              </span>
              <h3 className="text-3xl font-black mt-2">BILKENT UNIVERSITY</h3>
              <p className="text-purple-500 font-mono text-sm mt-1">
                B.Sc. Computer Science
              </p>
              <ul className="mt-4 space-y-2 text-white/60">
                <li>* NITO exam monitoring system</li>
                <li>* RISK game with design patterns</li>
                <li>* Hospital database management lead</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics section - Horizontal scroll cards */}
      <section className="relative py-24 bg-black">
        <div className="px-6 md:px-12 mb-12">
          <span className="text-orange-500 font-mono text-sm uppercase tracking-widest">
            Impact
          </span>
          <h2 className="text-5xl md:text-6xl font-black mt-2">
            MEASURABLE RESULTS
          </h2>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div
            className="flex gap-6 px-6 md:px-12 pb-6"
            style={{ width: "max-content" }}
          >
            {RESUME_DATA.metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative w-80 h-96 bg-stone-900 rounded-none p-8 flex flex-col justify-between group hover:bg-stone-800 transition-colors"
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500" />

                <div>
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                    {metric.company}
                  </span>
                  <h3 className="text-xl font-bold text-white/80 mt-2">
                    {metric.label}
                  </h3>
                </div>

                <div>
                  <div className="text-6xl font-black text-orange-500 mb-4">
                    {metric.value.includes("→") ? (
                      metric.value
                    ) : (
                      <AnimatedCounter
                        value={metric.value}
                        suffix={metric.value.includes("%") ? "%" : ""}
                      />
                    )}
                  </div>
                  <p className="text-white/50 text-sm">{metric.context}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            <GitHubActivity username="sunnyimmortal" />

            {/* Social CTAs */}
            <div className="grid grid-rows-2 gap-6">
              {/* GitHub CTA */}
              <a
                href="https://github.com/sunnyimmortal"
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
                href="https://linkedin.com/in/mannanabdul"
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
              href="mailto:abdul.1998.17@gmail.com"
              className="px-8 py-4 bg-black text-white font-bold text-lg hover:bg-stone-900 transition-colors"
            >
              GET IN TOUCH
            </a>
            <a
              href="https://github.com/sunnyimmortal"
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
