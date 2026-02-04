"use client";

import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Building2, GraduationCap, Code2, User, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

// Stable random values for animations (computed once at module load)
const softSkillDuration = 3 + Math.random() * 2;
const softSkillDelay = Math.random() * 2;
const techDuration = 2.5 + Math.random() * 1.5;
const techDelay = Math.random() * 2;

export function CustomNode({
  data,
  selected,
}: {
  data: { label: string; type: string; period?: string };
  selected: boolean;
}) {
  // Root node (name) - special styling
  if (data.type === "root") {
    return (
      <div
        className={cn(
          "relative rounded-xl border-2 bg-gradient-to-br from-orange-500/20 to-stone-900 px-6 py-4 shadow-lg transition-all",
          selected
            ? "border-orange-500 shadow-orange-500/30 scale-105"
            : "border-orange-500/50 hover:border-orange-500 hover:shadow-orange-500/20",
        )}
      >
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-orange-500 !w-3 !h-3"
        />
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
            <User className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-lg font-bold text-orange-400">{data.label}</div>
        </div>
      </div>
    );
  }

  // Company nodes - enhanced styling
  if (data.type === "company") {
    return (
      <div
        className={cn(
          "relative rounded-lg border-2 bg-stone-900 px-5 py-3 shadow-md transition-all",
          selected
            ? "border-blue-500 shadow-blue-500/20 scale-105"
            : "border-blue-500/50 hover:border-blue-500 hover:shadow-blue-500/10",
        )}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-blue-500 !w-3 !h-3"
        />
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/20">
            <Building2 className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <div className="text-base font-semibold text-blue-400">
              {data.label}
            </div>
            {data.period && (
              <div className="text-xs text-stone-500">{data.period}</div>
            )}
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-blue-500 !w-3 !h-3"
        />
      </div>
    );
  }

  // Education nodes
  if (data.type === "education") {
    return (
      <div
        className={cn(
          "relative rounded-lg border-2 bg-stone-900 px-5 py-3 shadow-md transition-all",
          selected
            ? "border-purple-500 shadow-purple-500/20 scale-105"
            : "border-purple-500/50 hover:border-purple-500 hover:shadow-purple-500/10",
        )}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-purple-500 !w-3 !h-3"
        />
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/20">
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <div className="text-base font-semibold text-purple-400">
              {data.label}
            </div>
            {data.period && (
              <div className="text-xs text-stone-500">{data.period}</div>
            )}
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-purple-500 !w-3 !h-3"
        />
      </div>
    );
  }

  // Soft skill nodes
  if (data.type === "soft-skill") {
    return (
      <motion.div
        className={cn(
          "relative rounded-full border-2 bg-stone-900 px-4 py-2 shadow-sm transition-all",
          selected
            ? "border-emerald-500 text-emerald-400 shadow-emerald-500/20"
            : "border-emerald-500/50 text-emerald-400/80 hover:border-emerald-500 hover:text-emerald-400",
        )}
        animate={{
          y: [0, -8, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: softSkillDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: softSkillDelay,
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-emerald-500 !w-2 !h-2"
        />
        <div className="flex items-center gap-2 text-sm font-medium">
          <Lightbulb className="h-3 w-3" />
          {data.label}
        </div>
      </motion.div>
    );
  }

  // Tech nodes
  if (data.type === "tech") {
    return (
      <motion.div
        className={cn(
          "relative rounded-md border bg-stone-950 px-3 py-1.5 text-xs font-medium shadow-sm transition-all",
          selected
            ? "border-orange-500 text-orange-400 shadow-orange-500/10"
            : "border-stone-700 text-stone-400 hover:border-orange-500/50 hover:text-stone-300",
        )}
        animate={{
          y: [0, -5, 0],
          rotate: [-1, 1, -1],
        }}
        transition={{
          duration: techDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: techDelay,
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-stone-700 !w-2 !h-2"
        />
        <div className="flex items-center gap-1.5">
          <Code2 className="h-3 w-3" />
          {data.label}
        </div>
      </motion.div>
    );
  }

  // Default fallback
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
        className="!bg-stone-800 !w-2 !h-2"
      />
      <div className="flex items-center gap-2">{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-stone-800 !w-2 !h-2"
      />
    </div>
  );
}
