export type Term =
  | "Intenseye"
  | "Layermark"
  | "Bilkent University"
  | "React"
  | "Next.js"
  | "TypeScript"
  | "React Query"
  | "Zustand"
  | "Jotai"
  | "Tailwind"
  | "Shadcn"
  | "Framer Motion"
  | "ECharts"
  | "React Flow"
  | "Vue.js"
  | "ArcGIS"
  | "Node.js"
  | "GraphQL"
  | "TRPC";

export type Highlight = {
  id: string;
  text: string;
  metric?: string; // e.g. "40%", "30%"
  type: "achievement" | "responsibility";
};

export type Role = {
  company: string;
  title: string;
  period: string;
  highlights: Highlight[];
};

export const RESUME_DATA = {
  personal: {
    name: "Mannan Abdul",
    title: "Senior Software Engineer",
    location: "Lahore, Pakistan",
    email: "abdul.1998.17@gmail.com",
    github: "Github",
    linkedin: "LinkedIn",
  },
  metrics: [
    {
      id: "productivity",
      label: "Team Productivity",
      value: "+40%",
      context: "Internal tooling automation",
      company: "Intenseye",
    },
    {
      id: "bugs",
      label: "Bug Reduction",
      value: "-30%",
      context: "Data-fetching bugs via React Query",
      company: "Intenseye",
    },
    {
      id: "poc",
      label: "POC Velocity",
      value: "Weeks → Days",
      context: "AI-assisted development tools",
      company: "Intenseye",
    },
    {
      id: "typesafety",
      label: "Type Safety",
      value: "+20%",
      context: "Advanced patterns & mentoring",
      company: "Intenseye",
    },
    {
      id: "client-sat",
      label: "Client Satisfaction",
      value: "+30%",
      context: "Bridging technical/design gaps",
      company: "Layermark",
    },
  ],
  roles: [
    {
      company: "Intenseye",
      title: "Senior Front-end Engineer",
      period: "06/2022 - 11/2025",
      highlights: [
        {
          id: "dashboard",
          text: "Built dynamic, interactive dashboards and data visualizations using React, TypeScript and ECharts.",
          type: "responsibility",
        },
        {
          id: "konva",
          text: "Designed and shipped a foundational React Konva canvas component for drawing and visualization.",
          type: "achievement",
        },
        {
          id: "design-system",
          text: "Built a Shadcn-based design system composed of reusable UI components and design tokens.",
          type: "achievement",
        },
        {
          id: "react-flow",
          text: "Engineered a safety scenario builder using ReactFlow, integrating a chat interface powered by Vercel AI SDK.",
          type: "achievement",
        },
        {
          id: "cross-team",
          text: "Ensured high-quality delivery of a major cross-team feature by independently coordinating requirements.",
          type: "responsibility",
        },
      ],
    },
    {
      company: "Layermark",
      title: "Front-end Engineer",
      period: "09/2021 - 04/2022",
      highlights: [
        {
          id: "geospatial",
          text: "Developed custom dashboards and geospatial visualizations using Vue.js and ArcGIS.",
          type: "achievement",
        },
        {
          id: "persistence",
          text: "Implemented robust application persistence layers using Hibernate and Spring Data JPA.",
          type: "responsibility",
        },
      ],
    },
  ],
  graph: {
    nodes: [
      { id: "Mannan", label: "Mannan Abdul", type: "root" },
      { id: "Intenseye", label: "Intenseye", type: "company" },
      { id: "Layermark", label: "Layermark", type: "company" },
      { id: "React", label: "React", type: "tech", priority: 1 },
      { id: "TypeScript", label: "TypeScript", type: "tech", priority: 1 },
      { id: "Next.js", label: "Next.js", type: "tech", priority: 1 },
      { id: "React Query", label: "React Query", type: "tech", priority: 2 },
      { id: "React Flow", label: "React Flow", type: "tech", priority: 2 },
      { id: "ECharts", label: "ECharts", type: "tech", priority: 3 },
      { id: "Konva", label: "Konva", type: "tech", priority: 3 },
      { id: "Vue.js", label: "Vue.js", type: "tech", priority: 1 },
      { id: "ArcGIS", label: "ArcGIS", type: "tech", priority: 1 },
      { id: "Shadcn", label: "Shadcn UI", type: "tech", priority: 2 },
      { id: "Bilkent", label: "Bilkent Univ.", type: "education" },
    ],
    edges: [
      { source: "Mannan", target: "Intenseye" },
      { source: "Mannan", target: "Layermark" },
      { source: "Mannan", target: "Bilkent" },
      { source: "Intenseye", target: "React" },
      { source: "Intenseye", target: "TypeScript" },
      { source: "Intenseye", target: "Next.js" },
      { source: "Intenseye", target: "React Query" },
      { source: "Intenseye", target: "React Flow" },
      { source: "Intenseye", target: "ECharts" },
      { source: "Intenseye", target: "Konva" },
      { source: "Intenseye", target: "Shadcn" },
      { source: "Layermark", target: "Vue.js" },
      { source: "Layermark", target: "ArcGIS" },
    ],
  },
  easterEggs: [
    "Scanning Intenseye internal tools...",
    "Verifying ReactFlow canvas bounds...",
    "Optimizing Webpack configs...",
    "Hydrating React Query cache...",
    "Loading Shadcn design tokens...",
    "Compiling TypeScript definitions...",
    "Analyzing Vue.js migration paths...",
    "Establishing geospatial coordinates...",
    "Injecting ECharts dependencies...",
    "Booting Engineer's Lab...",
  ],
};
