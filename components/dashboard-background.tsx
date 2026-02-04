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
            padding: { top: 140, bottom: 220, left: 100, right: 100 },
            minZoom: 0.5,
            maxZoom: 1.2,
          }}
          minZoom={0.5}
          maxZoom={1.5}
          translateExtent={[
            [-500, -300],
            [viewport.width + 500, viewport.height + 300],
          ]}
          className="bg-stone-950"
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#44403c" gap={24} size={1} />
        </ReactFlow>
      </div>

      <div className="pointer-events-none relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}
