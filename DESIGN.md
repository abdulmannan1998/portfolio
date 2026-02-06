# Design Philosophy & Guidelines

This document outlines the design philosophy, visual identity, and development guidelines for Mannan's portfolio website. Any agent or developer working on this project should reference this document to maintain consistency.

---

## Overview

The portfolio consists of two distinct views serving the same content:

1. **Standard View** (`/`) - Clean, professional, modern design
2. **Creative View** (`/creative`) - Experimental, brutalist, bold design

Both views share the same underlying data from `/data/resume-data.ts` and follow the same content flow.

---

## Content Flow (Both Views)

All views must follow this section ordering:

1. **Hero** - Name, title, social links, CTA
2. **About Me** - Professional summary, years of experience
3. **Tech Stack** - Categorized technologies with icons
4. **Experience** - Career timeline (Intenseye → Layermark → Bilkent)
5. **Impact/Metrics** - Quantifiable achievements
6. **Interactive Graph** - React Flow career visualization
7. **GitHub Activity** - Live GitHub feed widget
8. **Footer/CTA** - Contact information, social links

---

## Standard View Design System

### Color Palette

```css
/* Primary Background */
--bg-primary: stone-950 (#0c0a09)
--bg-secondary: stone-900 (#1c1917)

/* Text Colors */
--text-primary: stone-200 (#e7e5e3)
--text-secondary: stone-400 (#a8a29e)
--text-muted: stone-500 (#78716c)
--text-label: stone-600 (#57534e)

/* Accent Colors */
--accent-primary: orange-500 (#f97316)
--accent-hover: orange-600 (#ea580c)
--accent-muted: orange-500/30

/* Semantic Colors */
--color-success: emerald-400 (#34d399)
--color-info: blue-400 (#60a5fa)
--color-purple: purple-400 (#c084fc)

/* Borders */
--border-default: stone-800 (#292524)
--border-subtle: stone-800/50
```

### Typography

- **Font Family**: System sans-serif (inherited from Tailwind)
- **Font Mono**: Used for labels, technical terms, code
- **Headings**: Bold/Black weight, tight tracking
- **Body**: Regular weight, relaxed line height

### Component Patterns

#### Cards
```css
/* Standard card */
rounded-xl border border-stone-800 bg-stone-900/50

/* Hover state */
hover:border-stone-700 hover:bg-stone-900

/* With gradient overlay */
bg-gradient-to-br from-stone-900/80 to-stone-950
```

#### Buttons
```css
/* Primary CTA */
px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium

/* Secondary/Ghost */
rounded-lg border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700

/* Labs Button (Special) */
border border-dashed border-stone-700 text-stone-400 hover:border-purple-500/50 hover:text-purple-400
/* With badge */
<span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">SOON</span>
```

#### Section Headers
```css
/* Label */
<span className="text-orange-500 text-xl">*</span>
<span className="text-sm font-mono text-stone-400 uppercase tracking-[0.2em]">Section Name</span>
```

### Animation Guidelines

- Use Framer Motion for all animations
- Prefer `whileInView` over `animate` for scroll-triggered content
- Standard animation duration: 0.5s
- Standard stagger delay: 0.1s
- Easing: default or [0.22, 1, 0.36, 1] for smooth entrances

---

## Creative View Design System

### Visual Identity

The creative view embraces a **brutalist** design aesthetic:

- **High contrast**: Black backgrounds with white/orange accents
- **Bold typography**: Giant outlined text, heavy weights
- **Sharp edges**: No border-radius (use `rounded-none`)
- **Industrial feel**: Grid layouts, raw edges, corner accents
- **Motion**: Marquee scrolling text, parallax effects

### Color Palette

```css
/* Primary */
--bg-primary: black (#000000)
--bg-secondary: stone-900 (#1c1917)
--bg-tertiary: stone-950 (#0c0a09)

/* Text */
--text-primary: white (#ffffff)
--text-secondary: white/60
--text-muted: white/40

/* Accents */
--accent-primary: orange-500 (#f97316)
--accent-secondary: blue-500 (#3b82f6)
--accent-tertiary: purple-500 (#a855f7)
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

#### Cards (Brutalist)
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

#### Labs Button (Creative Style)
```css
/* Brutalist labs button with SOON badge */
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
function MarqueeText({ text, direction = 1 }: { text: string; direction?: number }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="inline-flex"
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mx-4">{text}</span>
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

| Technology | Icon URL |
|------------|----------|
| JavaScript | `javascript/javascript-original.svg` |
| TypeScript | `typescript/typescript-original.svg` |
| React | `react/react-original.svg` |
| Next.js | `nextjs/nextjs-original.svg` |
| Vue.js | `vuejs/vuejs-original.svg` |
| Tailwind | `tailwindcss/tailwindcss-original.svg` |
| Framer Motion | `framermotion/framermotion-original.svg` |
| Node.js | `nodejs/nodejs-original.svg` |
| Express | `express/express-original.svg` |
| GraphQL | `graphql/graphql-plain.svg` |
| PostgreSQL | `postgresql/postgresql-original.svg` |
| MongoDB | `mongodb/mongodb-original.svg` |
| Prisma | `prisma/prisma-original.svg` |
| Git | `git/git-original.svg` |
| Docker | `docker/docker-original.svg` |
| AWS | `amazonwebservices/amazonwebservices-original-wordmark.svg` |
| Figma | `figma/figma-original.svg` |

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
  /page.tsx           # Standard view entry
  /creative/page.tsx  # Creative view entry
  /labs/page.tsx      # Labs coming soon page

/components
  /navigation.tsx     # Shared navigation
  /graph-legend.tsx   # React Flow legend
  /sections/
    /hero-section.tsx
    /about-section.tsx
    /tech-stack-section.tsx
    /experience-section.tsx
    /metrics-section.tsx
    /graph-section.tsx
    /github-activity-section.tsx
    /footer-section.tsx

/data
  /resume-data.ts     # All portfolio content

/public
  /llms.txt           # Machine-readable site info
```

---

## Development Guidelines

1. **Data Source**: All content comes from `/data/resume-data.ts` - never hardcode resume content in components
2. **Animations**: Always use Framer Motion, prefer `whileInView` for scroll-triggered
3. **Responsive**: Mobile-first, test at 375px, 768px, and 1280px breakpoints
4. **Performance**: Lazy load heavy components (React Flow, GitHub widget) with `next/dynamic`
5. **Accessibility**: Include alt text, semantic HTML, focus states
6. **Consistency**: Match the Labs button style across both views (dashed border + SOON badge)

---

## Quick Reference

### Standard View Classes
```css
/* Background */ bg-stone-950
/* Card */ rounded-xl border border-stone-800 bg-stone-900/50
/* Primary button */ bg-orange-500 hover:bg-orange-600 text-white rounded-lg
/* Text primary */ text-stone-200
/* Text muted */ text-stone-500
```

### Creative View Classes
```css
/* Background */ bg-black
/* Card */ bg-stone-900 rounded-none
/* Primary button */ bg-black text-white border-2 border-black hover:bg-stone-900
/* Text primary */ text-white
/* Text muted */ text-white/60
/* Accent */ bg-orange-500 text-black
```
