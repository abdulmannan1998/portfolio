# Testing Patterns

**Analysis Date:** 2026-02-06

## Test Framework

**Current Status:** Not detected

**Framework Setup:**

- No test runner configured (Jest, Vitest, or other)
- No test configuration files found (`jest.config.ts`, `vitest.config.ts`, etc.)
- No test dependencies in `package.json`
- No `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` files in source directory

**Development Stack:**

- ESLint enabled for static analysis (catches many issues)
- TypeScript strict mode (compile-time safety)
- Prettier for code consistency (prevents style-related bugs)

## Testing Recommendations

### Framework Choice

Given this is a Next.js 16 portfolio with React 19, recommended frameworks:

**Option 1: Vitest (Recommended)**

- Modern, fast, Vite-native
- Works seamlessly with TypeScript
- Supports React component testing with `@testing-library/react`

**Option 2: Jest**

- More established, industry standard
- Native Next.js support
- Slightly slower build time

### Setup Pattern

If implementing Vitest:

```typescript
// vitest.config.ts (example)
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

## Test File Organization

**Recommended Structure:**

- Location: Co-located with source files
- Naming pattern: `[ComponentName].test.tsx` (alongside component)
- Alternative pattern: `__tests__/` directory per feature

**Example Organization:**

```
components/
├── custom-node.tsx
├── custom-node.test.tsx        # Co-located test
├── sections/
│   ├── graph-section.tsx
│   └── graph-section.test.tsx
lib/
├── graph-utils.ts
├── graph-utils.test.ts
└── debounce.ts
    └── debounce.test.ts
```

## Test Structure

**Standard Pattern (Recommended):**

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomNode } from "./custom-node";

describe("CustomNode", () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe("root node type", () => {
    it("should render root node with label", () => {
      const data = { label: "Mannan", type: "root" };
      render(<CustomNode data={data} selected={false} id="root" />);
      expect(screen.getByText("Mannan")).toBeInTheDocument();
    });

    it("should have orange styling when selected", () => {
      const data = { label: "Mannan", type: "root" };
      const { container } = render(
        <CustomNode data={data} selected={true} id="root" />,
      );
      expect(container.querySelector(".border-orange-500")).toBeInTheDocument();
    });
  });

  describe("company node type", () => {
    it("should render company node with period", () => {
      const data = { label: "Intenseye", type: "company", period: "2022-2025" };
      render(<CustomNode data={data} selected={false} id="company-1" />);
      expect(screen.getByText("2022-2025")).toBeInTheDocument();
    });
  });
});
```

**Suite Organization:**

- Use `describe()` for logical grouping (by component/function)
- Nest describe blocks for related test suites
- Each `it()` focuses on single behavior

**Common Setup Pattern:**

```typescript
// test/setup.ts
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Custom matchers or globals if needed
expect.extend({
  // Custom matchers here
});
```

## Mocking

**Framework:** `vitest` has built-in mocking via `vi`

**Patterns:**

### Mocking Modules

```typescript
import { vi } from "vitest";

// Mock entire module
vi.mock("@/lib/debounce", () => ({
  debounce: vi.fn((fn) => fn), // Debounce becomes synchronous in tests
}));

// Mock specific exports
vi.mock("@xyflow/react", async () => {
  const actual = await vi.importActual("@xyflow/react");
  return {
    ...actual,
    useReactFlow: vi.fn(() => ({
      fitView: vi.fn(),
      getNodes: vi.fn(() => []),
      getEdges: vi.fn(() => []),
    })),
  };
});
```

### Mocking Fetch

```typescript
it("should handle GitHub API errors", async () => {
  global.fetch = vi.fn().mockRejectedValue(
    new Error("Failed to fetch"),
  );

  render(<GitHubActivity username="test" />);

  await waitFor(() => {
    expect(screen.getByText("Unable to load activity")).toBeInTheDocument();
  });
});
```

### Mocking Zustand Store

```typescript
import { useGraphStore } from "@/lib/stores/graph-store";
import { vi } from "vitest";

vi.mock("@/lib/stores/graph-store", () => ({
  useGraphStore: vi.fn((selector) =>
    selector({
      expandedNodes: ["node-1"],
      expandNode: vi.fn(),
      collapseNode: vi.fn(),
      isCompanyRevealed: vi.fn(() => true),
    }),
  ),
}));
```

**What to Mock:**

- External API calls (GitHub, third-party services)
- React Flow instance and methods
- Zustand store for state testing
- Framer Motion for animation testing
- Dynamic imports

**What NOT to Mock:**

- Utility functions like `debounce()`, `cn()`, `formatTimeAgo()`
- Simple data transformations
- Component rendering internals (test behavior, not implementation)

## Fixtures and Factories

**Test Data Pattern:**

```typescript
// test/fixtures.ts
export const mockGitHubEvent = {
  id: "event-1",
  type: "PushEvent",
  repo: { name: "owner/repo", url: "https://github.com/owner/repo" },
  payload: {
    commits: [{ message: "Fix bug", sha: "abc123" }],
    ref: "main",
  },
  created_at: new Date().toISOString(),
  public: true,
};

export const mockAchievementNode = {
  id: "achievement-1",
  type: "achievement" as const,
  title: "Design System",
  description: "Built scalable design system",
  impact: "30% faster component development",
  technologies: ["React", "TypeScript"],
  company: "Intenseye",
  period: "2022-2023",
  category: "design-system" as const,
};

// Factory function
export function createMockGraphState(overrides = {}) {
  return {
    expandedNodes: [],
    hasStartedReveal: false,
    revealedCompanies: [],
    ...overrides,
  };
}
```

**Usage in Tests:**

```typescript
it("should format GitHub event message", () => {
  const message = getCommitMessage(mockGitHubEvent);
  expect(message).toBe("Fix bug");
});

it("should reveal company achievements", () => {
  const state = createMockGraphState({ revealedCompanies: ["intenseye"] });
  expect(state.isCompanyRevealed("intenseye")).toBe(true);
});
```

**Location:**

- `test/fixtures.ts` - Shared test data
- `test/factories.ts` - Factory functions
- Or co-located in `__tests__/` directories per feature

## Coverage

**Requirements:** Not enforced

**Recommended Configuration:**

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      exclude: ["node_modules/", "test/", "**/*.d.ts", "**/*.config.*"],
      lines: 70, // Target 70% coverage
      functions: 70,
      branches: 65,
      statements: 70,
    },
  },
});
```

**View Coverage:**

```bash
npm run test:coverage    # Generate coverage report
npm run test:coverage:ui # View HTML report
```

## Test Types

**Unit Tests:**

- Scope: Individual functions and utilities
- Location: `lib/debounce.test.ts`, `lib/graph-utils.test.ts`
- Approach: Pure function testing

**Example:**

```typescript
import { debounce } from "@/lib/debounce";
import { vi } from "vitest";

it("should debounce function calls", async () => {
  const mockFn = vi.fn();
  const debouncedFn = debounce(mockFn, 100);

  debouncedFn();
  debouncedFn();
  debouncedFn();

  expect(mockFn).not.toHaveBeenCalled();

  await new Promise((resolve) => setTimeout(resolve, 150));
  expect(mockFn).toHaveBeenCalledOnce();
});
```

**Component Tests:**

- Scope: React components in isolation
- Location: `components/custom-node.test.tsx`
- Approach: User interaction and state changes

**Example:**

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { CustomNode } from "@/components/custom-node";

it("should call onHoverChange when mouse enters company node", () => {
  const mockOnHover = vi.fn();
  const data = {
    label: "Intenseye",
    type: "company",
    onHoverChange: mockOnHover,
  };

  const { container } = render(
    <CustomNode data={data} selected={false} id="company-1" />,
  );

  const node = container.querySelector(".relative");
  fireEvent.mouseEnter(node!);

  expect(mockOnHover).toHaveBeenCalledWith("company-1", true);
});
```

**Integration Tests:**

- Scope: Multiple components working together
- Location: `__tests__/integration/` or feature directories
- Approach: Full feature workflows

**Example:**

```typescript
// graph-section.integration.test.tsx
it("should expand achievements when company node is hovered", async () => {
  const { getByText, getAllByText } = render(<GraphSection />);

  const companyNode = getByText("Intenseye");
  fireEvent.mouseEnter(companyNode);

  await waitFor(() => {
    expect(
      getAllByText(/Design System|CLI Tooling|React Query/),
    ).toBeDefined();
  });
});
```

**E2E Tests:**

- Framework: Not configured
- Recommended: Playwright or Cypress
- Approach: Full user journeys in real browser

## Common Patterns

**Async Testing:**

```typescript
import { waitFor } from "@testing-library/react";

it("should fetch and display GitHub activity", async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [mockGitHubEvent],
  });

  render(<GitHubActivity username="sunnyimmortal" />);

  // Wait for async operations to complete
  await waitFor(() => {
    expect(screen.getByText(/Latest Push/i)).toBeInTheDocument();
  });
});
```

**Error Testing:**

```typescript
it("should display error message when fetch fails", async () => {
  global.fetch = vi.fn().mockRejectedValue(
    new Error("Network error"),
  );

  render(<GitHubActivity username="test" />);

  await waitFor(() => {
    expect(
      screen.getByText("Unable to load activity"),
    ).toBeInTheDocument();
  });
});
```

**State Testing with Zustand:**

```typescript
import { renderHook, act } from "@testing-library/react";
import { useGraphStore } from "@/lib/stores/graph-store";

it("should expand and collapse nodes", () => {
  const { result } = renderHook(() => useGraphStore());

  act(() => {
    result.current.expandNode("node-1");
  });

  expect(result.current.expandedNodes).toContain("node-1");

  act(() => {
    result.current.collapseNode("node-1");
  });

  expect(result.current.expandedNodes).not.toContain("node-1");
});
```

**Animation Testing (Framer Motion):**

```typescript
it("should render with initial motion properties", () => {
  const { container } = render(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      Content
    </motion.div>,
  );

  // Note: Motion animations are difficult to test without disabling
  // Skip detailed animation testing or use motion's testing utilities
  expect(container.querySelector("div")).toBeInTheDocument();
});
```

## Scripts

**Run Commands (Recommended):**

```bash
# package.json additions
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Generate coverage report
npm run test:ui          # Test UI dashboard (Vitest)
```

---

_Testing analysis: 2026-02-06_
