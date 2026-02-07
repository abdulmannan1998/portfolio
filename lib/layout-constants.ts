/**
 * Centralized layout and timing constants
 * Single source of truth for dimensions, positioning, and animation timing
 */

/**
 * SAFE_AREA - Viewport space reserved for UI elements
 * These define the boundaries within which the graph content should be positioned
 */
export const SAFE_AREA = {
  /** Top header space in pixels */
  HEADER_HEIGHT: 140,
  /** Bottom metrics panel height in pixels */
  METRICS_HEIGHT: 220,
  /** Left sidebar/margin in pixels */
  LEFT_MARGIN: 240,
  /** Right margin in pixels */
  RIGHT_MARGIN: 100,
} as const;

/**
 * ACHIEVEMENT_LAYOUT - Achievement node positioning constants
 * Controls the vertical spacing and stagger of achievement nodes below company nodes
 */
export const ACHIEVEMENT_LAYOUT = {
  /** Vertical space between achievement nodes in pixels */
  VERTICAL_SPACING: 200,
  /** Initial vertical offset below parent company node in pixels */
  INITIAL_OFFSET_Y: 250,
  /** Horizontal stagger for zigzag visual interest in pixels */
  HORIZONTAL_STAGGER: 150,
} as const;

/**
 * REVEAL_TIMING - Animation timing sequence
 * Controls the staggered reveal of timeline nodes in milliseconds
 * @deprecated Use REVEAL_SEQUENCE instead for state-machine-based reveals
 */
export const REVEAL_TIMING = {
  /** Delay before education node (Bilkent) appears in milliseconds */
  EDUCATION_DELAY_MS: 1200,
  /** Delay before first work experience node (Layermark) appears in milliseconds */
  LAYERMARK_DELAY_MS: 1700,
  /** Delay before second work experience node (Intenseye) appears in milliseconds */
  INTENSEYE_DELAY_MS: 2200,
} as const;

/**
 * REVEAL_SEQUENCE - Career node reveal order (reverse-chronological)
 * State machine sequencing for controlled reveal with camera choreography
 */
export const REVEAL_SEQUENCE = [
  { nodeId: "Intenseye", delayMs: 600 },
  { nodeId: "Layermark", delayMs: 600 },
  { nodeId: "Bilkent", delayMs: 600 },
] as const;

/**
 * SOFT_SKILL_NODE_IDS - Soft skill node identifiers
 * These nodes appear immediately on reveal, not part of the main sequence
 */
export const SOFT_SKILL_NODE_IDS = [
  "Problem-Solving",
  "Collaboration",
  "Quick-Learner",
] as const;
