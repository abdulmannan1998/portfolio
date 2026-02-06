# External Integrations

**Analysis Date:** 2026-02-06

## APIs & External Services

**GitHub Public API:**

- Service: GitHub (github.com/api)
- What it's used for: Fetching public activity feed showing latest commits and events
- Location: `app/page.tsx` - `GitHubActivity` component (line 219-347)
- Endpoint: `https://api.github.com/users/{username}/events/public?per_page=5`
- Client: Native Fetch API (no SDK)
- Auth: None required (public endpoints)
- Username: `sunnyimmortal`

**Icon CDN:**

- Service: jsDelivr CDN (cdn.jsdelivr.net/gh/devicons/devicon)
- What it's used for: Serving technology stack icon SVGs
- Location: `app/page.tsx` - `techStack` array (lines 42-115)
- Usage: Dynamic image URLs for tech icons (React, TypeScript, Next.js, Node.js, etc.)
- Auth: None required (public CDN)

## Data Storage

**Database:**

- Type: None active
- Status: Not integrated in current portfolio
- Note: This is a static portfolio with client-side rendering; no persistent backend

**File Storage:**

- Type: Local filesystem + CDN
- Approach:
  - Static assets: Next.js public directory (`/public`)
  - Images/Icons: jsDelivr CDN (external)
  - No cloud storage service integrated (S3, Firebase, etc.)

**Caching:**

- Browser: Next.js client router cache configured in `next.config.ts`
  - Dynamic routes: 30 seconds
  - Static routes: 180 seconds
- Service-side: None detected

## Authentication & Identity

**Auth Provider:**

- Type: None - Portfolio is public and does not require authentication
- Social integrations (links only, no auth backend):
  - GitHub: `https://github.com/sunnyimmortal`
  - LinkedIn: `https://linkedin.com/in/mannanabdul`
  - Email: `abdul.1998.17@gmail.com`

**Implementation:**

- External links only - no OAuth or session management
- GitHub activity fetched via public API without authentication

## Monitoring & Observability

**Error Tracking:**

- Service: None detected
- Status: No Sentry, LogRocket, or error tracking service integrated

**Logs:**

- Approach: Browser console only
- ESLint rule: `"no-console": ["warn", { allow: ["warn", "error"] }]`
- Production: Console warnings/errors allowed for debugging

**Analytics:**

- Service: None detected
- Status: No Google Analytics, Vercel Analytics, or similar integrated in current build

## CI/CD & Deployment

**Hosting:**

- Platform: Vercel
- Configuration: `.vercel/project.json` present
  - Project ID: `prj_NUzrygDa4ReYYjuWu1XeWOTDMNAj`
  - Organization ID: `team_h45SsCDlspv4gYzid02Y2wZ3`
  - Project Name: `portfolio`
- Alternative: Any Node.js 18+ environment with Next.js support

**Version Control:**

- Repository: Git
- Platform: GitHub (implied from git-based workflow)
- Branches: `main`/`master` (main branch), feature branches for development

**CI Pipeline:**

- Service: None explicitly configured
- Hooks: Pre-commit via Husky (local only)
  - Runs ESLint and Prettier on staged files via `lint-staged`

## Build & Optimization

**Package Optimization (from `next.config.ts`):**

```typescript
experimental: {
  optimizePackageImports: ["lucide-react", "framer-motion", "@xyflow/react"],
}
```

- Reduces bundle size by tree-shaking unused exports from large icon/animation libraries

**Image Optimization:**

- Formats: AVIF (modern), WebP (fallback)
- Configuration in `next.config.ts` - `images.formats`

## Environment Configuration

**Required Environment Variables:**

- None currently required
- GitHub API: Uses public endpoint (no authentication token needed)

**Optional Configuration:**

- `NEXT_PUBLIC_*` - Any public env vars (would need .env.local for dev)
- GitHub username: Hardcoded as `"sunnyimmortal"` in `app/page.tsx` (could be moved to env)

**Secrets Location:**

- None currently stored (portfolio is fully public)
- If future secrets needed: `.env.local` (local only, ignored by git)

## Webhooks & Callbacks

**Incoming:**

- None detected
- Status: Portfolio does not expose any webhook endpoints

**Outgoing:**

- None detected
- Status: No event pushes to external services

## Third-Party Services Summary

| Service      | Type            | Purpose                  | Auth  | Status |
| ------------ | --------------- | ------------------------ | ----- | ------ |
| GitHub API   | Public REST API | Activity feed            | None  | Active |
| jsDelivr CDN | Static CDN      | Icon hosting             | None  | Active |
| Vercel       | Deployment      | Hosting & edge functions | OAuth | Active |
| Next.js      | Framework       | Server/client rendering  | N/A   | Active |

## Future Integration Opportunities

**Potential Additions:**

- GitHub Stats API integration for enhanced metrics display
- Analytics service (Vercel Analytics, Plausible, or similar)
- Email service (Resend, SendGrid) for contact form backend
- Database (PostgreSQL, MongoDB) if adding dynamic content
- CMS (Contentful, Sanity) for managing portfolio content
- Blog API integration for syncing external blog posts
- API routes for form handling or serverless functions

---

_Integration audit: 2026-02-06_
