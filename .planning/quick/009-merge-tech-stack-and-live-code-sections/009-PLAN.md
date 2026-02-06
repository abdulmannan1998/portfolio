# Quick Task 009: Merge Tech Stack & Live Code Sections

## Goal

Combine the "Tech Stack" section (lines 247-294 of page.tsx) and the "Live Code / GitHub Activity" section (lines 315-372 of page.tsx) into a single, visually cohesive section. Place it where the tech stack currently sits (after MetricsSection, before ExperienceTimeline). Redesign the tech stack display for better visual impact.

## Design Direction

### Current Problems

- Tech stack icons are tiny (32x32) with too much whitespace
- Category labels are left-aligned with huge gap to icons - wasted space
- Live Code section duplicates social links already in the nav
- Two separate sections that relate to "what I do technically" feel disconnected
- GitHub activity card has an oversized orange corner block that looks unbalanced

### Combined Section Design: "STACK & CODE"

**Section header:**

- Label: "TECHNOLOGIES" (orange-500, font-mono, uppercase, tracking-widest)
- Title: "STACK & CODE" (text-5xl md:text-6xl, font-black)

**Layout:** `grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6`

**Left Column — Tech Stack (redesigned):**

Each category renders as a distinct group:

- Category name as a small label (font-mono, text-xs, uppercase, text-white/40, tracking-widest) with a short orange left border (2px tall accent line)
- Below: icons flow in a `flex flex-wrap gap-3` grid
- Each tech item: `group flex flex-col items-center gap-2 w-20` with:
  - Icon: `w-10 h-10` (larger than current 32px)
  - Name: `text-[10px] font-mono uppercase text-white/50 group-hover:text-orange-500 transition-colors`
  - Hover on item: subtle `scale-105` transform
- Categories separated by `space-y-8`
- Staggered `whileInView` animation per icon (opacity 0→1, 30ms delay between items)

**Right Column — Activity Panel:**

A single cohesive sidebar column with two stacked cards:

**Card 1: GitHub Live Feed** (`bg-stone-900 p-6`)

- Small orange corner accent (top-left, `w-8 h-8` — smaller than current)
- Header: GitHub icon + "LIVE" label + pulsing green/orange dot
- Latest push: commit message (text-lg font-bold, not the oversized text-2xl)
- Repo link below
- Divider (border-t border-white/10)
- 2-3 recent activity lines (compact, monospace)
- "VIEW PROFILE →" link at bottom

**Card 2: Social Links** (`space-y-3`, two small CTA cards stacked)

- GitHub CTA: `bg-stone-900 p-4 hover:bg-stone-800` — icon + label + external link icon
- LinkedIn CTA: same pattern with blue accent
- Smaller and more compact than current full-width cards

**Mobile Layout:**

- On mobile (below lg), stack vertically: tech stack first, then activity panel below
- Activity panel becomes full-width cards

## Tasks

### Task 1: Create `TechAndCodeSection` component

**File:** `components/sections/tech-and-code-section.tsx`

Create a new "use client" component that:

1. Imports `techCategories` from `@/data/tech-stack`
2. Imports `GitHubActivity` from `@/components/github-activity`
3. Imports `SOCIAL_LINKS` from `@/lib/social-links`
4. Imports `motion` from `framer-motion`
5. Imports `Github, Linkedin, ExternalLink` from `lucide-react`
6. Implements the combined layout described above

The component is self-contained and exported as `TechAndCodeSection`.

### Task 2: Slim down `GitHubActivity` component

**File:** `components/github-activity.tsx`

Modify the existing component to work better in a sidebar context:

- Reduce the orange corner accent from `w-16 h-16` to `w-8 h-8`
- Make the latest push text smaller: `text-lg md:text-xl` instead of `text-2xl md:text-3xl`
- Remove the VIEW PROFILE button from the header (we'll add it at the bottom instead)
- Add a compact "View Profile →" text link at the bottom of the component
- Reduce padding from `p-8 md:p-12` to `p-6`
- Keep all the caching, fetching, and event processing logic unchanged

### Task 3: Update `page.tsx` to use combined section

**File:** `app/page.tsx`

1. Remove the old tech stack section (lines 247-294)
2. Remove the old Live Code section (lines 315-372)
3. Add import for `TechAndCodeSection` from `@/components/sections/tech-and-code-section`
4. Insert `<TechAndCodeSection />` where the tech stack was (after MetricsSection, before ExperienceTimeline)
5. Remove the now-unused `techCategories` import
6. Keep `GitHubActivity` import ONLY if still needed elsewhere (it won't be — remove it)

## Verification

- Both sections are combined into one
- Tech stack icons are larger and more visually impactful
- GitHub activity displays correctly in sidebar
- Social CTAs are present and functional
- Mobile responsive layout works (stacked on mobile)
- No broken imports or unused code
- Section order: ... → MetricsSection → TechAndCodeSection → ExperienceTimeline → ...
