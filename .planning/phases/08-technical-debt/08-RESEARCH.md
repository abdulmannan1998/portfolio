# Phase 8: Technical Debt - Research

**Researched:** 2026-02-06
**Domain:** React cleanup patterns, debounce utilities, API caching, documentation maintenance
**Confidence:** HIGH

## Summary

Phase 8 addresses four distinct technical debt items in a Next.js 16/React 19 portfolio application: timeout cleanup in animation sequences, debounce function design, GitHub API caching, and documentation accuracy. The research covers best practices for each domain, focusing on patterns that prevent memory leaks, improve performance, and maintain code quality.

The standard approach for timeout cleanup uses useEffect cleanup functions that mirror setup logic. Debounce utilities should return cleanup functions to allow consumers to cancel pending operations. GitHub API caching can be implemented using dedicated libraries (SWR/TanStack Query) or manual approaches with localStorage/memory cache. Documentation maintenance requires establishing ownership, using version control, and keeping docs close to code.

**Primary recommendation:** Use React's built-in cleanup patterns for timeouts, extend debounce to return cleanup functions, implement simple memory-based caching for GitHub API with TTL, and update documentation to reflect the current modular component structure from Phase 7.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library    | Version | Purpose         | Why Standard                                                        |
| ---------- | ------- | --------------- | ------------------------------------------------------------------- |
| React      | 19.2.3  | UI framework    | useEffect cleanup is the standard pattern for managing side effects |
| Next.js    | 16.1.6  | React framework | App Router with client components for GitHub API calls              |
| TypeScript | ^5      | Type safety     | Ensures cleanup function signatures are correct                     |

### Supporting

| Library        | Version | Purpose       | When to Use                                                     |
| -------------- | ------- | ------------- | --------------------------------------------------------------- |
| SWR            | ^2.2    | Data fetching | If implementing comprehensive caching solution (5.3KB)          |
| TanStack Query | ^5.0    | Data fetching | For advanced caching with mutations (16.2KB, includes DevTools) |
| localStorage   | Native  | Simple cache  | For lightweight caching without dependencies                    |

### Alternatives Considered

| Instead of           | Could Use                           | Tradeoff                                                  |
| -------------------- | ----------------------------------- | --------------------------------------------------------- |
| Manual cleanup       | useEffectEvent (React experimental) | More stable event handlers but still experimental         |
| Memory cache         | SWR/TanStack Query                  | Libraries add 5-16KB but provide sophisticated features   |
| Version control docs | Auto-generation tools               | Auto-gen can create verbose docs; manual is more tailored |

**Installation:**

```bash
# If choosing SWR for GitHub API
npm install swr

# If choosing TanStack Query for GitHub API
npm install @tanstack/react-query
```

## Architecture Patterns

### Recommended Project Structure

```
/components/
├── sections/           # Page sections with isolated logic
├── github-activity.tsx # GitHub API consumer
└── ...

/lib/
├── debounce.ts        # Utility functions
├── stores/            # Zustand stores
└── ...

/docs/                 # Optional: separate documentation
├── DESIGN.md         # Visual guidelines
└── ARCHITECTURE.md   # Technical structure

# Alternative: Keep docs in root
/DESIGN.md
/README.md
```

### Pattern 1: useEffect Cleanup for Timers

**What:** Return cleanup function from useEffect that clears all timers created in setup
**When to use:** Any component that creates timers in useEffect
**Example:**

```typescript
// Source: https://react.dev/reference/react/useEffect
useEffect(() => {
  // Save timer ID
  const timerId = setTimeout(() => {
    setNodes((prev) => [...prev, newNode]);
  }, 500);

  // Return cleanup that mirrors setup
  return () => {
    clearTimeout(timerId);
  };
}, [dependencies]);
```

**Key principles:**

- Store timer IDs in variables
- Cleanup function should "undo" what setup did
- Use state updater functions `setState(prev => ...)` to avoid adding state as dependency
- Empty dependency array `[]` for timers that should only run once

### Pattern 2: Sequential Timeout Chains with Cleanup

**What:** Multiple setTimeout calls in sequence, each with its own cleanup
**When to use:** Animation sequences like graph reveal
**Example:**

```typescript
// Source: React best practices + portfolio graph-section.tsx analysis
useEffect(() => {
  const timeouts: NodeJS.Timeout[] = [];

  // Create sequence
  timeouts.push(setTimeout(() => addNode("A"), 200));
  timeouts.push(setTimeout(() => addNode("B"), 400));
  timeouts.push(setTimeout(() => addNode("C"), 600));

  // Single cleanup clears all
  return () => {
    timeouts.forEach(clearTimeout);
  };
}, []);
```

**Current portfolio issue:**

- graph-section.tsx (lines 171-191) creates multiple setTimeout calls in `startRevealSequence`
- No cleanup array to track all timers
- Component unmount during animation could leave timers running

### Pattern 3: Debounce with Cleanup Function

**What:** Debounce utility that returns both debounced function and cleanup
**When to use:** User input, resize handlers, or any high-frequency event
**Example:**

```typescript
// Source: https://blog.logrocket.com/create-custom-debounce-hook-react/
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): [(...args: Parameters<T>) => void, () => void] {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  const cancel = () => {
    if (timeout) clearTimeout(timeout);
  };

  return [debounced, cancel];
}

// Usage
useEffect(() => {
  const [debouncedFitView, cancel] = debounce(() => {
    reactFlowInstance?.fitView({ padding: 0.15 });
  }, 150);

  return cancel; // Cleanup
}, [reactFlowInstance]);
```

**Alternative pattern (single return):**

```typescript
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };

  return debounced;
}
```

### Pattern 4: Simple GitHub API Caching

**What:** In-memory cache with TTL to prevent redundant fetches
**When to use:** Simple use cases with single API endpoint and no mutations
**Example:**

```typescript
// Source: GitHub API best practices + rate limit docs
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}
```

**For portfolio (github-activity.tsx):**

```typescript
// Lightweight: localStorage with TTL
const CACHE_KEY = "github_events";
const CACHE_TTL = 5 * 60 * 1000;

function getCachedEvents(): GitHubEvent[] | null {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_TTL) return null;
  return data;
}

function setCachedEvents(events: GitHubEvent[]) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data: events,
      timestamp: Date.now(),
    }),
  );
}
```

### Pattern 5: Documentation Ownership and Maintenance

**What:** Assign clear ownership to documentation files and establish update triggers
**When to use:** Any project with technical documentation
**Example:**

```typescript
// In package.json or CONTRIBUTING.md
{
  "documentation": {
    "DESIGN.md": {
      "owner": "frontend-team",
      "update-triggers": ["visual changes", "new components"],
      "review-frequency": "quarterly"
    },
    "README.md": {
      "owner": "all-contributors",
      "update-triggers": ["setup changes", "deployment changes"],
      "review-frequency": "per-release"
    }
  }
}
```

**Documentation patterns:**

- Keep docs close to code (co-located)
- Use version control for all documentation
- Update docs in same PR as code changes
- Include "last updated" dates
- Remove outdated sections rather than leaving stale info

### Anti-Patterns to Avoid

- **Creating timers without cleanup:** Every setTimeout/setInterval must have corresponding clearTimeout/clearInterval
- **Adding state to useEffect dependencies when using in timer:** Use state updater functions instead
- **Debounce without cancel:** Consumers cannot cleanup, causing potential memory leaks
- **Fetching without deduplication:** Multiple components mounting causes redundant API calls
- **Hardcoded data in components:** All portfolio content should come from resume-data.ts (per DESIGN.md)
- **Stale documentation:** Better to delete than leave incorrect information

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                         | Don't Build                                              | Use Instead                        | Why                                                                                                           |
| ------------------------------- | -------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Advanced data caching           | Custom cache with invalidation, refetching, mutations    | SWR or TanStack Query              | Libraries handle request deduplication, stale-while-revalidate, mutations, optimistic updates, and edge cases |
| Comprehensive debounce/throttle | Full lodash-style debounce with leading/trailing options | lodash.debounce or usehooks-ts     | Production libraries handle all edge cases (immediate execution, max wait, etc.)                              |
| HTTP cache headers              | Custom Service Worker caching logic                      | Next.js fetch() with cache options | Next.js provides built-in caching with revalidation                                                           |

**Key insight:** For this portfolio project, simple solutions are appropriate. The GitHub API is called from a single component with no mutations. A basic cache with TTL is sufficient. Don't over-engineer by adding 16KB library for a simple use case. However, if caching needs expand (multiple endpoints, mutations, background refetch), migrate to SWR.

## Common Pitfalls

### Pitfall 1: Missing Cleanup in Callback-Created Timers

**What goes wrong:** Timers created inside callbacks (not directly in useEffect) are not tracked for cleanup
**Why it happens:** Developers focus on useEffect timers but forget timers created in event handlers or other callbacks
**How to avoid:** Use useRef to store all timer IDs, clear them in useEffect cleanup
**Warning signs:** Memory leaks, timers firing after component unmounts
**Example:**

```typescript
// ❌ Problem: startRevealSequence creates timers but isn't in useEffect
const startRevealSequence = useCallback(() => {
  setTimeout(() => addNodeAndEdges("Bilkent"), 1000);
  setTimeout(() => addNodeAndEdges("Layermark"), 2000);
  // No cleanup tracking
}, []);

// ✅ Solution: Track in ref, cleanup in useEffect
const timersRef = useRef<NodeJS.Timeout[]>([]);

const startRevealSequence = useCallback(() => {
  timersRef.current.push(setTimeout(() => addNodeAndEdges("Bilkent"), 1000));
  timersRef.current.push(setTimeout(() => addNodeAndEdges("Layermark"), 2000));
}, []);

useEffect(() => {
  return () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
}, []);
```

### Pitfall 2: Debounce Created in Render

**What goes wrong:** Debounce function recreated on every render, preventing debouncing
**Why it happens:** Calling debounce() directly in component body instead of useMemo/useCallback
**How to avoid:** Wrap debounce in useMemo and return cleanup in useEffect
**Warning signs:** Debounce not working, function fires on every call
**Example:**

```typescript
// ❌ Problem: Creates new debounced function every render
function Component() {
  const debouncedFitView = debounce(() => {
    reactFlowInstance?.fitView();
  }, 150);
  // debouncedFitView is a new function every render!
}

// ✅ Solution: Memoize and cleanup
function Component() {
  const debouncedFitView = useMemo(
    () =>
      debounce(() => {
        reactFlowInstance?.fitView({ padding: 0.15 });
      }, 150),
    [reactFlowInstance],
  );

  useEffect(() => {
    return () => debouncedFitView.cancel?.(); // Cleanup if implemented
  }, [debouncedFitView]);
}
```

### Pitfall 3: GitHub API Rate Limit Exceeded

**What goes wrong:** Hitting 60 requests/hour limit for unauthenticated requests
**Why it happens:** No caching, multiple components fetching, page refreshes during development
**How to avoid:** Implement cache with 5-minute TTL, check rate limit headers
**Warning signs:** 403 responses, "API rate limit exceeded" errors
**Example:**

```typescript
// Check rate limit headers in response
const response = await fetch(
  `https://api.github.com/users/${username}/events/public?per_page=5`,
);

const remaining = response.headers.get("x-ratelimit-remaining");
const reset = response.headers.get("x-ratelimit-reset");

if (remaining === "0") {
  const resetDate = new Date(parseInt(reset!) * 1000);
  console.warn(`Rate limit exceeded. Resets at ${resetDate}`);
}
```

### Pitfall 4: Documentation Drift

**What goes wrong:** Documentation describes old architecture after refactoring
**Why it happens:** Code changes in one PR, documentation updates forgotten
**How to avoid:** Update docs in same PR as code changes, add "last updated" dates
**Warning signs:** New developers follow outdated patterns, confusion about structure
**Example:**

```markdown
<!-- ❌ Problem: DESIGN.md says monolithic page.tsx -->

## File Structure

/app/page.tsx # Main portfolio page with all sections

<!-- ✅ Solution: Update to reflect Phase 7 splitting -->

## File Structure

/app/page.tsx # Main portfolio page (imports sections)
/components/sections/
/metrics-section.tsx # Impact metrics
/experience-timeline.tsx # Career timeline
/graph-section.tsx # Interactive graph

<!-- Last updated: 2026-02-06 -->
```

## Code Examples

Verified patterns from official sources:

### Timer Cleanup in useEffect

```typescript
// Source: https://react.dev/reference/react/useEffect
import { useEffect, useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // Use updater function
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup
  }, []); // Empty deps - runs once

  return <h1>{count}</h1>;
}
```

### Multiple Timers in Animation Sequence

```typescript
// Pattern for graph reveal sequence with proper cleanup
useEffect(() => {
  const timeouts: NodeJS.Timeout[] = [];

  // Don't start if already started
  if (hasStartedReveal) return;
  startReveal(); // Mark as started

  // Create animation sequence
  softSkillNodes.forEach((id, index) => {
    timeouts.push(
      setTimeout(() => {
        addNodeAndEdges(id);
      }, index * 200),
    );
  });

  timeouts.push(
    setTimeout(() => {
      addNodeAndEdges("Bilkent");
    }, REVEAL_TIMING.EDUCATION_DELAY_MS),
  );

  timeouts.push(
    setTimeout(() => {
      debouncedFitView();
    }, REVEAL_TIMING.INTENSEYE_DELAY_MS + 500),
  );

  // Cleanup all timers
  return () => {
    timeouts.forEach(clearTimeout);
  };
}, [hasStartedReveal, addNodeAndEdges, debouncedFitView]);
```

### Debounce with Cleanup

```typescript
// Source: https://blog.logrocket.com/create-custom-debounce-hook-react/
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

// Usage in component
const debouncedFitView = useMemo(
  () =>
    debounce(() => {
      reactFlowInstance?.fitView({ padding: 0.15, duration: 800 });
    }, 150),
  [reactFlowInstance],
);

useEffect(() => {
  return () => debouncedFitView.cancel(); // Cleanup
}, [debouncedFitView]);
```

### GitHub API with Simple Cache

```typescript
// Simple memory cache with TTL
type CacheEntry = {
  data: GitHubEvent[];
  timestamp: number;
};

const eventCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchGitHubEvents(username: string): Promise<GitHubEvent[]> {
  // Check cache
  const cacheKey = `github_events_${username}`;
  const cached = eventCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Returning cached GitHub events");
    return cached.data;
  }

  // Fetch from API
  const response = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=5`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub events");
  }

  const data = await response.json();

  // Update cache
  eventCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });

  return data;
}
```

### Documentation Update Template

```markdown
# Design Philosophy & Guidelines

**Last Updated:** 2026-02-06
**Maintainer:** @sunny

<!-- Update trigger: After any visual/structural changes -->

## Recent Changes

### 2026-02-06 - Phase 7: Code Splitting

- Split monolithic page.tsx into modular sections
- Added /components/sections/ directory
- Extracted metrics, experience, graph into separate files

## File Structure

\`\`\`
/app/page.tsx # Main portfolio (imports sections)
/components/sections/ # Modular page sections (NEW)
/metrics-section.tsx # Impact metrics
/experience-timeline.tsx # Career timeline
/graph-section.tsx # Interactive graph
/components/ # Reusable components
/github-activity.tsx # GitHub feed widget
/graph-legend.tsx # Graph legend
/custom-node.tsx # React Flow custom nodes
/lib/ # Utilities and stores
/debounce.ts # Debounce utility
/stores/graph-store.tsx # Graph state (Zustand)
/data/resume-data.ts # All portfolio content
\`\`\`

<!-- Previous structure removed to avoid confusion -->
```

## State of the Art

| Old Approach                | Current Approach               | When Changed                | Impact                                              |
| --------------------------- | ------------------------------ | --------------------------- | --------------------------------------------------- |
| Timers without cleanup      | Always return cleanup function | React 16.8+ (Hooks)         | Prevents memory leaks in modern React               |
| Manual cache implementation | SWR/TanStack Query             | ~2020-2021                  | But simple cache is still valid for basic use cases |
| Class lifecycle cleanup     | useEffect cleanup function     | React 16.8+ (Hooks)         | Simpler, co-located setup/cleanup                   |
| useMemo for debounce        | useCallback + cleanup          | Ongoing best practice       | Better memory management                            |
| Docs in wiki/external       | Docs in repo with code         | Continuous (DevOps culture) | Single source of truth                              |

**Deprecated/outdated:**

- **ComponentWillUnmount:** Use useEffect cleanup instead
- **AbortController with every fetch:** Next.js handles this internally in many cases
- **lodash.debounce for simple cases:** Modern utils can be lightweight and typed

## Open Questions

Things that couldn't be fully resolved:

1. **Should we use SWR or keep simple cache?**
   - What we know: Portfolio has single GitHub API call, no mutations, simple caching needs
   - What's unclear: Future plans for additional API integration
   - Recommendation: Start with simple memory cache (0KB). If adding more APIs or mutations, migrate to SWR (5.3KB) or TanStack Query (16.2KB with DevTools)

2. **Where should PROJECT.md be created?**
   - What we know: DESIGN.md exists in root, describes visual identity
   - What's unclear: Whether PROJECT.md should be in root or /docs, or if it should be ARCHITECTURE.md
   - Recommendation: Create in root as ARCHITECTURE.md (pairs with DESIGN.md), or update DESIGN.md to include structure info

3. **Should timers in resize observer be cleaned up differently?**
   - What we know: ResizeObserver has cleanup, but timeout inside it (line 204-220) also needs tracking
   - What's unclear: Whether the ResizeObserver.disconnect() is sufficient
   - Recommendation: Explicitly clear the timeout in cleanup to be safe

## Sources

### Primary (HIGH confidence)

- React useEffect documentation - https://react.dev/reference/react/useEffect
- GitHub REST API Rate Limits - https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- Portfolio codebase analysis (package.json, graph-section.tsx, debounce.ts, github-activity.tsx, DESIGN.md)

### Secondary (MEDIUM confidence)

- [React useEffect Cleanup | Refine](https://refine.dev/blog/useeffect-cleanup/)
- [Understanding React clearTimeout | DhiWise](https://www.dhiwise.com/post/ultimate-guide-to-using-react-cleartimeout-in-applications)
- [Create custom debounce Hook | LogRocket](https://blog.logrocket.com/create-custom-debounce-hook-react/)
- [Best Practices for GitHub API Rate Limits | GitHub Community](https://github.com/orgs/community/discussions/151675)
- [React SWR Documentation | Vercel](https://swr.vercel.app/)
- [TanStack Query vs SWR Comparison | Refine](https://refine.dev/blog/react-query-vs-tanstack-query-vs-swr-2025/)
- [Documentation Maintenance Best Practices | Archbee](https://www.archbee.com/blog/developer-documentation-maintenance)
- [IT Documentation Best Practices 2026 | NinjaOne](https://www.ninjaone.com/blog/it-documentation-best-practices/)

### Tertiary (LOW confidence)

- Various blog posts on debouncing and throttling (cross-referenced with official React docs)
- Community discussions on caching strategies (verified against MDN Cache API docs)

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - React/Next.js patterns verified with official docs
- Architecture: HIGH - Cleanup patterns from React docs, caching patterns from GitHub docs
- Pitfalls: HIGH - Based on codebase analysis and official documentation

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days - stable patterns, React 19 is current)

**Codebase context:**

- React 19.2.3 with Next.js 16.1.6
- Current setTimeout chains in graph-section.tsx lines 171-191 need cleanup tracking
- Current debounce.ts (11 lines) doesn't return cleanup function
- Current github-activity.tsx (176 lines) fetches without caching
- DESIGN.md exists but may need structure updates post-Phase 7 splitting
