"use client";

import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getInitialNodes, getInitialEdges } from "@/lib/graph-utils";
import { CustomNode } from "@/components/custom-node";

const nodeTypes = {
  custom: CustomNode,
};

export function DashboardBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nodes, , onNodesChange] = useNodesState(getInitialNodes());
  const [edges, , onEdgesChange] = useEdgesState(getInitialEdges());

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
          className="bg-stone-950"
        >
          <Background color="#44403c" gap={24} size={1} />
          <Controls className="bg-stone-900! border-stone-800! fill-stone-400!" />
        </ReactFlow>
      </div>

      <div className="relative z-10 pointer-events-none h-full w-full">
        {/* Allow children to interact via pointer-events-auto */}
        <div className="pointer-events-auto h-full w-full">{children}</div>
      </div>
    </div>
  );
}
