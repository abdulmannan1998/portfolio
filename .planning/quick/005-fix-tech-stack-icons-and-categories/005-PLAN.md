---
phase: quick-005
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - public/icons/reactquery.svg
  - public/icons/zustand.svg
  - public/icons/jotai.svg
  - public/icons/shadcn.svg
  - public/icons/styledcomponents.svg
  - public/icons/framermotion.svg
  - public/icons/trpc.svg
  - public/icons/testinglibrary.svg
  - data/tech-stack.ts
  - app/page.tsx
autonomous: true

must_haves:
  truths:
    - "All tech stack items show their correct branded icon"
    - "Tech items are organized into visible categories"
    - "Category layout shows label on left, icons on right"
  artifacts:
    - path: "data/tech-stack.ts"
      provides: "Categorized tech stack data structure"
      contains: "TechCategory"
    - path: "app/page.tsx"
      provides: "Category-based rendering"
      contains: "category.items.map"
  key_links:
    - from: "data/tech-stack.ts"
      to: "app/page.tsx"
      via: "techCategories export"
      pattern: "techCategories"
---

<objective>
Fix missing/fallback tech stack icons and reorganize into categorized layout

Purpose: Make the tech stack section visually polished with correct branded icons and organized by category (Frontend, State/Data, UI/Styling, Tools) like professional portfolio designs.

Output: Working categorized tech stack with all proper icons displayed
</objective>

<context>
@data/tech-stack.ts
@app/page.tsx (lines 260-281)
@public/icons/ directory

Current issues:

- React Query, Zustand, Jotai, Shadcn, Styled Components use react.svg fallback
- TRPC uses typescript.svg fallback
- React Testing Library uses jest.svg fallback
- Framer Motion icon has no fill color (renders black)
- No category organization - just flat grid
  </context>

<tasks>

<task type="auto">
  <name>Task 1: Download/create missing icons</name>
  <files>
    public/icons/reactquery.svg
    public/icons/zustand.svg
    public/icons/jotai.svg
    public/icons/shadcn.svg
    public/icons/styledcomponents.svg
    public/icons/framermotion.svg (fix color)
    public/icons/trpc.svg
    public/icons/testinglibrary.svg
  </files>
  <action>
Download SVG icons from simpleicons.org CDN or create minimal branded SVGs:

1. React Query (TanStack): https://simpleicons.org/icons/reactquery.svg - red/coral color #FF4154
2. Zustand: Bear icon - use https://simpleicons.org or create minimal bear shape, brown color
3. Jotai: Ghost icon - create minimal ghost shape, purple/lavender color
4. Shadcn: https://simpleicons.org/icons/shadcnui.svg - white/black
5. Styled Components: https://simpleicons.org/icons/styledcomponents.svg - pink #DB7093
6. Framer Motion: Fix existing icon by adding fill="#0055FF" (framer blue) to the path
7. TRPC: https://simpleicons.org/icons/trpc.svg - blue #2596BE
8. Testing Library: https://simpleicons.org/icons/testinglibrary.svg - red #E33332

Use curl to download from https://cdn.simpleicons.org/{iconname}/{color} format.
For icons not available, create minimal SVG with brand colors.
</action>
<verify>
All icon files exist in public/icons/ and are valid SVGs with proper colors:

```bash
ls -la public/icons/*.svg | wc -l  # Should have additional icons
file public/icons/reactquery.svg  # Should show SVG
```

  </verify>
  <done>8 new/fixed icon files exist with proper brand colors</done>
</task>

<task type="auto">
  <name>Task 2: Restructure tech-stack.ts with categories</name>
  <files>data/tech-stack.ts</files>
  <action>
Update data/tech-stack.ts to export categorized structure:

```typescript
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
```

Update all icon paths to use the new icon filenames created in Task 1.
</action>
<verify>

```bash
npx tsc --noEmit data/tech-stack.ts 2>&1 | head -5  # No type errors
```

  </verify>
  <done>tech-stack.ts exports techCategories with proper icon paths</done>
</task>

<task type="auto">
  <name>Task 3: Update page.tsx with categorized layout</name>
  <files>app/page.tsx</files>
  <action>
Update the tech stack section in app/page.tsx (lines 260-281) to render by category:

1. Import techCategories instead of techStack
2. Replace the flat grid with categorized rows
3. Layout: Category name on left (fixed width), icons in flex row on right

New structure:

```tsx
import { techCategories } from "@/data/tech-stack";

// In the tech stack section, replace the grid with:
<div className="space-y-8">
  {techCategories.map((category) => (
    <div
      key={category.name}
      className="flex flex-col md:flex-row gap-4 md:gap-8"
    >
      {/* Category label */}
      <div className="md:w-40 shrink-0">
        <span className="text-white/40 font-mono text-xs uppercase tracking-widest">
          {category.name}
        </span>
      </div>
      {/* Tech icons row */}
      <div className="flex flex-wrap gap-4">
        {category.items.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center gap-2 p-3 group cursor-default"
          >
            <img
              src={tech.icon}
              alt={tech.name}
              className="w-8 h-8 object-contain"
            />
            <span className="text-white/60 group-hover:text-orange-500 transition-colors font-mono text-[10px] text-center uppercase">
              {tech.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  ))}
</div>;
```

Keep the section header unchanged. Update import from techStack to techCategories.
</action>
<verify>

```bash
npm run build 2>&1 | tail -20  # Build succeeds
npm run dev &  # Start dev server, visually check localhost:3000
```

  </verify>
  <done>Tech stack renders with category labels on left, icons in rows on right, all icons visible with correct branding</done>
</task>

</tasks>

<verification>
1. All icons render correctly (no broken images, no React fallbacks where inappropriate)
2. Categories display with labels on left, tech icons on right
3. Build passes without errors
4. Visual inspection shows polished categorized layout
</verification>

<success_criteria>

- All tech items show their branded icon (React Query red, Zustand bear, Jotai ghost, etc.)
- Tech stack organized into 5 categories: Languages, Frameworks, State & Data, UI & Styling, Tools & Testing
- Layout matches reference: category name left-aligned, icons in horizontal row
- Responsive: stacks vertically on mobile
  </success_criteria>

<output>
After completion, create `.planning/quick/005-fix-tech-stack-icons-and-categories/005-SUMMARY.md`
</output>
