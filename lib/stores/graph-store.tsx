"use client";

import { create } from "zustand";

type GraphState = {
  // Expanded nodes (array for JSON serializability)
  expandedNodes: string[];
  expandNode: (id: string) => void;
  collapseNode: (id: string) => void;
  collapseAll: () => void;

  // Reveal tracking state
  hasStartedReveal: boolean;
  revealedCompanies: string[];
  startReveal: () => void;
  markCompanyRevealed: (companyId: string) => void;
  isCompanyRevealed: (companyId: string) => boolean;
};

export const useGraphStore = create<GraphState>((set, get) => ({
  // Initial state
  expandedNodes: [],
  hasStartedReveal: false,
  revealedCompanies: [],

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

  startReveal: () => set({ hasStartedReveal: true }),

  markCompanyRevealed: (companyId) =>
    set((state) => ({
      revealedCompanies: state.revealedCompanies.includes(companyId)
        ? state.revealedCompanies
        : [...state.revealedCompanies, companyId],
    })),

  isCompanyRevealed: (companyId) => get().revealedCompanies.includes(companyId),
}));
