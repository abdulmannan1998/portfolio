import { type Node } from "@xyflow/react";

export type SafeArea = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
};

export type ViewportSize = {
  width: number;
  height: number;
};

export type Spacing = {
  horizontal: number;
  vertical: number;
  techSpacing: number;
  techRowHeight: number;
};

/**
 * Calculate the safe area for node placement
 * Subtracts header, metrics, and side margins from viewport
 */
export function calculateSafeArea(
  viewport: ViewportSize,
  headerHeight = 140,
  metricsHeight = 220,
  sideMargin = 100,
): SafeArea {
  const minX = sideMargin;
  const maxX = viewport.width - sideMargin;
  const minY = headerHeight;
  const maxY = viewport.height - metricsHeight;

  const width = maxX - minX;
  const height = maxY - minY;
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;

  return {
    minX,
    maxX,
    minY,
    maxY,
    centerX,
    centerY,
    width,
    height,
  };
}

/**
 * Calculate responsive spacing based on safe area dimensions
 */
export function getResponsiveSpacing(safeArea: SafeArea): Spacing {
  // Horizontal spacing: 22% of available width, capped at 400px
  const horizontal = Math.min(safeArea.width * 0.22, 400);

  // Vertical spacing: 30% of available height for tech clusters
  const vertical = safeArea.height * 0.3;

  // Tech node spacing: 40% of horizontal spacing
  const techSpacing = horizontal * 0.4;

  // Tech row height: spacing between rows of tech nodes
  const techRowHeight = 80;

  return {
    horizontal,
    vertical,
    techSpacing,
    techRowHeight,
  };
}

/**
 * Position tech nodes in a grid layout below their parent company
 */
export function clusterTechNodes(
  parentNode: { x: number; y: number },
  techNodes: Array<{ id: string; label: string; type: string }>,
  spacing: Spacing,
): Array<{ id: string; x: number; y: number }> {
  const positions: Array<{ id: string; x: number; y: number }> = [];
  const columnsPerRow = 3;

  techNodes.forEach((node, index) => {
    const column = index % columnsPerRow;
    const row = Math.floor(index / columnsPerRow);

    // Center the grid relative to parent
    const gridWidth = (columnsPerRow - 1) * spacing.techSpacing;
    const startX = parentNode.x - gridWidth / 2;

    const x = startX + column * spacing.techSpacing;
    const y = parentNode.y + spacing.vertical + row * spacing.techRowHeight;

    positions.push({ id: node.id, x, y });
  });

  return positions;
}

/**
 * Calculate timeline positions for all nodes
 */
export type GraphNode = {
  id: string;
  label: string;
  type: string;
};

export type GraphEdge = {
  source: string;
  target: string;
};

export function getTimelinePositions(
  graphNodes: GraphNode[],
  graphEdges: GraphEdge[],
  safeArea: SafeArea,
): Node[] {
  const nodes: Node[] = [];
  const spacing = getResponsiveSpacing(safeArea);

  // Position root node at center
  const rootNode = graphNodes.find((n) => n.type === "root");
  if (rootNode) {
    nodes.push({
      id: rootNode.id,
      type: "custom",
      position: { x: safeArea.centerX, y: safeArea.centerY },
      data: { label: rootNode.label, type: rootNode.type },
    });
  }

  // Timeline positions for companies and education
  // Timeline order: Bilkent (left) → Layermark (middle-left) → Intenseye (middle-right)
  const timelineConfig: Record<
    string,
    { x: number; y: number; order: number }
  > = {
    Bilkent: {
      x: safeArea.centerX - spacing.horizontal * 2,
      y: safeArea.centerY,
      order: 0,
    },
    Layermark: {
      x: safeArea.centerX - spacing.horizontal * 0.7,
      y: safeArea.centerY,
      order: 1,
    },
    Intenseye: {
      x: safeArea.centerX + spacing.horizontal * 0.7,
      y: safeArea.centerY,
      order: 2,
    },
  };

  // Position timeline nodes (companies + education)
  const timelineNodes = graphNodes.filter(
    (n) => n.type === "company" || n.type === "education",
  );

  const timelinePositions: Record<string, { x: number; y: number }> = {};

  timelineNodes.forEach((node) => {
    const config = timelineConfig[node.id];
    if (config) {
      nodes.push({
        id: node.id,
        type: "custom",
        position: { x: config.x, y: config.y },
        data: { label: node.label, type: node.type },
      });
      timelinePositions[node.id] = { x: config.x, y: config.y };
    }
  });

  // Group tech nodes by their parent (source)
  const techNodesByParent: Record<string, GraphNode[]> = {};

  graphNodes
    .filter((n) => n.type === "tech")
    .forEach((techNode) => {
      const edge = graphEdges.find((e) => e.target === techNode.id);
      if (edge) {
        const parentId = edge.source;
        if (!techNodesByParent[parentId]) {
          techNodesByParent[parentId] = [];
        }
        techNodesByParent[parentId].push(techNode);
      }
    });

  // Position tech nodes in clusters below their parents
  Object.entries(techNodesByParent).forEach(([parentId, techNodes]) => {
    const parentPos = timelinePositions[parentId];
    if (parentPos) {
      const clusteredPositions = clusterTechNodes(
        parentPos,
        techNodes,
        spacing,
      );

      clusteredPositions.forEach((pos) => {
        const node = techNodes.find((n) => n.id === pos.id);
        if (node) {
          nodes.push({
            id: node.id,
            type: "custom",
            position: { x: pos.x, y: pos.y },
            data: { label: node.label, type: node.type },
          });
        }
      });
    }
  });

  return nodes;
}
