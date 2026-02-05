"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  useReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getInitialNodes, getInitialEdges } from "@/lib/graph-utils";
import { CustomNode } from "@/components/custom-node";
import { AchievementNode } from "@/components/nodes/achievement-node";
import { useGraphStore } from "@/lib/stores/graph-store";
import { REVEAL_TIMING } from "@/lib/layout-constants";
import { debounce } from "@/lib/debounce";

const nodeTypes = {
  custom: CustomNode,
  achievement: AchievementNode,
};

interface DashboardBackgroundProps {
  header: React.ReactNode;
  legend: React.ReactNode;
  bottomContent: React.ReactNode;
}

function DashboardBackgroundInner({
  header,
  legend,
  bottomContent,
}: DashboardBackgroundProps) {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  // Track the graph container dimensions
  const [graphDimensions, setGraphDimensions] = useState({
    width: 800,
    height: 600,
  });

  const reactFlowInstance = useReactFlow();
  const allNodesRef = useRef<Node[]>([]);
  const allEdgesRef = useRef<Edge[]>([]);

  // Debounced fitView to batch multiple rapid calls
  const debouncedFitView = useRef(
    debounce(() => {
      reactFlowInstance?.fitView({
        padding: 0.15,
        duration: 800,
        maxZoom: 0.85,
        minZoom: 0.65,
      });
    }, 150),
  ).current;

  // Destructure dimensions for stable memoization dependencies
  const { width: graphWidth, height: graphHeight } = graphDimensions;

  // Memoize node and edge calculations to prevent redundant recalculation
  const allNodes = useMemo(() => {
    return getInitialNodes({ width: graphWidth, height: graphHeight });
  }, [graphWidth, graphHeight]);

  const allEdges = useMemo(() => {
    return getInitialEdges();
  }, []);

  // Initialize nodes/edges state (refs populated in useEffect, not during render)
  const [nodes, setNodes, onNodesChange] = useNodesState(
    allNodes.filter((n) => n.data?.type === "root"),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Sync refs with memoized values
  useEffect(() => {
    allNodesRef.current = allNodes;
    allEdgesRef.current = allEdges;
  }, [allNodes, allEdges]);
  const expandedNodes = useGraphStore((state) => state.expandedNodes);

  // Fit view smoothly
  const fitViewSmooth = useCallback(() => {
    setTimeout(() => {
      reactFlowInstance?.fitView({
        padding: 0.15,
        duration: 800,
        maxZoom: 0.85,
        minZoom: 0.65,
      });
    }, 50);
  }, [reactFlowInstance]);

  // Stable handler for achievement nodes - uses store for fresh state
  const achievementNodeHoverHandler = useCallback(
    (nodeId: string, isEntering: boolean) => {
      if (!isEntering) return;

      // Read fresh state from store imperatively
      const { isCompanyRevealed } = useGraphStore.getState();
      if (!isCompanyRevealed(nodeId)) {
        // This is an achievement node being hovered - we don't track these
        // Only company/education nodes trigger reveal sequences
        return;
      }
    },
    [],
  );

  // Handle company/education hover to show achievements
  const handleNodeHover = useCallback(
    (nodeId: string, isEntering: boolean) => {
      if (!isEntering) return; // Keep achievements visible once revealed

      // Find all achievement nodes connected to this company/education
      // Note: edge.type is "smoothstep" (ReactFlow type), original type is in edge.data.edgeType
      const achievementEdges = allEdgesRef.current.filter(
        (e) => e.source === nodeId && e.data?.edgeType === "project",
      );
      const achievementIds = achievementEdges.map((e) => e.target);

      const achievementNodes = allNodesRef.current.filter((n) =>
        achievementIds.includes(n.id),
      );
      const achievementEdgesFiltered = allEdgesRef.current.filter((e) =>
        achievementIds.includes(e.target),
      );

      if (achievementNodes.length > 0) {
        // Check if already revealed using store
        const { isCompanyRevealed, markCompanyRevealed } =
          useGraphStore.getState();
        if (isCompanyRevealed(nodeId)) return;
        markCompanyRevealed(nodeId);

        // Add nodes first with reset animation delay (so they appear quickly on hover)
        const nodesWithHandler = achievementNodes.map((n, index) => ({
          ...n,
          data: {
            ...n.data,
            onHoverChange: achievementNodeHoverHandler,
            animationDelay: index * 0.1, // Stagger by 100ms each, not 1.8+ seconds
          },
        }));
        setNodes((prev) => [...prev, ...nodesWithHandler]);

        // Calculate delay based on number of nodes (100ms per node + 500ms animation + buffer)
        const totalAnimationTime = achievementNodes.length * 100 + 600;

        // Delay edges until after nodes have animated in
        setTimeout(() => {
          setEdges((prev) => {
            // Double-check edges aren't already added
            const existingEdge = prev.find((e) =>
              achievementIds.includes(e.target),
            );
            if (existingEdge) return prev;
            return [...prev, ...achievementEdgesFiltered];
          });
          fitViewSmooth();
        }, totalAnimationTime);
      }
    },
    [setNodes, setEdges, fitViewSmooth, achievementNodeHoverHandler],
  );

  // Add node and its edges to the graph
  const addNodeAndEdges = useCallback(
    (nodeId: string) => {
      const node = allNodesRef.current.find((n) => n.id === nodeId);
      const relatedEdges = allEdgesRef.current.filter(
        (e) => e.source === nodeId || e.target === nodeId,
      );

      if (node) {
        // Add node first with hover handler
        const nodeWithHandler = {
          ...node,
          data: { ...node.data, onHoverChange: handleNodeHover },
        };
        setNodes((prev) => [...prev, nodeWithHandler]);

        // Delay edges until after node has animated in
        if (relatedEdges.length > 0) {
          setTimeout(() => {
            setEdges((prev) => {
              // Filter out edges that already exist
              const newEdges = relatedEdges.filter(
                (edge) => !prev.some((e) => e.id === edge.id),
              );
              return [...prev, ...newEdges];
            });
          }, 500);
        }
      }
    },
    [setNodes, setEdges, handleNodeHover],
  );

  // Staggered reveal sequence
  const startRevealSequence = useCallback(() => {
    const { hasStartedReveal, startReveal } = useGraphStore.getState();
    if (hasStartedReveal) return;
    startReveal();

    // Stage 1: Soft Skills (0ms, staggered by 200ms each)
    const softSkillNodes = [
      "Problem-Solving",
      "Collaboration",
      "Quick-Learner",
    ];
    softSkillNodes.forEach((id, index) => {
      setTimeout(() => {
        addNodeAndEdges(id);
        fitViewSmooth();
      }, index * 200);
    });

    // Stage 2: Education (1200ms)
    setTimeout(() => {
      addNodeAndEdges("Bilkent");
      fitViewSmooth();
    }, REVEAL_TIMING.EDUCATION_DELAY_MS);

    // Stage 3: Work Experience - Layermark (1700ms)
    setTimeout(() => {
      addNodeAndEdges("Layermark");
      fitViewSmooth();
    }, REVEAL_TIMING.LAYERMARK_DELAY_MS);

    // Stage 4: Work Experience - Intenseye (2200ms)
    setTimeout(() => {
      addNodeAndEdges("Intenseye");
      fitViewSmooth();
    }, REVEAL_TIMING.INTENSEYE_DELAY_MS);
  }, [addNodeAndEdges, fitViewSmooth]);

  // Handle pointer enter
  const handleGraphEnter = useCallback(() => {
    const { hasStartedReveal } = useGraphStore.getState();
    if (!hasStartedReveal) {
      startRevealSequence();
    }
  }, [startRevealSequence]);

  // Observe graph container size changes
  useEffect(() => {
    if (!graphContainerRef.current) return;

    let timeoutId: NodeJS.Timeout | null = null;
    const resizeObserver = new ResizeObserver((entries) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const entry = entries[0];
        if (entry) {
          const { width, height } = entry.contentRect;
          setGraphDimensions({ width, height });
        }
      }, 100);
    });

    resizeObserver.observe(graphContainerRef.current);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, []);

  // Update nodes when graph dimensions change
  useEffect(() => {
    if (graphDimensions.width === 0 || graphDimensions.height === 0) return;

    // Re-calculate positions for currently revealed nodes (with hover handler)
    // Note: allNodesRef is already synced via the memoized allNodes value
    setNodes((prevNodes) => {
      const currentIds = new Set(prevNodes.map((n) => n.id));
      return allNodesRef.current
        .filter((n) => currentIds.has(n.id))
        .map((n) => ({
          ...n,
          data: { ...n.data, onHoverChange: handleNodeHover },
        }));
    });

    // Fit view after dimension change
    fitViewSmooth();
  }, [graphDimensions, setNodes, handleNodeHover, fitViewSmooth]);

  // Update z-index for expanded nodes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        zIndex: expandedNodes.includes(node.id) ? 1000 : undefined,
      })),
    );
  }, [expandedNodes, setNodes]);

  return (
    <div className="h-screen w-screen bg-stone-950 overflow-hidden grid grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr]">
      {/* Header - spans full width */}
      <div className="col-span-2 p-6 md:p-12 pb-4">{header}</div>

      {/* Legend - left column */}
      <div className="row-start-2 p-6 md:pl-12 flex items-center">{legend}</div>

      {/* Graph Area - center/right */}
      <div
        ref={graphContainerRef}
        className="row-start-2 relative rounded-lg m-4 mr-6 md:mr-12 overflow-hidden"
        onMouseEnter={handleGraphEnter}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{
            padding: 0.15,
            minZoom: 0.65,
            maxZoom: 0.85,
            duration: 800,
          }}
          minZoom={0.5}
          maxZoom={1.5}
          elevateNodesOnSelect
          className="bg-stone-950"
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#44403c" gap={24} size={1} />
        </ReactFlow>
      </div>

      {/* Bottom Content - spans full width */}
      <div className="col-span-2 p-6 md:p-12 pt-4">{bottomContent}</div>
    </div>
  );
}

// Wrapper component with ReactFlowProvider
export function DashboardBackground({
  header,
  legend,
  bottomContent,
}: DashboardBackgroundProps) {
  return (
    <ReactFlowProvider>
      <DashboardBackgroundInner
        header={header}
        legend={legend}
        bottomContent={bottomContent}
      />
    </ReactFlowProvider>
  );
}
