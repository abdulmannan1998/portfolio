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
import { motion } from "framer-motion";
import { getInitialNodes, getInitialEdges } from "@/lib/graph-utils";
import { CustomNode } from "@/components/custom-node";
import { AchievementNode } from "@/components/nodes/achievement-node";
import { useGraphStore } from "@/lib/stores/graph-store";
import { REVEAL_SEQUENCE, SOFT_SKILL_NODE_IDS } from "@/lib/layout-constants";
import { useHydrated } from "@/lib/use-hydrated";

const nodeTypes = {
  custom: CustomNode,
  achievement: AchievementNode,
};

function GraphSectionInner() {
  const isHydrated = useHydrated();
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [graphDimensions, setGraphDimensions] = useState({
    width: 800,
    height: 600,
  });

  const reactFlowInstance = useReactFlow();
  const allNodesRef = useRef<Node[]>([]);
  const allEdgesRef = useRef<Edge[]>([]);

  const { width: graphWidth, height: graphHeight } = graphDimensions;

  const allNodes = useMemo(() => {
    return getInitialNodes({ width: graphWidth, height: graphHeight });
  }, [graphWidth, graphHeight]);

  const allEdges = useMemo(() => {
    return getInitialEdges();
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    allNodes.filter((n) => n.data?.type === "root"),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    allNodesRef.current = allNodes;
    allEdgesRef.current = allEdges;
  }, [allNodes, allEdges]);

  const expandedNodes = useGraphStore((state) => state.expandedNodes);
  const revealPhase = useGraphStore((state) => state.revealPhase);

  const achievementNodeHoverHandler = useCallback(
    (nodeId: string, isEntering: boolean) => {
      if (!isEntering) return;
      const { isCompanyRevealed } = useGraphStore.getState();
      if (!isCompanyRevealed(nodeId)) {
        return;
      }
    },
    [],
  );

  const handleNodeHover = useCallback(
    (nodeId: string, isEntering: boolean) => {
      if (!isEntering) return;

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
        const { isCompanyRevealed, markCompanyRevealed, registerRevealTimer } =
          useGraphStore.getState();
        if (isCompanyRevealed(nodeId)) return;
        markCompanyRevealed(nodeId);

        const nodesWithHandler = achievementNodes.map((n, index) => ({
          ...n,
          data: {
            ...n.data,
            onHoverChange: achievementNodeHoverHandler,
            animationDelay: index * 0.1,
          },
        }));
        setNodes((prev) => [...prev, ...nodesWithHandler]);

        const totalAnimationTime = achievementNodes.length * 100 + 600;

        const timerId = setTimeout(() => {
          setEdges((prev) => {
            const existingEdge = prev.find((e) =>
              achievementIds.includes(e.target),
            );
            if (existingEdge) return prev;
            return [...prev, ...achievementEdgesFiltered];
          });
        }, totalAnimationTime);
        registerRevealTimer(timerId);
      }
    },
    [setNodes, setEdges, achievementNodeHoverHandler],
  );

  const addNodeAndEdges = useCallback(
    (nodeId: string) => {
      const node = allNodesRef.current.find((n) => n.id === nodeId);
      const relatedEdges = allEdgesRef.current.filter(
        (e) => e.source === nodeId || e.target === nodeId,
      );

      if (node) {
        const nodeWithHandler = {
          ...node,
          data: { ...node.data, onHoverChange: handleNodeHover },
        };
        setNodes((prev) => [...prev, nodeWithHandler]);

        if (relatedEdges.length > 0) {
          const { registerRevealTimer } = useGraphStore.getState();
          const timerId = setTimeout(() => {
            setEdges((prev) => {
              const newEdges = relatedEdges.filter(
                (edge) => !prev.some((e) => e.id === edge.id),
              );
              return [...prev, ...newEdges];
            });
          }, 500);
          registerRevealTimer(timerId);
        }
      }
    },
    [setNodes, setEdges, handleNodeHover],
  );

  const handleClickReveal = useCallback(() => {
    const { revealPhase, beginReveal, advanceReveal, registerRevealTimer } =
      useGraphStore.getState();
    if (revealPhase !== "idle") return;

    beginReveal();

    // First reveal soft-skill nodes immediately (staggered)
    SOFT_SKILL_NODE_IDS.forEach((id, index) => {
      const timerId = setTimeout(() => {
        addNodeAndEdges(id);
      }, index * 200);
      registerRevealTimer(timerId);
    });

    // After soft skills are done, begin the main REVEAL_SEQUENCE
    const softSkillsDoneDelay = SOFT_SKILL_NODE_IDS.length * 200;
    let cumulativeDelay = softSkillsDoneDelay;

    REVEAL_SEQUENCE.forEach((step, index) => {
      const timerId = setTimeout(() => {
        addNodeAndEdges(step.nodeId);
        advanceReveal();
      }, cumulativeDelay);
      registerRevealTimer(timerId);
      cumulativeDelay += step.delayMs;
    });

    // Final timer to transition to 'revealed' state after last step completes
    const finalTimerId = setTimeout(() => {
      advanceReveal();
    }, cumulativeDelay);
    registerRevealTimer(finalTimerId);
  }, [addNodeAndEdges]);

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

  useEffect(() => {
    if (graphDimensions.width === 0 || graphDimensions.height === 0) return;

    setNodes((prevNodes) => {
      const currentIds = new Set(prevNodes.map((n) => n.id));
      return allNodesRef.current
        .filter((n) => currentIds.has(n.id))
        .map((n) => ({
          ...n,
          data: { ...n.data, onHoverChange: handleNodeHover },
        }));
    });
  }, [graphDimensions, setNodes, handleNodeHover]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        zIndex: expandedNodes.includes(node.id) ? 1000 : undefined,
      })),
    );
  }, [expandedNodes, setNodes]);

  // Initialize root node with onClick handler on mount
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.data?.type === "root") {
          return {
            ...node,
            data: {
              ...node.data,
              onClickReveal: handleClickReveal,
              isRevealing: false,
            },
          };
        }
        return node;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update root node isRevealing status when revealPhase changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.data?.type === "root") {
          return {
            ...node,
            data: {
              ...node.data,
              isRevealing: revealPhase !== "idle",
            },
          };
        }
        return node;
      }),
    );
  }, [revealPhase, setNodes]);

  useEffect(() => {
    return () => {
      const { abortReveal } = useGraphStore.getState();
      abortReveal();
    };
  }, []);

  return (
    <div id="graph" className="relative lg:pt-[9.5rem]">
      <p className="text-stone-400 mb-4">Interact with nodes to explore</p>

      <motion.div
        initial={isHydrated ? { opacity: 0, scale: 0.98 } : false}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        key={isHydrated ? "animated" : "static"}
        ref={graphContainerRef}
        className="relative h-[500px] md:h-[700px] rounded-xl border border-stone-800 bg-stone-950/50 overflow-hidden"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          minZoom={0.5}
          maxZoom={1.5}
          elevateNodesOnSelect
          className="bg-stone-950"
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#44403c" gap={24} size={1} />
        </ReactFlow>
      </motion.div>
    </div>
  );
}

export function GraphSection() {
  return (
    <ReactFlowProvider>
      <GraphSectionInner />
    </ReactFlowProvider>
  );
}
