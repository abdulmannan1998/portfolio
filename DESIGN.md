# Design Philosophy & Guidelines

This document outlines the design philosophy, visual identity, and development guidelines for Mannan's portfolio website. Any agent or developer working on this project should reference this document to maintain consistency.

---

## Overview

The portfolio embraces a **brutalist** design aesthetic with bold typography, high contrast, and sharp edges. All content is sourced from `/data/resume-data.ts`.

---

## Content Flow

The page follows this section ordering:

1. **Hero** - Name, title, social links, CTA
2. **About Me** - Professional summary, years of experience
3. **Tech Stack** - Categorized technologies with icons
4. **Experience** - Career timeline (Intenseye → Layermark → Bilkent)
5. **Impact/Metrics** - Quantifiable achievements
6. **Interactive Graph** - React Flow career visualization
7. **GitHub Activity** - Live GitHub feed widget
8. **Footer/CTA** - Contact information, social links

---

## Design System

### Visual Identity

The portfolio embraces a **brutalist** design aesthetic:

- **High contrast**: Black backgrounds with white/orange accents
- **Bold typography**: Giant outlined text, heavy weights
- **Sharp edges**: No border-radius (use `rounded-none`)
- **Industrial feel**: Grid layouts, raw edges, corner accents
- **Motion**: Marquee scrolling text, parallax effects

### Color Palette

```css
/* Primary */
--bg-primary: black (#000000) --bg-secondary: stone-900 (#1c1917)
  --bg-tertiary: stone-950 (#0c0a09) /* Text */ --text-primary: white (#ffffff)
  --text-secondary: white/60 --text-muted: white/40 /* Accents */
  --accent-primary: orange-500 (#f97316) --accent-secondary: blue-500 (#3b82f6)
  --accent-tertiary: purple-500 (#a855f7);
```

### Typography

- **Hero Text**: `text-[15vw]` with outlined stroke effect
  ```css
  WebkitTextStroke: "2px rgba(255,255,255,0.3)"
  WebkitTextFillColor: "transparent"
  ```
- **Section Headers**: `text-5xl md:text-6xl font-black`
- **Labels**: `font-mono text-sm uppercase tracking-widest`
- **Body**: `text-white/60 text-lg leading-relaxed`

### Component Patterns

#### Cards

```css
/* Metric card */
bg-stone-900 rounded-none p-8

/* Corner accent */
<div className="absolute top-0 right-0 w-16 h-16 bg-orange-500" />
```

#### Navigation

```css
/* Mix-blend for overlay effect */
<nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
```

#### Labs Button

```css
/* Labs button with SOON badge */
<Link href="/labs" className="group relative flex items-center gap-2 px-4 py-2 border-2 border-dashed border-white/30 text-white hover:border-orange-500 hover:text-orange-500 transition-all">
  <Beaker className="h-4 w-4" />
  <span className="font-mono text-sm uppercase">Labs</span>
  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold bg-orange-500 text-black">SOON</span>
</Link>
```

#### Timeline

```css
/* Vertical timeline with colored markers */
<div className="absolute left-0 top-0 bottom-0 w-px bg-white/20" />
<div className="absolute left-0 top-2 w-3 h-3 bg-orange-500 -translate-x-1/2" />
```

#### Tech Grid

```css
/* Grid with visible gaps */
grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-white/10

/* Cells */
bg-black p-6 md:p-8 hover:bg-orange-500/10
```

### Scrolling Marquee Component

```tsx
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
```

### Animation Guidelines

- Hero: Scroll-driven scale and opacity transforms
- Sections: `whileInView` with staggered children
- Hover states: `whileHover` with subtle scale/color changes
- Marquee: Infinite linear animation (20s duration)

---

## Tech Stack Icons

All tech icons are sourced from devicons CDN:

```
https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{name}/{name}-original.svg
```

### Available Icons

| Technology    | Icon URL                                                    |
| ------------- | ----------------------------------------------------------- |
| JavaScript    | `javascript/javascript-original.svg`                        |
| TypeScript    | `typescript/typescript-original.svg`                        |
| React         | `react/react-original.svg`                                  |
| Next.js       | `nextjs/nextjs-original.svg`                                |
| Vue.js        | `vuejs/vuejs-original.svg`                                  |
| Tailwind      | `tailwindcss/tailwindcss-original.svg`                      |
| Framer Motion | `framermotion/framermotion-original.svg`                    |
| Node.js       | `nodejs/nodejs-original.svg`                                |
| Express       | `express/express-original.svg`                              |
| GraphQL       | `graphql/graphql-plain.svg`                                 |
| PostgreSQL    | `postgresql/postgresql-original.svg`                        |
| MongoDB       | `mongodb/mongodb-original.svg`                              |
| Prisma        | `prisma/prisma-original.svg`                                |
| Git           | `git/git-original.svg`                                      |
| Docker        | `docker/docker-original.svg`                                |
| AWS           | `amazonwebservices/amazonwebservices-original-wordmark.svg` |
| Figma         | `figma/figma-original.svg`                                  |

---

## GitHub Activity Widget

The GitHub activity section fetches live data from the GitHub API:

```
https://api.github.com/users/{username}/events/public?per_page=5
```

### Required Features

- Show latest push with "time ago" formatting
- Display commit message (truncated at 60 chars)
- Show repo name (with public/private indicator)
- List 3 recent activities
- Loading and error states

---

## React Flow Graph Section

The interactive career graph uses React Flow with:

### Node Types

- **Profile** (orange, circular) - Central user node
- **Company** (blue, rounded) - Work experience
- **Education** (purple, rounded) - Academic background
- **Achievement** (orange, rounded) - Key accomplishments
- **Soft Skill** (emerald, circular) - Personal qualities

### Edge Types

- **Career** (blue) - Employment connections
- **Education** (violet) - Academic connections
- **Project** (orange) - Project/achievement connections

### Interactions

- Click achievements to expand/collapse child nodes
- Hover over nodes for details
- Drag to pan, scroll to zoom

---

## File Structure

```
/app
  /page.tsx           # Main portfolio page (~390 lines, imports sections)
  /labs/page.tsx      # Labs coming soon page

/components
  /sections/
    /graph-section.tsx      # Interactive career graph
    /metrics-section.tsx    # Impact metrics with animated counters
    /experience-timeline.tsx # Vertical career timeline
  /github-activity.tsx      # Live GitHub feed widget
  /graph-legend.tsx         # React Flow legend
  /custom-node.tsx          # React Flow custom node
  /nodes/
    /achievement-node.tsx   # Achievement expansion node

/data
  /resume-data.ts       # Portfolio content (bio, skills, companies)
  /tech-stack.ts        # Tech stack grid data (18 technologies)
  /experience.ts        # Experience timeline data

/lib
  /debounce.ts          # Debounce utility with cancel method
  /graph-utils.ts       # Graph node/edge generation
  /layout-constants.ts  # Layout and timing constants
  /stores/
    /graph-store.tsx    # Zustand graph state

/public
  /llms.txt             # Machine-readable site info
```

---

## Development Guidelines

1. **Data Source**: All content comes from `/data/resume-data.ts` - never hardcode resume content in components
2. **Animations**: Always use Framer Motion, prefer `whileInView` for scroll-triggered
3. **Responsive**: Mobile-first, test at 375px, 768px, and 1280px breakpoints
4. **Performance**: Lazy load heavy components (React Flow) with `next/dynamic`
5. **Accessibility**: Include alt text, semantic HTML, focus states
6. **Style**: Maintain brutalist aesthetic with sharp edges, high contrast, and bold typography

---

## Quick Reference

### Common Classes

```css
/* Background */ bg-black
/* Secondary bg */ bg-stone-900, bg-stone-950
/* Card */ bg-stone-900 rounded-none
/* Primary button */ bg-black text-white border-2 border-black hover:bg-stone-900
/* CTA button */ bg-orange-500 text-black hover:bg-orange-600
/* Text primary */ text-white
/* Text muted */ text-white/60
/* Accent */ bg-orange-500 text-black
/* Labels */ font-mono text-sm uppercase tracking-widest text-orange-500
```

---

_Last updated: 2026-02-06 - Updated for Phase 7 component splitting_
