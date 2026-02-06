"use client";

import { motion } from "framer-motion";
import { Building2, GraduationCap, Calendar, ChevronRight } from "lucide-react";
import { RESUME_DATA } from "@/data/resume-data";

const experiences = [
  {
    type: "work" as const,
    company: "Intenseye",
    title: "Senior Front-end Engineer",
    period: "06/2022 - 11/2025",
    highlights: [
      "Built enterprise safety dashboards with React & ECharts",
      "Created Shadcn-based design system used across the org",
      "Engineered ReactFlow scenario builder with AI integration",
      "Led React Query rollout, reducing bugs by 30%",
    ],
    color: "blue",
  },
  {
    type: "work" as const,
    company: "Layermark",
    title: "Software Engineer",
    period: "06/2021 - 04/2022",
    highlights: [
      "Built geospatial visualizations with Vue.js & ArcGIS",
      "Developed Spring Boot service for no-code platform",
      "Improved client satisfaction by 30%",
    ],
    color: "emerald",
  },
  {
    type: "education" as const,
    company: "Bilkent University",
    title: "B.Sc. Computer Science",
    period: "09/2018 - 06/2022",
    highlights: [
      "NITO - Exam monitoring system with anti-cheating",
      "RISK game with OOP design patterns",
      "Hospital DB management system lead",
    ],
    color: "purple",
  },
];

export function ExperienceSection() {
  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24">
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900/30 to-stone-950" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-orange-500/50 to-transparent max-w-16" />
            <span className="text-xs font-mono text-orange-500 uppercase tracking-[0.2em]">
              Journey
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Experience & Education
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/50 via-stone-700 to-transparent md:-translate-x-px" />

          {/* Experience items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 ${
                  index % 2 === 0 ? "" : "md:direction-rtl"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 md:left-1/2 w-3 h-3 -translate-x-1/2 rounded-full bg-orange-500 ring-4 ring-stone-950 z-10 top-8" />

                {/* Card */}
                <div
                  className={`ml-12 md:ml-0 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12 md:col-start-2"}`}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group relative rounded-xl border border-stone-800 bg-stone-900/50 p-6 hover:border-stone-700 transition-all overflow-hidden"
                  >
                    {/* Gradient overlay on hover */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${
                        exp.color === "blue"
                          ? "from-blue-500/5"
                          : exp.color === "emerald"
                            ? "from-emerald-500/5"
                            : "from-purple-500/5"
                      } to-transparent`}
                    />

                    <div className="relative">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                            exp.color === "blue"
                              ? "bg-blue-500/10 ring-1 ring-blue-500/30"
                              : exp.color === "emerald"
                                ? "bg-emerald-500/10 ring-1 ring-emerald-500/30"
                                : "bg-purple-500/10 ring-1 ring-purple-500/30"
                          }`}
                        >
                          {exp.type === "work" ? (
                            <Building2
                              className={`h-6 w-6 ${
                                exp.color === "blue"
                                  ? "text-blue-500"
                                  : "text-emerald-500"
                              }`}
                            />
                          ) : (
                            <GraduationCap className="h-6 w-6 text-purple-500" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white truncate">
                            {exp.company}
                          </h3>
                          <p className="text-stone-400">{exp.title}</p>
                        </div>
                      </div>

                      {/* Period */}
                      <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
                        <Calendar className="h-4 w-4" />
                        <span className="font-mono">{exp.period}</span>
                      </div>

                      {/* Highlights */}
                      <ul className="space-y-2">
                        {exp.highlights.map((highlight, hIndex) => (
                          <li
                            key={hIndex}
                            className="flex items-start gap-2 text-sm text-stone-400"
                          >
                            <ChevronRight
                              className={`h-4 w-4 shrink-0 mt-0.5 ${
                                exp.color === "blue"
                                  ? "text-blue-500/70"
                                  : exp.color === "emerald"
                                    ? "text-emerald-500/70"
                                    : "text-purple-500/70"
                              }`}
                            />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
