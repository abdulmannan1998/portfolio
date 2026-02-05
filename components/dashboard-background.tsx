"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const hasEnteredGraph = useRef(false);
  const allNodesRef = useRef<Node[]>([]);
  const allEdgesRef = useRef<Edge[]>([]);
  const addedAchievementsRef = useRef<Set<string>>(new Set());
  const handleNodeHoverRef = useRef<
    (nodeId: string, isEntering: boolean) => void
  >(() => {});

  // Initialize nodes/edges state (refs populated in useEffect, not during render)
  const [nodes, setNodes, onNodesChange] = useNodesState(
    getInitialNodes(graphDimensions).filter((n) => n.data?.type === "root"),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Populate refs after initial render
  useEffect(() => {
    allNodesRef.current = getInitialNodes(graphDimensions);
    allEdgesRef.current = getInitialEdges();
  }, [graphDimensions]);
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
        // Check if already added using ref (avoids stale closure issues)
        if (addedAchievementsRef.current.has(nodeId)) return;
        addedAchievementsRef.current.add(nodeId);

        // Add nodes first with reset animation delay (so they appear quickly on hover)
        const nodesWithHandler = achievementNodes.map((n, index) => ({
          ...n,
          data: {
            ...n.data,
            onHoverChange: (id: string, entering: boolean) =>
              handleNodeHoverRef.current(id, entering),
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
    [setNodes, setEdges, fitViewSmooth],
  );

  // Keep ref in sync with latest callback
  useEffect(() => {
    handleNodeHoverRef.current = handleNodeHover;
  }, [handleNodeHover]);

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
    if (hasEnteredGraph.current) return;
    hasEnteredGraph.current = true;

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
    }, 1200);

    // Stage 3: Work Experience - Layermark (1700ms)
    setTimeout(() => {
      addNodeAndEdges("Layermark");
      fitViewSmooth();
    }, 1700);

    // Stage 4: Work Experience - Intenseye (2200ms)
    setTimeout(() => {
      addNodeAndEdges("Intenseye");
      fitViewSmooth();
    }, 2200);
  }, [addNodeAndEdges, fitViewSmooth]);

  // Handle pointer enter
  const handleGraphEnter = useCallback(() => {
    if (!hasEnteredGraph.current) {
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

    // Update refs with new dimension calculations
    allNodesRef.current = getInitialNodes(graphDimensions);
    allEdgesRef.current = getInitialEdges();

    // Re-calculate positions for currently revealed nodes (with hover handler)
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
        zIndex: expandedNodes.has(node.id) ? 1000 : undefined,
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
