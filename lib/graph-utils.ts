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
  // Calculate safe area (avoiding header, metrics, and legend)
  const safeArea = calculateSafeArea(
    viewport,
    140, // headerHeight
    220, // metricsHeight
    240, // leftMargin (extra space for legend)
    100, // rightMargin
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
    default:
      return 1;
  }
}

export const getInitialEdges = (): Edge[] => {
  return RESUME_DATA.graph.edges.map((edge, index) => {
    // Different opacity levels for visual hierarchy
    const opacity = edge.type === "soft-skill" ? 0.3 : 0.6;

    // Set source/target handles for proper connections
    let sourceHandle: string | undefined;
    let targetHandle: string | undefined;

    if (edge.type === "soft-skill") {
      // Soft skills connect from TOP of root to BOTTOM of soft skill nodes
      sourceHandle = "top";
      targetHandle = "bottom";
    }

    if (edge.type === "career" || edge.type === "education") {
      // Career and education connect from BOTTOM of root
      // No need to specify targetHandle - company/education nodes only have one target handle
      sourceHandle = "bottom";
    }

    if (edge.type === "project") {
      // Project edges connect from BOTTOM of company/education to TOP of achievement
      // This ensures proper edge path calculation
      sourceHandle = undefined; // Let ReactFlow auto-detect (company has only one source handle at bottom)
      targetHandle = undefined; // Let ReactFlow auto-detect (achievement has only one target handle at top)
    }

    return {
      id: `edge-${index}`,
      source: edge.source,
      target: edge.target,
      sourceHandle,
      targetHandle,
      type: "smoothstep",
      data: { edgeType: edge.type }, // Preserve original edge type for filtering
      style: {
        stroke: getEdgeColor(edge.type),
        strokeWidth: getEdgeWidth(edge.type),
        opacity,
      },
      // Reduce edge path offset to minimize gap between node and edge
      pathOptions: { offset: 0 },
    };
  });
};
