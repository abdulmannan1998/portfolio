export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  color: "orange" | "blue" | "purple";
  highlights: string[];
}

export const experienceData: ExperienceItem[] = [
  {
    id: "intenseye",
    company: "INTENSEYE",
    role: "Senior Front-end Engineer",
    period: "06/2022 — 11/2025",
    color: "orange",
    highlights: [
      "Enterprise safety dashboards with React & ECharts",
      "Shadcn-based design system for the organization",
      "ReactFlow scenario builder with AI integration",
      "React Query rollout - 30% fewer bugs",
    ],
  },
  {
    id: "layermark",
    company: "LAYERMARK",
    role: "Software Engineer",
    period: "06/2021 — 04/2022",
    color: "blue",
    highlights: [
      "Geospatial visualizations with Vue.js & ArcGIS",
      "Spring Boot service for no-code platform",
      "Client satisfaction improved by 30%",
    ],
  },
  {
    id: "bilkent",
    company: "BILKENT UNIVERSITY",
    role: "B.Sc. Computer Science",
    period: "09/2018 — 06/2022",
    color: "purple",
    highlights: [
      "NITO exam monitoring system",
      "RISK game with design patterns",
      "Hospital database management lead",
    ],
  },
];
