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
import { REVEAL_TIMING } from "@/lib/layout-constants";
import { debounce } from "@/lib/debounce";

const nodeTypes = {
  custom: CustomNode,
  achievement: AchievementNode,
};

function GraphSectionInner() {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [graphDimensions, setGraphDimensions] = useState({
    width: 800,
    height: 600,
  });

  const reactFlowInstance = useReactFlow();
  const allNodesRef = useRef<Node[]>([]);
  const allEdgesRef = useRef<Edge[]>([]);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const debouncedFitView = useMemo(
    () =>
      debounce(() => {
        reactFlowInstance?.fitView({
          padding: 0.15,
          duration: 800,
          maxZoom: 0.85,
          minZoom: 0.65,
        });
      }, 150),
    [reactFlowInstance],
  );

  const addTimer = useCallback((callback: () => void, delay: number) => {
    const id = setTimeout(callback, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const { width: graphWidth, height: graphHeight } = graphDimensions;

  const allNodes = useMemo(() => {
    return getInitialNodes({ width: graphWidth, height: graphHeight });
  }, [graphWidth, graphHeight]);

  const allEdges = useMemo(() => {
    return getInitialEdges();
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    allNodes.filter((n) => n.data?.type === "root"),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    allNodesRef.current = allNodes;
    allEdgesRef.current = allEdges;
  }, [allNodes, allEdges]);

  const expandedNodes = useGraphStore((state) => state.expandedNodes);

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
        const { isCompanyRevealed, markCompanyRevealed } =
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

        addTimer(() => {
          setEdges((prev) => {
            const existingEdge = prev.find((e) =>
              achievementIds.includes(e.target),
            );
            if (existingEdge) return prev;
            return [...prev, ...achievementEdgesFiltered];
          });
          debouncedFitView();
        }, totalAnimationTime);
      }
    },
    [
      setNodes,
      setEdges,
      debouncedFitView,
      achievementNodeHoverHandler,
      addTimer,
    ],
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
          addTimer(() => {
            setEdges((prev) => {
              const newEdges = relatedEdges.filter(
                (edge) => !prev.some((e) => e.id === edge.id),
              );
              return [...prev, ...newEdges];
            });
          }, 500);
        }
      }
    },
    [setNodes, setEdges, handleNodeHover, addTimer],
  );

  const startRevealSequence = useCallback(() => {
    const { hasStartedReveal, startReveal } = useGraphStore.getState();
    if (hasStartedReveal) return;
    startReveal();

    const softSkillNodes = [
      "Problem-Solving",
      "Collaboration",
      "Quick-Learner",
    ];
    softSkillNodes.forEach((id, index) => {
      addTimer(() => {
        addNodeAndEdges(id);
      }, index * 200);
    });

    addTimer(() => {
      addNodeAndEdges("Bilkent");
    }, REVEAL_TIMING.EDUCATION_DELAY_MS);

    addTimer(() => {
      addNodeAndEdges("Layermark");
    }, REVEAL_TIMING.LAYERMARK_DELAY_MS);

    addTimer(() => {
      addNodeAndEdges("Intenseye");
    }, REVEAL_TIMING.INTENSEYE_DELAY_MS);

    addTimer(() => {
      debouncedFitView();
    }, REVEAL_TIMING.INTENSEYE_DELAY_MS + 500);
  }, [addNodeAndEdges, debouncedFitView, addTimer]);

  const handleGraphEnter = useCallback(() => {
    const { hasStartedReveal } = useGraphStore.getState();
    if (!hasStartedReveal) {
      startRevealSequence();
    }
  }, [startRevealSequence]);

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

    debouncedFitView();
  }, [graphDimensions, setNodes, handleNodeHover, debouncedFitView]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        zIndex: expandedNodes.includes(node.id) ? 1000 : undefined,
      })),
    );
  }, [expandedNodes, setNodes]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      debouncedFitView.cancel();
    };
  }, [debouncedFitView]);

  return (
    <div id="graph" className="relative lg:pt-[9.5rem]">
      <p className="text-stone-400 mb-4">Interact with nodes to explore</p>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        ref={graphContainerRef}
        className="relative h-[500px] md:h-[700px] rounded-xl border border-stone-800 bg-stone-950/50 overflow-hidden"
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
