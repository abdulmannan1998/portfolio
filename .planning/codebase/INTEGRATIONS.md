# External Integrations

**Analysis Date:** 2026-02-05

## APIs & External Services

**Not detected** - This is a static portfolio application with no external API integrations.

The application is designed as a self-contained, client-side portfolio website that:

- Does not make HTTP requests to external services
- Contains no API client implementations (axios, fetch-based HTTP utilities)
- Uses only locally imported modules and third-party UI libraries

## Data Storage

**Databases:**

- Not applicable - No database integration detected

**File Storage:**

- Local filesystem only
  - Static resume data: `data/resume-data.ts` (TypeScript data structures)
  - Static assets: `public/` directory
  - No cloud storage service integration (S3, Firebase Storage, etc.)

**Caching:**

- Next.js built-in client router cache:
  - Configured in `next.config.ts`:
    - Static cache: 180 seconds
    - Dynamic cache: 30 seconds
  - Browser-level caching via HTTP headers (automatic via Next.js)
- No external caching service (Redis, Memcached, etc.)

## Authentication & Identity

**Auth Provider:**

- Not applicable - No authentication system implemented
- Portfolio is public-facing with no user authentication
- No login/logout functionality
- No protected routes

## Monitoring & Observability

**Error Tracking:**

- Not detected - No Sentry, Rollbar, or similar integration

**Logs:**

- Console logging only for development:
  - ESLint rule: `no-console: ["warn", { allow: ["warn", "error"] }]`
  - Console warnings/errors allowed in production code
  - No structured logging service

**Analytics:**

- Not detected - No Google Analytics, Mixpanel, or telemetry service configured

## CI/CD & Deployment

**Hosting:**

- Vercel
  - Project: `portfolio`
  - Project ID: `prj_NUzrygDa4ReYYjuWu1XeWOTDMNAj`
  - Organization ID: `team_h45SsCDlspv4gYzid02Y2wZ3`
  - Configured in `.vercel/project.json`

**CI Pipeline:**

- Vercel automatic deployments (standard Next.js deploys on git push)
- Local pre-commit hooks via Husky and lint-staged:
  - Linting checks run before commit
  - Code formatting validation
  - Configuration: `.husky/_`, `.lintstagedrc`

## Environment Configuration

**Required env vars:**

- None - Application is fully self-contained

**Optional env vars:**

- Standard Node.js: `NODE_ENV` (set by Next.js/Vercel automatically)

**Secrets location:**

- Not applicable - No secrets or API keys needed

## Webhooks & Callbacks

**Incoming:**

- Not applicable - No external webhooks

**Outgoing:**

- Not applicable - No HTTP requests to external services

## Third-Party Integrations Summary

**Fonts:**

- Google Fonts (via `next/font/google`):
  - Geist font family (sans-serif and monospace)
  - Loaded in `app/layout.tsx`
  - Automatically optimized by Next.js

**Icons:**

- Lucide React (local library, no external dependency)
  - 880+ SVG icons
  - Used throughout components

## Build & Deployment Services

**Build:**

- Vercel builds (automatic on git push)
- Next.js build process:
  - React Compiler enabled for automatic memoization
  - Package imports optimized: `lucide-react`, `framer-motion`, `@xyflow/react`
  - Image optimization: AVIF and WebP formats

**Type Checking:**

- No external type checking service
- Local TypeScript compilation (`next build` includes type checking)

## Development Tools Integration

**Code Quality:**

- ESLint (local)
- Prettier (local)
- No external code quality services (CodeCov, Codacy, etc.)

**Git Integration:**

- GitHub repository
- Husky pre-commit hooks (GitHub-compatible)
- No GitHub Actions workflows detected
- Copilot instructions present (`.github/copilot-instructions.md`) for AI coding guidance

---

_Integration audit: 2026-02-05_
