"use client";

import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

export function CustomNode({
  data,
  selected,
}: {
  data: { label: string; type: string };
  selected: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-md border bg-stone-950 px-4 py-2 text-sm font-medium shadow-sm transition-colors",
        selected
          ? "border-orange-500 text-orange-500 shadow-orange-500/20 shadow-md"
          : "border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="bg-stone-800! w-2! h-2!"
      />

      <div className="flex items-center gap-2">
        {data.type === "company" && (
          <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
        )}
        {data.type === "tech" && (
          <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
        )}
        {data.type === "education" && (
          <span className="inline-block h-2 w-2 rounded-full bg-purple-500" />
        )}
        {data.label}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-stone-800! w-2! h-2!"
      />
    </div>
  );
}
