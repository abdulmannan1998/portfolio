export type TechItem = {
  name: string;
  icon: string;
};

export type TechCategory = {
  name: string;
  items: TechItem[];
};

export const techCategories: TechCategory[] = [
  {
    name: "LANGUAGES",
    items: [
      { name: "JavaScript", icon: "/icons/javascript.svg" },
      { name: "TypeScript", icon: "/icons/typescript.svg" },
      { name: "HTML5", icon: "/icons/html5.svg" },
      { name: "CSS3", icon: "/icons/css3.svg" },
    ],
  },
  {
    name: "FRAMEWORKS",
    items: [
      { name: "React", icon: "/icons/react.svg" },
      { name: "Next.js", icon: "/icons/nextjs.svg" },
      { name: "Vue.js", icon: "/icons/vuejs.svg" },
      { name: "React Native", icon: "/icons/react.svg" },
    ],
  },
  {
    name: "STATE & DATA",
    items: [
      { name: "React Query", icon: "/icons/reactquery.svg" },
      { name: "TRPC", icon: "/icons/trpc.svg" },
      { name: "Zustand", icon: "/icons/zustand.svg" },
      { name: "Jotai", icon: "/icons/jotai.svg" },
      { name: "Redux", icon: "/icons/redux.svg" },
      { name: "Zod", icon: "/icons/zod.svg" },
    ],
  },
  {
    name: "UI & STYLING",
    items: [
      { name: "Tailwind", icon: "/icons/tailwindcss.svg" },
      { name: "Shadcn", icon: "/icons/shadcn.svg" },
      { name: "Framer Motion", icon: "/icons/framermotion.svg" },
      { name: "ECharts", icon: "/icons/echarts.svg" },
      { name: "Sass", icon: "/icons/sass.svg" },
      { name: "Styled Components", icon: "/icons/styledcomponents.svg" },
      { name: "Storybook", icon: "/icons/storybook.svg" },
    ],
  },
  {
    name: "TOOLS & TESTING",
    items: [
      { name: "Git", icon: "/icons/git.svg" },
      { name: "Jest", icon: "/icons/jest.svg" },
      { name: "Playwright", icon: "/icons/playwright.svg" },
      { name: "Testing Library", icon: "/icons/testinglibrary.svg" },
      { name: "ESLint", icon: "/icons/eslint.svg" },
      { name: "Vite", icon: "/icons/vitejs.svg" },
    ],
  },
];

// Keep flat export for backward compatibility if needed
export const techStack: TechItem[] = techCategories.flatMap((cat) => cat.items);
