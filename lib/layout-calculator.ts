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
 * Position tech nodes in a grid layout below their parent achievement
 */
export function clusterTechNodes(
  parentNode: { x: number; y: number },
  techNodes: GraphNode[],
  spacing: Spacing,
): Array<{ id: string; x: number; y: number }> {
  const positions: Array<{ id: string; x: number; y: number }> = [];
  const columnsPerRow = 3;
  const techOffsetY = 220; // Fixed offset to account for expanded node height

  techNodes.forEach((node, index) => {
    const column = index % columnsPerRow;
    const row = Math.floor(index / columnsPerRow);

    // Center the grid relative to parent
    const gridWidth = (columnsPerRow - 1) * spacing.techSpacing;
    const startX = parentNode.x - gridWidth / 2;

    const x = startX + column * spacing.techSpacing;
    const y = parentNode.y + techOffsetY + row * spacing.techRowHeight;

    positions.push({ id: node.id, x, y });
  });

  return positions;
}

/**
 * Calculate timeline positions for all nodes
 */
export type GraphNode = {
  id: string;
  label?: string;
  title?: string; // Achievement nodes use title instead of label
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow additional properties for flexible node data
};

export type GraphEdge = {
  source: string;
  target: string;
  type?: string;
};

export function getTimelinePositions(
  graphNodes: GraphNode[],
  graphEdges: GraphEdge[],
  safeArea: SafeArea,
): Node[] {
  const nodes: Node[] = [];
  const spacing = getResponsiveSpacing(safeArea);

  // Level 1: Position root node at the top center
  const rootNode = graphNodes.find((n) => n.type === "root");
  const rootY = safeArea.minY + 80; // Start from top with some padding
  if (rootNode) {
    nodes.push({
      id: rootNode.id,
      type: "custom",
      position: { x: safeArea.centerX, y: rootY },
      data: { label: rootNode.label, type: rootNode.type },
    });
  }

  // Position soft skills around the root node in a circular pattern
  const softSkillNodes = graphNodes.filter((n) => n.type === "soft-skill");
  const softSkillRadius = 220; // Increased from 180 for better spacing
  const angleStep = (Math.PI * 2) / softSkillNodes.length;
  const startAngle = -Math.PI / 2; // Start from top

  softSkillNodes.forEach((skill, index) => {
    const angle = startAngle + angleStep * index;
    const x = safeArea.centerX + Math.cos(angle) * softSkillRadius;
    const y = rootY + Math.sin(angle) * softSkillRadius;

    nodes.push({
      id: skill.id,
      type: "custom",
      position: { x, y },
      data: { label: skill.label, type: skill.type },
    });
  });

  // Level 2: Timeline positions for companies and education
  // Chronological order left to right: Bilkent → Layermark → Intenseye
  const companyY = rootY + 280; // Position companies below the name (increased from 220)
  const companySpacing = Math.min(spacing.horizontal * 2.5, 650); // Increased from 1.8x and 500

  const timelineConfig: Record<
    string,
    { x: number; y: number; order: number }
  > = {
    Bilkent: {
      x: safeArea.centerX - companySpacing,
      y: companyY,
      order: 0,
    },
    Layermark: {
      x: safeArea.centerX,
      y: companyY,
      order: 1,
    },
    Intenseye: {
      x: safeArea.centerX + companySpacing,
      y: companyY,
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
        data: {
          ...node,
          label: node.label,
          type: node.type,
          period: node.period,
        },
      });
      timelinePositions[node.id] = { x: config.x, y: config.y };
    }
  });

  // Group achievement nodes by their parent company (source)
  const achievementsByCompany: Record<string, GraphNode[]> = {};

  graphNodes
    .filter((n) => n.type === "achievement")
    .forEach((achievementNode) => {
      const edge = graphEdges.find((e) => e.target === achievementNode.id);
      if (edge) {
        const companyId = edge.source;
        if (!achievementsByCompany[companyId]) {
          achievementsByCompany[companyId] = [];
        }
        achievementsByCompany[companyId].push(achievementNode);
      }
    });

  // Level 3: Position achievement nodes below their parent companies
  const achievementSpacing = 240; // Vertical spacing between achievements (increased for better readability)
  const achievementOffsetY = 220; // Initial offset from company (increased from 200)

  const achievementPositions: Record<string, { x: number; y: number }> = {};

  Object.entries(achievementsByCompany).forEach(([companyId, achievements]) => {
    const companyPos = timelinePositions[companyId];
    if (companyPos) {
      achievements.forEach((achievement, index) => {
        // Center the collapsed achievement node (250px wide)
        const x = companyPos.x - 125;
        const y =
          companyPos.y + achievementOffsetY + index * achievementSpacing;

        nodes.push({
          id: achievement.id,
          type: "achievement",
          position: { x, y },
          data: {
            ...achievement,
            label: achievement.title || achievement.label,
          },
        });

        achievementPositions[achievement.id] = { x, y };
      });
    }
  });

  // Group tech nodes by their parent achievement (source)
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

  // Level 4: Position tech nodes in clusters below their parent achievements
  Object.entries(techNodesByParent).forEach(([parentId, techNodes]) => {
    const parentPos = achievementPositions[parentId];
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
