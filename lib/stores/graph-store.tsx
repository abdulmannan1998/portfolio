"use client";

import { create } from "zustand";

type GraphState = {
  // Expanded nodes (array for JSON serializability)
  expandedNodes: string[];
  expandNode: (id: string) => void;
  collapseNode: (id: string) => void;
  collapseAll: () => void;
};

export const useGraphStore = create<GraphState>((set) => ({
  // Initial state
  expandedNodes: [],

  // Actions
  expandNode: (id) =>
    set((state) => ({
      expandedNodes: state.expandedNodes.includes(id)
        ? state.expandedNodes
        : [...state.expandedNodes, id],
    })),

  collapseNode: (id) =>
    set((state) => ({
      expandedNodes: state.expandedNodes.filter((nodeId) => nodeId !== id),
    })),

  collapseAll: () => set({ expandedNodes: [] }),
}));
