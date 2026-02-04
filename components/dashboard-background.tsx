"use client";

import { useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getInitialNodes, getInitialEdges } from "@/lib/graph-utils";
import { CustomNode } from "@/components/custom-node";
import { AchievementNode } from "@/components/nodes/achievement-node";
import { debounce } from "@/lib/debounce";
import { useGraphStore } from "@/lib/stores/graph-store";
import { GraphLegend } from "@/components/graph-legend";

const nodeTypes = {
  custom: CustomNode,
  achievement: AchievementNode,
};

export function DashboardBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize viewport with actual window dimensions if available
  const [viewport, setViewport] = useState(() => {
    if (typeof window !== "undefined") {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1920, height: 1080 };
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(
    getInitialNodes(viewport),
  );
  const [edges, , onEdgesChange] = useEdgesState(getInitialEdges());
  const expandedNodes = useGraphStore((state) => state.expandedNodes);

  useEffect(() => {
    // Skip if window is not available (SSR)
    if (typeof window === "undefined") return;

    // Debounced resize handler
    const handleResize = debounce(() => {
      const newViewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setViewport(newViewport);
      setNodes(getInitialNodes(newViewport));
    }, 300);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setNodes]);

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
    <div className="relative h-screen w-screen bg-stone-950 overflow-hidden">
      <div className="absolute inset-0 z-0">
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
          translateExtent={[
            [-2000, -2000],
            [viewport.width + 2000, viewport.height + 2000],
          ]}
          elevateNodesOnSelect
          className="bg-stone-950"
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#44403c" gap={24} size={1} />
        </ReactFlow>
      </div>

      <div className="pointer-events-none relative z-10 h-full w-full">
        {children}
      </div>

      <GraphLegend />
    </div>
  );
}
