"use client";

import { create } from "zustand";

type ViewMode = "timeline" | "technology" | "impact" | "compact";

type FilterState = {
  technologies: string[];
  companies: string[];
  categories: string[];
};

type GraphState = {
  // Expanded nodes
  expandedNodes: Set<string>;
  expandNode: (id: string) => void;
  collapseNode: (id: string) => void;
  collapseAll: () => void;

  // Highlighting
  highlightedConnections: Set<string>;
  highlightConnections: (nodeIds: string[]) => void;
  clearHighlights: () => void;

  // Filtering
  activeFilters: FilterState;
  applyFilter: (filterType: keyof FilterState, value: string) => void;
  clearFilters: () => void;

  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Hover state
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
};

export const useGraphStore = create<GraphState>((set) => ({
  // Initial state
  expandedNodes: new Set(),
  highlightedConnections: new Set(),
  activeFilters: {
    technologies: [],
    companies: [],
    categories: [],
  },
  viewMode: "timeline",
  hoveredNode: null,

  // Actions
  expandNode: (id) =>
    set((state) => ({
      expandedNodes: new Set(state.expandedNodes).add(id),
    })),

  collapseNode: (id) =>
    set((state) => {
      const newSet = new Set(state.expandedNodes);
      newSet.delete(id);
      return { expandedNodes: newSet };
    }),

  collapseAll: () => set({ expandedNodes: new Set() }),

  highlightConnections: (nodeIds) =>
    set({ highlightedConnections: new Set(nodeIds) }),

  clearHighlights: () => set({ highlightedConnections: new Set() }),

  applyFilter: (filterType, value) =>
    set((state) => {
      const currentFilters = state.activeFilters[filterType];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter((v) => v !== value)
        : [...currentFilters, value];

      return {
        activeFilters: {
          ...state.activeFilters,
          [filterType]: newFilters,
        },
      };
    }),

  clearFilters: () =>
    set({
      activeFilters: {
        technologies: [],
        companies: [],
        categories: [],
      },
    }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setHoveredNode: (id) => set({ hoveredNode: id }),
}));
