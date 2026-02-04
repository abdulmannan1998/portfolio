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

  // Use timeline positioning algorithm
  const nodes = getTimelinePositions(
    RESUME_DATA.graph.nodes,
    RESUME_DATA.graph.edges,
    safeArea,
  );

  return nodes;
};

export const getInitialEdges = (): Edge[] => {
  return RESUME_DATA.graph.edges.map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: "default",
    animated: true,
    style: { stroke: "#44403c" },
  }));
};
