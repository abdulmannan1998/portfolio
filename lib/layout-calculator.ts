import { type Node } from "@xyflow/react";
import { SAFE_AREA, ACHIEVEMENT_LAYOUT } from "./layout-constants";

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
};

/**
 * Calculate the safe area for node placement
 * Subtracts header, metrics, and side margins from viewport
 */
export function calculateSafeArea(
  viewport: ViewportSize,
  headerHeight = SAFE_AREA.HEADER_HEIGHT,
  metricsHeight = SAFE_AREA.METRICS_HEIGHT,
  leftMargin = SAFE_AREA.LEFT_MARGIN,
  rightMargin = SAFE_AREA.RIGHT_MARGIN,
): SafeArea {
  const minX = leftMargin;
  const maxX = viewport.width - rightMargin;
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

  // Vertical spacing: 30% of available height
  const vertical = safeArea.height * 0.3;

  return {
    horizontal,
    vertical,
  };
}

/**
 * Calculate timeline positions for all nodes
 * Optimized for horizontal spread and visual storytelling
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

  // Level 1: Position root node at the top center - HERO ELEMENT
  const rootNode = graphNodes.find((n) => n.type === "root");
  const rootY = safeArea.minY + 100; // More breathing room at top
  if (rootNode) {
    nodes.push({
      id: rootNode.id,
      type: "custom",
      position: { x: safeArea.centerX, y: rootY },
      data: {
        label: rootNode.label,
        type: rootNode.type,
        animationDelay: 0, // Hero appears first
        animationType: "hero-entrance",
      },
    });
  }

  // Position soft skills flanking the root node - balanced triangular layout
  const softSkillNodes = graphNodes.filter((n) => n.type === "soft-skill");

  // Calculate positions: one above, two flanking left/right
  const softSkillPositions = [
    { x: safeArea.centerX - 220, y: rootY - 30 }, // Left of root, slightly above
    { x: safeArea.centerX, y: rootY - 110 }, // Centered above root
    { x: safeArea.centerX + 220, y: rootY - 30 }, // Right of root, slightly above
  ];

  softSkillNodes.forEach((skill, index) => {
    const pos = softSkillPositions[index] || softSkillPositions[0];

    nodes.push({
      id: skill.id,
      type: "custom",
      position: { x: pos.x, y: pos.y },
      data: {
        label: skill.label,
        type: skill.type,
        animationDelay: 0.3 + index * 0.1, // Sequential bloom
        animationType: "bloom-in",
      },
    });
  });

  // Level 2: Timeline - WIDER HORIZONTAL SPREAD for better breathing room
  const companyY = rootY + 350; // More space from root
  const companySpacing = Math.min(spacing.horizontal * 3.5, 800); // Much wider spacing

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
          animationDelay: 1.0 + config.order * 0.2, // Left to right timeline reveal
          animationType: "slide-up",
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

  // Level 3: STAGGERED achievement layout - reduces vertical sprawl
  const achievementSpacing = ACHIEVEMENT_LAYOUT.VERTICAL_SPACING; // Tighter vertical spacing
  const achievementOffsetY = ACHIEVEMENT_LAYOUT.INITIAL_OFFSET_Y; // Good initial offset
  const staggerX = ACHIEVEMENT_LAYOUT.HORIZONTAL_STAGGER; // Horizontal stagger to create visual interest

  const achievementPositions: Record<string, { x: number; y: number }> = {};

  Object.entries(achievementsByCompany).forEach(([companyId, achievements]) => {
    const companyPos = timelinePositions[companyId];
    const companyConfig = Object.values(timelineConfig).find((c) =>
      Object.keys(timelineConfig).find(
        (key) => timelineConfig[key] === c && key === companyId,
      ),
    );
    const companyOrder = companyConfig?.order ?? 0;

    if (companyPos) {
      achievements.forEach((achievement, index) => {
        // Stagger achievements in a zigzag pattern to reduce height
        const isEven = index % 2 === 0;
        const xOffset = isEven ? -staggerX / 2 : staggerX / 2;
        const x = companyPos.x - 125 + xOffset;
        const y =
          companyPos.y + achievementOffsetY + index * achievementSpacing;

        nodes.push({
          id: achievement.id,
          type: "achievement",
          position: { x, y },
          data: {
            ...achievement,
            label: achievement.title || achievement.label,
            animationDelay: 1.8 + companyOrder * 0.3 + index * 0.15, // Cascade from parent
            animationType: "fade-drop",
          },
        });

        achievementPositions[achievement.id] = { x: x + 125, y }; // Store center point
      });
    }
  });

  return nodes;
}
