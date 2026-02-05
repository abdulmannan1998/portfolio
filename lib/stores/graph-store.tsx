"use client";

import { create } from "zustand";

type GraphState = {
  // Expanded nodes
  expandedNodes: Set<string>;
  expandNode: (id: string) => void;
  collapseNode: (id: string) => void;
  collapseAll: () => void;
};

export const useGraphStore = create<GraphState>((set) => ({
  // Initial state
  expandedNodes: new Set(),

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
}));
