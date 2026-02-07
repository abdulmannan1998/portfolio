"use client";

import { create } from "zustand";

type RevealPhase = "idle" | "revealing" | "revealed" | "aborted";

type GraphState = {
  // Expanded nodes (array for JSON serializability)
  expandedNodes: string[];
  expandNode: (id: string) => void;
  collapseNode: (id: string) => void;
  collapseAll: () => void;

  // Reveal state machine
  revealPhase: RevealPhase;
  revealStep: number;
  revealTimerIds: NodeJS.Timeout[];
  beginReveal: () => void;
  advanceReveal: () => void;
  abortReveal: () => void;
  registerRevealTimer: (id: NodeJS.Timeout) => void;
  clearRevealTimers: () => void;

  // Reveal tracking state (for achievement nodes)
  revealedCompanies: string[];
  markCompanyRevealed: (companyId: string) => void;
  isCompanyRevealed: (companyId: string) => boolean;
};

export const useGraphStore = create<GraphState>((set, get) => ({
  // Initial state
  expandedNodes: [],
  revealPhase: "idle",
  revealStep: -1,
  revealTimerIds: [],
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

  beginReveal: () => {
    const { revealPhase } = get();
    if (revealPhase !== "idle") return;
    set({ revealPhase: "revealing", revealStep: 0 });
  },

  advanceReveal: () => {
    const { revealStep } = get();
    const REVEAL_SEQUENCE_LENGTH = 3; // Intenseye, Layermark, Bilkent
    const nextStep = revealStep + 1;
    if (nextStep >= REVEAL_SEQUENCE_LENGTH) {
      set({ revealPhase: "revealed", revealStep: nextStep });
    } else {
      set({ revealStep: nextStep });
    }
  },

  abortReveal: () => {
    const { revealTimerIds } = get();
    revealTimerIds.forEach(clearTimeout);
    set({ revealPhase: "aborted", revealTimerIds: [] });
  },

  registerRevealTimer: (id) =>
    set((state) => ({
      revealTimerIds: [...state.revealTimerIds, id],
    })),

  clearRevealTimers: () => {
    const { revealTimerIds } = get();
    revealTimerIds.forEach(clearTimeout);
    set({ revealTimerIds: [] });
  },

  markCompanyRevealed: (companyId) =>
    set((state) => ({
      revealedCompanies: state.revealedCompanies.includes(companyId)
        ? state.revealedCompanies
        : [...state.revealedCompanies, companyId],
    })),

  isCompanyRevealed: (companyId) => get().revealedCompanies.includes(companyId),
}));
