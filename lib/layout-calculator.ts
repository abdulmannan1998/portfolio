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
 * Position tech nodes in an organic cluster below their parent achievement
 * Uses a flowing, natural arrangement instead of rigid grid
 */
export function clusterTechNodes(
  parentNode: { x: number; y: number },
  techNodes: GraphNode[],
  spacing: Spacing,
): Array<{ id: string; x: number; y: number }> {
  const positions: Array<{ id: string; x: number; y: number }> = [];
  const techOffsetY = 200; // Closer to parent for tighter grouping

  // Use variable columns for more organic feel: [3, 4, 3, 4...] pattern
  const columnPattern = [3, 4, 3, 4];
  let nodeIndex = 0;
  let currentY = parentNode.y + techOffsetY;

  while (nodeIndex < techNodes.length) {
    const rowPattern =
      columnPattern[positions.length % columnPattern.length] || 3;
    const nodesInRow = Math.min(rowPattern, techNodes.length - nodeIndex);

    // Calculate row width and centering
    const rowWidth = (nodesInRow - 1) * spacing.techSpacing;
    const startX = parentNode.x - rowWidth / 2;

    // Add subtle horizontal variation for organic feel
    const rowVariation = Math.sin(nodeIndex * 0.5) * 20;

    for (let col = 0; col < nodesInRow; col++) {
      const node = techNodes[nodeIndex];
      if (!node) break;

      // Add slight random offset for natural clustering
      const jitterX = Math.sin(nodeIndex * 2.1) * 15;
      const jitterY = Math.cos(nodeIndex * 1.7) * 10;

      const x = startX + col * spacing.techSpacing + jitterX + rowVariation;
      const y = currentY + jitterY;

      positions.push({ id: node.id, x, y });
      nodeIndex++;
    }

    currentY += spacing.techRowHeight;
  }

  return positions;
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

  // Position soft skills in a more subtle arc above the root - LESS PROMINENT
  const softSkillNodes = graphNodes.filter((n) => n.type === "soft-skill");
  const softSkillRadius = 180; // Tighter radius, more compact
  const arcSpan = Math.PI; // 180 degree arc instead of full circle
  const arcStart = -Math.PI / 2 - arcSpan / 2; // Center the arc above
  const angleStep = arcSpan / (softSkillNodes.length - 1 || 1);

  softSkillNodes.forEach((skill, index) => {
    const angle = arcStart + angleStep * index;
    const x = safeArea.centerX + Math.cos(angle) * softSkillRadius;
    const y = rootY + Math.sin(angle) * softSkillRadius * 0.5; // Flatten the arc

    nodes.push({
      id: skill.id,
      type: "custom",
      position: { x, y },
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
  const achievementSpacing = 200; // Tighter vertical spacing
  const achievementOffsetY = 250; // Good initial offset
  const staggerX = 150; // Horizontal stagger to create visual interest

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

  // Level 4: ORGANIC tech node clustering - more natural feeling
  Object.entries(techNodesByParent).forEach(([parentId, techNodes]) => {
    const parentPos = achievementPositions[parentId];
    if (parentPos) {
      const clusteredPositions = clusterTechNodes(
        parentPos,
        techNodes,
        spacing,
      );

      clusteredPositions.forEach((pos, index) => {
        const node = techNodes.find((n) => n.id === pos.id);
        if (node) {
          // Get parent achievement's animation delay
          const parentAchievementNode = nodes.find((n) => n.id === parentId);
          const parentDelay =
            (parentAchievementNode?.data?.animationDelay as
              | number
              | undefined) ?? 2.5;

          nodes.push({
            id: node.id,
            type: "custom",
            position: { x: pos.x, y: pos.y },
            data: {
              label: node.label,
              type: node.type,
              animationDelay: parentDelay + 0.4 + index * 0.05, // Quick sequence after parent
              animationType: "pop-in",
            },
          });
        }
      });
    }
  });

  return nodes;
}
