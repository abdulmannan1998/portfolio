# Testing Patterns

**Analysis Date:** 2026-02-05

## Test Framework

**Status:** Not Configured

**Findings:**

- No test runner installed (Jest, Vitest, or other)
- No test files found in codebase (_.test.ts, _.test.tsx, _.spec.ts, _.spec.tsx)
- No testing dependencies in `package.json` (line 14-48 in `/Users/sunny/Desktop/Sunny/portfolio/package.json`)
- No test configuration files (jest.config._, vitest.config._)

**Recommendation:**
When test infrastructure is added, use Vitest (modern, fast, Vite-compatible) or Jest with TypeScript support.

## Run Commands (If Configured)

When testing is implemented, add commands to `package.json`:

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Generate coverage report
```

## Test File Organization (Recommended)

**Location:**

- Co-located with source code (recommended pattern for Next.js/React)
- Each component/utility with tests alongside: `Component.tsx` + `Component.test.tsx` or `Component.spec.tsx`

**Naming:**

- `ComponentName.test.tsx` for component tests
- `utilityName.test.ts` for utility/function tests
- `hookName.test.ts` for custom hook tests

**Directory structure:**

```
components/
├── dashboard-background.tsx
├── dashboard-background.test.tsx
├── custom-node.tsx
├── custom-node.test.tsx
├── nodes/
│   ├── achievement-node.tsx
│   └── achievement-node.test.tsx
lib/
├── debounce.ts
├── debounce.test.ts
├── graph-utils.ts
└── graph-utils.test.ts
hooks/
├── use-responsive-layout.ts
└── use-responsive-layout.test.ts
```

## Test Structure (Recommended Pattern)

Based on codebase structure and dependencies, recommended test patterns:

**Component Test Pattern:**

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LiveMetricWidget } from "@/components/live-metric-widget";

describe("LiveMetricWidget", () => {
  it("renders metric data correctly", () => {
    const mockData = {
      id: "productivity",
      label: "Team Productivity",
      value: "+40%",
      context: "Internal tooling",
      company: "Intenseye",
      relatedAchievements: [],
      relatedTechnologies: [],
    };

    render(<LiveMetricWidget data={mockData} delay={0} />);

    expect(screen.getByText("Team Productivity")).toBeInTheDocument();
    expect(screen.getByText("+40%")).toBeInTheDocument();
  });

  it("applies animation delay prop", () => {
    const { container } = render(
      <LiveMetricWidget data={mockData} delay={0.5} />,
    );
    // Verify motion.div received delay prop via data attributes
  });
});
```

**Hook Test Pattern (using @testing-library/react):**

```typescript
import { renderHook, act } from "@testing-library/react";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";

describe("useResponsiveLayout", () => {
  it("returns correct breakpoint for desktop", () => {
    // Mock window size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });

    const { result } = renderHook(() => useResponsiveLayout());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });

  it("handles resize events with debounce", async () => {
    const { result, rerender } = renderHook(() => useResponsiveLayout());

    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 500 });
      window.dispatchEvent(new Event("resize"));
    });

    // Verify debounce delays update
  });
});
```

**Utility Function Test Pattern:**

```typescript
import { debounce } from "@/lib/debounce";
import { vi } from "vitest"; // or jest.fn() for Jest

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("delays function execution", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("test");
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledWith("test");
  });

  it("cancels previous call when invoked again", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("first");
    vi.advanceTimersByTime(150);
    debouncedFn("second");
    vi.advanceTimersByTime(300);

    expect(mockFn).toHaveBeenCalledOnce();
    expect(mockFn).toHaveBeenCalledWith("second");
  });
});
```

## Mocking

**Recommended Framework:** Vitest's built-in mocking or Jest

**Patterns for common scenarios:**

**Mocking React Flow (complex library):**

```typescript
// Mock @xyflow/react components
vi.mock("@xyflow/react", () => ({
  ReactFlow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="react-flow">{children}</div>
  ),
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useNodesState: vi.fn(() => [[], vi.fn()]),
  useEdgesState: vi.fn(() => [[], vi.fn()]),
  Background: () => null,
  Handle: () => null,
  Position: { Top: "top", Bottom: "bottom" },
}));
```

**Mocking Zustand store:**

```typescript
// For testing components that use useGraphStore
import { useGraphStore } from "@/lib/stores/graph-store";

vi.mock("@/lib/stores/graph-store", () => ({
  useGraphStore: vi.fn(() => ({
    expandedNodes: new Set(),
    expandNode: vi.fn(),
    collapseNode: vi.fn(),
    highlightedConnections: new Set(),
    hoveredNode: null,
  })),
}));
```

**Mocking framer-motion:**

```typescript
// Skip animation delays in tests
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: (props: any) => <div {...props} />,
    },
  };
});
```

**Mocking window/DOM APIs:**

```typescript
// Mock ResizeObserver (used in dashboard-background.tsx line 221)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

## What to Mock

- **External libraries:** React Flow, Framer Motion, Zustand stores
- **Window APIs:** ResizeObserver, matchMedia, requestAnimationFrame
- **Next.js features:** `next/dynamic`, `next/font`, routes
- **API calls:** Would be mocked if backend integration existed

## What NOT to Mock

- **Utility functions:** Test actual debounce, cn(), date parsing
- **React hooks (useState, useEffect, useCallback):** Use real implementations
- **DOM elements:** Render actual components; query with testing-library selectors
- **Type definitions:** No need to mock types

## Fixtures and Test Data

**Test Data Location:**
Create `__tests__/fixtures/` or `*.fixtures.ts` files alongside test files

**Pattern for mock RESUME_DATA:**

```typescript
// lib/__tests__/fixtures/resume-data.ts
import type { Node, Edge } from "@xyflow/react";

export const mockMetric = {
  id: "test-metric",
  label: "Test Metric",
  value: "+50%",
  context: "Test context",
  company: "Test Company",
  relatedAchievements: [],
  relatedTechnologies: ["TypeScript"],
};

export const mockAchievementNode = {
  id: "test-achievement",
  type: "achievement" as const,
  title: "Test Achievement",
  description: "A test achievement",
  impact: "High impact",
  technologies: ["React", "TypeScript"],
  company: "Test Company",
  period: "2024-2025",
  category: "architecture" as const,
};

export const mockGraphNodes: Node[] = [
  {
    id: "root",
    type: "custom",
    data: { label: "Test Name", type: "root" },
    position: { x: 0, y: 0 },
  },
];
```

**Usage in tests:**

```typescript
import { mockMetric, mockAchievementNode } from "@/__tests__/fixtures/resume-data";

describe("Components using resume data", () => {
  it("renders metric widget", () => {
    render(<LiveMetricWidget data={mockMetric} />);
    expect(screen.getByText("Test Metric")).toBeInTheDocument();
  });
});
```

## Coverage

**Requirements:** Not enforced

**When tests are implemented:**

- Recommend minimum 70% coverage for components
- Recommend minimum 80% coverage for utilities and hooks
- Focus on critical paths first (user interactions, state management)

**View Coverage (once configured):**

```bash
npm run test:coverage
# or
vitest --coverage
```

## Test Types

**Unit Tests:**

- **Scope:** Individual functions, utilities, hooks, components in isolation
- **Approach:** Test one thing per test; mock external dependencies
- **Location:** Alongside source files (`component.test.tsx`)
- **Examples to write:**
  - `debounce()` function behavior with timers
  - `useResponsiveLayout()` hook with mocked window events
  - Utility functions like `getInitialNodes()`, `getEdgeColor()`

**Integration Tests:**

- **Scope:** Multiple components working together, state flow
- **Approach:** Minimal mocking; test real interactions
- **Examples to write:**
  - `DashboardBackground` component with graph rendering
  - Achievement node expansion/collapse with store updates
  - Responsive layout changes affecting component rendering

**E2E Tests:**

- **Framework:** Not configured (would use Playwright or Cypress)
- **Approach:** Full browser testing of user journeys
- **Not currently implemented**

## Common Patterns

**Async Testing:**

```typescript
it("handles async data loading", async () => {
  render(<Component />);

  // Wait for element to appear
  const element = await screen.findByRole("heading", { name: /loaded/ });
  expect(element).toBeInTheDocument();
});

// With userEvent
it("handles user interaction", async () => {
  const user = userEvent.setup();
  render(<Component />);

  await user.click(screen.getByRole("button", { name: /expand/ }));
  expect(screen.getByText("expanded")).toBeInTheDocument();
});
```

**State Updates in React:**

```typescript
import { act } from "@testing-library/react";

it("updates state correctly", async () => {
  const { result } = renderHook(() => useState(0));

  act(() => {
    // Trigger state update
    result.current[1](5);
  });

  expect(result.current[0]).toBe(5);
});
```

**Testing Custom Hooks with Dependencies:**

```typescript
it("responds to prop changes", () => {
  const { rerender } = renderHook(({ nodeId }) => useExpandedState(nodeId), {
    initialProps: { nodeId: "node-1" },
  });

  rerender({ nodeId: "node-2" });
  // Verify hook behavior with new nodeId
});
```

**Testing Zustand Store:**

```typescript
import { renderHook, act } from "@testing-library/react";
import { useGraphStore } from "@/lib/stores/graph-store";

it("expands and collapses nodes", () => {
  const { result } = renderHook(() => useGraphStore());

  act(() => {
    result.current.expandNode("achievement-1");
  });

  expect(result.current.expandedNodes.has("achievement-1")).toBe(true);

  act(() => {
    result.current.collapseNode("achievement-1");
  });

  expect(result.current.expandedNodes.has("achievement-1")).toBe(false);
});
```

## Setup/Teardown Patterns

**Global test setup (vitest.config.ts or jest.setup.ts):**

```typescript
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock window.matchMedia globally
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

**Per-test setup:**

```typescript
beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

---

_Testing analysis: 2026-02-05_

**Note:** This document describes recommended testing patterns for when test infrastructure is implemented. Currently, no tests exist in the codebase. Priority areas for test coverage when implemented:

1. Utility functions (debounce, layout calculations)
2. Zustand store actions
3. Custom hooks (useResponsiveLayout)
4. Component interaction patterns (node expansion, state sync)
