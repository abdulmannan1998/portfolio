---
phase: quick-004
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - data/tech-stack.ts
  - app/page.tsx
  - public/icons/*.svg
autonomous: true

must_haves:
  truths:
    - "Tech stack section displays skills matching resume"
    - "Icons are loaded from local /public/icons/ directory"
    - "Icons and text have full opacity (not greyed out)"
  artifacts:
    - path: "data/tech-stack.ts"
      provides: "Updated tech stack matching resume skills"
    - path: "public/icons/"
      provides: "Local SVG icons for all technologies"
    - path: "app/page.tsx"
      provides: "Fixed opacity classes for icons and text"
  key_links:
    - from: "data/tech-stack.ts"
      to: "public/icons/"
      via: "icon path references"
      pattern: "/icons/.*\\.svg"
---

<objective>
Update the tech stack section to accurately reflect skills from resume, download icons locally, and fix the greyed-out appearance.

Purpose: Portfolio should showcase actual skills, load icons from local assets for reliability, and display them prominently (not dimmed).
Output: Updated tech-stack.ts with resume-accurate skills, local SVG icons in public/icons/, and fixed opacity in page.tsx.
</objective>

<execution_context>
@/Users/sunny/.claude/get-shit-done/workflows/execute-plan.md
@/Users/sunny/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@data/tech-stack.ts
@app/page.tsx (lines 260-281)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Download SVG icons locally and update tech-stack.ts</name>
  <files>
    - public/icons/*.svg (new directory with ~24 SVG files)
    - data/tech-stack.ts
  </files>
  <action>
1. Create public/icons/ directory

2. Download SVG icons from devicons CDN for these technologies (matching resume):
   - Programming: javascript, typescript, html5, css3
   - Frameworks: react, nextjs, vuejs, (react-native uses react icon)
   - State/Data: react (for React Query, Zustand, Jotai, Redux Toolkit), trpc, zod
   - UI/Styling: tailwindcss, framermotion, apacheecharts, sass, styledcomponents
   - Tools: git, jest, playwright, eslint, vitejs, storybook

3. For libraries without devicon (React Flow, Shadcn, React Testing Library, TRPC, Zod, Jotai, Redux Toolkit):
   - Use closest match or react icon as fallback
   - TRPC: no official icon, use typescript as fallback
   - Zod: no official icon, use typescript as fallback
   - Redux Toolkit: use redux icon
   - Jotai: use react icon as fallback
   - React Query: use react icon as fallback
   - React Testing Library: use jest icon
   - Shadcn: use react icon as fallback
   - React Native: use react icon
   - React Flow: use react icon

4. Update data/tech-stack.ts with:
   - Organized categories (Languages, Frameworks, State Management, UI/Styling, Testing/Tools)
   - Local icon paths: "/icons/{name}.svg"
   - Full list from resume:
     Languages: JavaScript, TypeScript, HTML5, CSS3
     Frameworks: React, Next.js, Vue.js, React Native
     State/Data: React Query, TRPC, Zustand, Jotai, Redux Toolkit, Zod
     UI/Styling: Tailwind, Shadcn, Framer Motion, ECharts, Sass, Styled Components, Storybook
     Tools: Git, Jest, Playwright, React Testing Library, ESLint, Vite

Download commands (use curl):

```bash
mkdir -p public/icons
curl -o public/icons/javascript.svg "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
# ... etc for each icon
```

  </action>
  <verify>
    - ls public/icons/ shows all SVG files
    - cat data/tech-stack.ts shows local paths like "/icons/react.svg"
    - All icon paths start with "/icons/" not external URLs
  </verify>
  <done>
    - 18-24 SVG icons downloaded to public/icons/
    - tech-stack.ts updated with ~24 tech items from resume
    - All icon references use local /icons/*.svg paths
  </done>
</task>

<task type="auto">
  <name>Task 2: Fix greyed-out appearance in tech stack section</name>
  <files>app/page.tsx</files>
  <action>
Update the tech stack rendering (around lines 270-276) to remove the dimmed appearance:

1. Change icon opacity from "opacity-60 group-hover:opacity-100" to just "opacity-100" or remove opacity class entirely

2. Change text from "text-white/60 group-hover:text-orange-500" to "text-white group-hover:text-orange-500"

This makes icons and text fully visible by default, with hover effect remaining on text.

Before:

```tsx
className =
  "w-10 h-10 object-contain opacity-60 group-hover:opacity-100 transition-opacity";
className = "text-white/60 group-hover:text-orange-500 transition-colors...";
```

After:

```tsx
className = "w-10 h-10 object-contain transition-opacity";
className = "text-white group-hover:text-orange-500 transition-colors...";
```

  </action>
  <verify>
    - grep -n "opacity-60" app/page.tsx returns no results in tech stack section
    - grep -n "text-white/60" app/page.tsx returns no results in tech stack section
    - npm run build succeeds
  </verify>
  <done>
    - Tech stack icons display at full opacity
    - Tech stack text displays at full white (not 60% opacity)
    - Hover effects still work (text turns orange on hover)
  </done>
</task>

<task type="auto">
  <name>Task 3: Verify visual output and commit</name>
  <files>None (verification only)</files>
  <action>
1. Run npm run dev (if not already running) and verify:
   - Tech stack section shows updated skills
   - Icons load from local files (no external CDN requests)
   - Icons are fully visible (not greyed out)
   - Text is fully visible (not greyed out)
   - Hover effects work

2. Stage and commit changes:
   - git add public/icons/ data/tech-stack.ts app/page.tsx
   - Commit message: "feat(quick-004): update tech stack with resume skills and local icons"
     </action>
     <verify>
   - Dev server runs without errors
   - No console errors about missing icons
   - git status shows clean working tree after commit
     </verify>
     <done>
   - All changes committed
   - Tech stack section visually correct
   - Icons load locally
     </done>
     </task>

</tasks>

<verification>
- [ ] public/icons/ contains all required SVG files
- [ ] data/tech-stack.ts lists skills matching resume
- [ ] All icon paths are local (/icons/*.svg)
- [ ] No opacity-60 or text-white/60 in tech stack section
- [ ] npm run build succeeds
- [ ] Changes committed to git
</verification>

<success_criteria>

- Tech stack displays 20+ skills from resume (not the old 18 placeholder skills)
- Icons load from /public/icons/ (not external CDN)
- Icons and text are fully visible (no grey/dimmed appearance)
- Hover effects work (text changes to orange)
- All changes committed
  </success_criteria>

<output>
After completion, create `.planning/quick/004-update-tech-stack-section-with-accurate-/004-SUMMARY.md`
</output>
