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

export type AchievementCategory =
  | "dashboard"
  | "tooling"
  | "design-system"
  | "architecture"
  | "innovation";

export type AchievementNode = {
  id: string;
  type: "achievement";
  title: string;
  description: string;
  impact: string;
  technologies: string[];
  company: string;
  period: string;
  category: AchievementCategory;
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
      relatedAchievements: ["intenseye-cli-tooling"],
      relatedTechnologies: ["Node.js", "TypeScript"],
    },
    {
      id: "bugs",
      label: "Bug Reduction",
      value: "-30%",
      context: "Data-fetching bugs via React Query",
      company: "Intenseye",
      relatedAchievements: ["intenseye-react-query"],
      relatedTechnologies: ["React Query", "TypeScript", "React"],
    },
    {
      id: "poc",
      label: "POC Velocity",
      value: "Weeks → Days",
      context: "AI-assisted development tools",
      company: "Intenseye",
      relatedAchievements: ["intenseye-ai-poc"],
      relatedTechnologies: ["Next.js", "TypeScript"],
    },
    {
      id: "typesafety",
      label: "Type Safety",
      value: "+20%",
      context: "Advanced patterns & mentoring",
      company: "Intenseye",
      relatedAchievements: ["intenseye-type-safety"],
      relatedTechnologies: ["TypeScript", "React"],
    },
    {
      id: "client-sat",
      label: "Client Satisfaction",
      value: "+30%",
      context: "Bridging technical/design gaps",
      company: "Layermark",
      relatedAchievements: ["layermark-client-bridge"],
      relatedTechnologies: ["Vue.js"],
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
  achievements: [
    // Intenseye Achievements
    {
      id: "intenseye-dashboards",
      type: "achievement" as const,
      title: "Interactive Dashboards & Data Viz",
      description:
        "Built dynamic, interactive dashboards and data visualizations using React, TypeScript and ECharts.",
      impact: "Core product feature",
      technologies: ["React", "TypeScript", "ECharts"],
      company: "Intenseye",
      period: "2022-2025",
      category: "dashboard" as const,
    },
    {
      id: "intenseye-cli-tooling",
      type: "achievement" as const,
      title: "Internal CLI Tooling",
      description:
        "Developed internal CLI tooling that automated repetitive tasks and accelerated development workflows.",
      impact: "+40% team productivity",
      technologies: ["Node.js", "TypeScript"],
      company: "Intenseye",
      period: "2022-2025",
      category: "tooling" as const,
    },
    {
      id: "intenseye-react-query",
      type: "achievement" as const,
      title: "React Query Rollout",
      description:
        "Led the rollout of React Query across the organization, enhancing perceived load times and reducing data-fetching bugs.",
      impact: "-30% data-fetching bugs",
      technologies: ["React Query", "TypeScript", "React"],
      company: "Intenseye",
      period: "2022-2025",
      category: "architecture" as const,
    },
    {
      id: "intenseye-ai-poc",
      type: "achievement" as const,
      title: "AI-Assisted POC Tools",
      description:
        "Reduced POC exploration time from weeks to days by applying AI-assisted development tools (Claude, Cursor) to prototype complex UI and data-flow concepts.",
      impact: "Weeks → Days POC velocity",
      technologies: ["Next.js", "TypeScript"],
      company: "Intenseye",
      period: "2022-2025",
      category: "innovation" as const,
    },
    {
      id: "intenseye-type-safety",
      type: "achievement" as const,
      title: "Type Safety & Advanced Patterns",
      description:
        "Increased codebase type-safety and adoption of advanced patterns by 20% through mentoring junior engineers and leading knowledge-sharing workshops.",
      impact: "+20% type safety adoption",
      technologies: ["TypeScript", "React"],
      company: "Intenseye",
      period: "2022-2025",
      category: "architecture" as const,
    },
    {
      id: "intenseye-konva",
      type: "achievement" as const,
      title: "React Konva Canvas Component",
      description:
        "Designed and shipped a foundational React Konva canvas component for drawing and visualization that became a core element of the product's user interface.",
      impact: "Foundational product feature",
      technologies: ["Konva", "React", "TypeScript"],
      company: "Intenseye",
      period: "2022-2025",
      category: "dashboard" as const,
    },
    {
      id: "intenseye-design-system",
      type: "achievement" as const,
      title: "Shadcn Design System",
      description:
        "Built a Shadcn-based design system composed of reusable UI components and design tokens, resolving discrepancies between design and engineering to ensure brand consistency.",
      impact: "Unified design language",
      technologies: ["Shadcn", "React", "TypeScript", "Tailwind"],
      company: "Intenseye",
      period: "2022-2025",
      category: "design-system" as const,
    },
    {
      id: "intenseye-react-flow",
      type: "achievement" as const,
      title: "ReactFlow Scenario Builder",
      description:
        "Engineered a safety scenario builder using ReactFlow, integrating a chat interface powered by Vercel AI SDK with real-time persistence and tool calling.",
      impact: "Advanced safety simulation",
      technologies: ["React Flow", "React", "TypeScript"],
      company: "Intenseye",
      period: "2022-2025",
      category: "innovation" as const,
    },
    {
      id: "intenseye-cross-team",
      type: "achievement" as const,
      title: "Cross-team Feature Delivery",
      description:
        "Ensured high-quality delivery of a major cross-team feature by independently coordinating requirements across multiple teams during a critical product gap.",
      impact: "Seamless feature launch",
      technologies: ["React Query", "TypeScript", "Next.js"],
      company: "Intenseye",
      period: "2022-2025",
      category: "architecture" as const,
    },
    {
      id: "intenseye-restful-apis",
      type: "achievement" as const,
      title: "RESTful API Development",
      description:
        "Developed scalable RESTful APIs using Next.js, tRPC, and React Query, while maintaining high code quality through Jest and Playwright testing.",
      impact: "High-quality APIs",
      technologies: ["Next.js", "TRPC", "React Query"],
      company: "Intenseye",
      period: "2022-2025",
      category: "architecture" as const,
    },

    // Layermark Achievements
    {
      id: "layermark-client-bridge",
      type: "achievement" as const,
      title: "Client Satisfaction Bridge",
      description:
        "Improved client satisfaction by 30% by bridging communication gaps between technical requirements and feasible design to deliver complex data visualizations.",
      impact: "+30% client satisfaction",
      technologies: ["Vue.js"],
      company: "Layermark",
      period: "2021-2022",
      category: "dashboard" as const,
    },
    {
      id: "layermark-geospatial",
      type: "achievement" as const,
      title: "Geospatial Dashboards",
      description:
        "Developed custom dashboards and geospatial visualizations using Vue.js and ArcGIS, working directly with clients to refine and implement their specific requirements.",
      impact: "Custom geospatial solutions",
      technologies: ["Vue.js", "ArcGIS"],
      company: "Layermark",
      period: "2021-2022",
      category: "dashboard" as const,
    },
    {
      id: "layermark-persistence",
      type: "achievement" as const,
      title: "Application Persistence Layers",
      description:
        "Implemented robust application persistence layers using Hibernate and Spring Data JPA to ensure reliable data management.",
      impact: "Reliable data management",
      technologies: ["Node.js"],
      company: "Layermark",
      period: "2021-2022",
      category: "architecture" as const,
    },
  ] as const satisfies readonly AchievementNode[],
  graph: {
    nodes: [
      // Root
      { id: "Mannan", label: "Mannan Abdul", type: "root" },

      // Companies
      {
        id: "Intenseye",
        label: "Intenseye",
        type: "company",
        period: "06/2022 - 11/2025",
      },
      {
        id: "Layermark",
        label: "Layermark",
        type: "company",
        period: "09/2021 - 04/2022",
      },

      // Education
      {
        id: "Bilkent",
        label: "Bilkent Univ.",
        type: "education",
        period: "09/2018 - 06/2022",
      },

      // Technologies
      { id: "React", label: "React", type: "tech", priority: 1 },
      { id: "TypeScript", label: "TypeScript", type: "tech", priority: 1 },
      { id: "Next.js", label: "Next.js", type: "tech", priority: 1 },
      { id: "React Query", label: "React Query", type: "tech", priority: 2 },
      { id: "React Flow", label: "React Flow", type: "tech", priority: 2 },
      { id: "ECharts", label: "ECharts", type: "tech", priority: 3 },
      { id: "Konva", label: "Konva", type: "tech", priority: 3 },
      { id: "Vue.js", label: "Vue.js", type: "tech", priority: 1 },
      { id: "ArcGIS", label: "ArcGIS", type: "tech", priority: 3 },
      { id: "Shadcn", label: "Shadcn UI", type: "tech", priority: 2 },
      { id: "Tailwind", label: "Tailwind", type: "tech", priority: 2 },
      { id: "Node.js", label: "Node.js", type: "tech", priority: 2 },
      { id: "TRPC", label: "tRPC", type: "tech", priority: 3 },
    ],
    edges: [
      // Root → Companies & Education (career progression)
      { source: "Mannan", target: "Intenseye", type: "career" },
      { source: "Mannan", target: "Layermark", type: "career" },
      { source: "Mannan", target: "Bilkent", type: "education" },

      // Companies → Achievements (projects)
      { source: "Intenseye", target: "intenseye-dashboards", type: "project" },
      { source: "Intenseye", target: "intenseye-cli-tooling", type: "project" },
      {
        source: "Intenseye",
        target: "intenseye-react-query",
        type: "project",
      },
      { source: "Intenseye", target: "intenseye-ai-poc", type: "project" },
      {
        source: "Intenseye",
        target: "intenseye-type-safety",
        type: "project",
      },
      { source: "Intenseye", target: "intenseye-konva", type: "project" },
      {
        source: "Intenseye",
        target: "intenseye-design-system",
        type: "project",
      },
      {
        source: "Intenseye",
        target: "intenseye-react-flow",
        type: "project",
      },
      {
        source: "Intenseye",
        target: "intenseye-cross-team",
        type: "project",
      },
      {
        source: "Intenseye",
        target: "intenseye-restful-apis",
        type: "project",
      },
      {
        source: "Layermark",
        target: "layermark-client-bridge",
        type: "project",
      },
      {
        source: "Layermark",
        target: "layermark-geospatial",
        type: "project",
      },
      {
        source: "Layermark",
        target: "layermark-persistence",
        type: "project",
      },

      // Achievements → Technologies (uses-tech)
      // intenseye-dashboards
      {
        source: "intenseye-dashboards",
        target: "React",
        type: "uses-tech",
      },
      {
        source: "intenseye-dashboards",
        target: "TypeScript",
        type: "uses-tech",
      },
      {
        source: "intenseye-dashboards",
        target: "ECharts",
        type: "uses-tech",
      },

      // intenseye-cli-tooling
      {
        source: "intenseye-cli-tooling",
        target: "Node.js",
        type: "uses-tech",
      },
      {
        source: "intenseye-cli-tooling",
        target: "TypeScript",
        type: "uses-tech",
      },

      // intenseye-react-query
      {
        source: "intenseye-react-query",
        target: "React Query",
        type: "uses-tech",
      },
      {
        source: "intenseye-react-query",
        target: "TypeScript",
        type: "uses-tech",
      },
      {
        source: "intenseye-react-query",
        target: "React",
        type: "uses-tech",
      },

      // intenseye-ai-poc
      { source: "intenseye-ai-poc", target: "Next.js", type: "uses-tech" },
      {
        source: "intenseye-ai-poc",
        target: "TypeScript",
        type: "uses-tech",
      },

      // intenseye-type-safety
      {
        source: "intenseye-type-safety",
        target: "TypeScript",
        type: "uses-tech",
      },
      {
        source: "intenseye-type-safety",
        target: "React",
        type: "uses-tech",
      },

      // intenseye-konva
      { source: "intenseye-konva", target: "Konva", type: "uses-tech" },
      { source: "intenseye-konva", target: "React", type: "uses-tech" },
      {
        source: "intenseye-konva",
        target: "TypeScript",
        type: "uses-tech",
      },

      // intenseye-design-system
      {
        source: "intenseye-design-system",
        target: "Shadcn",
        type: "uses-tech",
      },
      {
        source: "intenseye-design-system",
        target: "React",
        type: "uses-tech",
      },
      {
        source: "intenseye-design-system",
        target: "TypeScript",
        type: "uses-tech",
      },
      {
        source: "intenseye-design-system",
        target: "Tailwind",
        type: "uses-tech",
      },

      // intenseye-react-flow
      {
        source: "intenseye-react-flow",
        target: "React Flow",
        type: "uses-tech",
      },
      {
        source: "intenseye-react-flow",
        target: "React",
        type: "uses-tech",
      },
      {
        source: "intenseye-react-flow",
        target: "TypeScript",
        type: "uses-tech",
      },

      // intenseye-cross-team
      {
        source: "intenseye-cross-team",
        target: "React Query",
        type: "uses-tech",
      },
      {
        source: "intenseye-cross-team",
        target: "TypeScript",
        type: "uses-tech",
      },
      {
        source: "intenseye-cross-team",
        target: "Next.js",
        type: "uses-tech",
      },

      // intenseye-restful-apis
      {
        source: "intenseye-restful-apis",
        target: "Next.js",
        type: "uses-tech",
      },
      {
        source: "intenseye-restful-apis",
        target: "TRPC",
        type: "uses-tech",
      },
      {
        source: "intenseye-restful-apis",
        target: "React Query",
        type: "uses-tech",
      },

      // layermark-client-bridge
      {
        source: "layermark-client-bridge",
        target: "Vue.js",
        type: "uses-tech",
      },

      // layermark-geospatial
      {
        source: "layermark-geospatial",
        target: "Vue.js",
        type: "uses-tech",
      },
      {
        source: "layermark-geospatial",
        target: "ArcGIS",
        type: "uses-tech",
      },

      // layermark-persistence
      {
        source: "layermark-persistence",
        target: "Node.js",
        type: "uses-tech",
      },
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
