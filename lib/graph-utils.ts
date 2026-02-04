import { type Node, type Edge } from "@xyflow/react";
import { RESUME_DATA } from "@/data/resume-data";
import {
  calculateSafeArea,
  getTimelinePositions,
  type ViewportSize,
} from "@/lib/layout-calculator";

export const getInitialNodes = (
  viewport: ViewportSize = { width: 1920, height: 1080 },
): Node[] => {
  // Calculate safe area (avoiding header and metrics)
  const safeArea = calculateSafeArea(
    viewport,
    140, // headerHeight
    220, // metricsHeight
    100, // sideMargin
  );

  // Combine graph nodes with achievement nodes
  const allNodes = [
    ...RESUME_DATA.graph.nodes,
    ...RESUME_DATA.achievements.map((achievement) => ({
      ...achievement,
      type: "achievement" as const,
    })),
  ];

  // Use timeline positioning algorithm
  const nodes = getTimelinePositions(
    allNodes,
    RESUME_DATA.graph.edges,
    safeArea,
  );

  return nodes;
};

function getEdgeColor(edgeType?: string): string {
  switch (edgeType) {
    case "career":
      return "#3b82f6"; // blue for career progression
    case "education":
      return "#8b5cf6"; // violet for education
    case "project":
      return "#f97316"; // orange for company-achievement
    case "uses-tech":
      return "#a855f7"; // purple for achievement-tech
    case "soft-skill":
      return "#10b981"; // emerald for soft skills
    default:
      return "#44403c"; // stone for default
  }
}

function getEdgeWidth(edgeType?: string): number {
  switch (edgeType) {
    case "career":
      return 2;
    case "project":
      return 1.5;
    case "uses-tech":
      return 1;
    default:
      return 1;
  }
}

export const getInitialEdges = (): Edge[] => {
  return RESUME_DATA.graph.edges.map((edge, index) => {
    // Different opacity levels for visual hierarchy
    const opacity = edge.type === "soft-skill" ? 0.3 : 0.6;

    return {
      id: `edge-${index}`,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      animated: edge.type === "uses-tech", // Animate tech connections
      style: {
        stroke: getEdgeColor(edge.type),
        strokeWidth: getEdgeWidth(edge.type),
        opacity, // Visible with appropriate opacity
      },
    };
  });
};
