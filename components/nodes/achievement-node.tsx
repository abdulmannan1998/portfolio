"use client";

import { motion } from "framer-motion";
import { Handle, Position } from "@xyflow/react";
import { useGraphStore } from "@/lib/stores/graph-store";
import { X } from "lucide-react";
import type { AchievementNodeDisplayData } from "@/lib/layout-calculator";

type AchievementNodeProps = {
  id: string;
  data: AchievementNodeDisplayData;
  selected: boolean;
};

const categoryColors = {
  dashboard: "border-blue-500 bg-blue-500/10",
  tooling: "border-green-500 bg-green-500/10",
  "design-system": "border-purple-500 bg-purple-500/10",
  architecture: "border-orange-500 bg-orange-500/10",
  innovation: "border-pink-500 bg-pink-500/10",
};

const categoryDotColors = {
  dashboard: "bg-blue-500",
  tooling: "bg-green-500",
  "design-system": "bg-purple-500",
  architecture: "bg-orange-500",
  innovation: "bg-pink-500",
};

export function AchievementNode({
  id: _id,
  data,
  selected,
}: AchievementNodeProps) {
  const { expandedNodes, expandNode, collapseNode } = useGraphStore();
  const isExpanded = expandedNodes.includes(data.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExpanded) {
      collapseNode(data.id);
    } else {
      expandNode(data.id);
    }
  };

  // Entrance animation (fade-drop)
  const delay = data.animationDelay ?? 0;

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-stone-700" />
      <motion.div
        layout
        onClick={handleClick}
        // Entrance animation - use only opacity/scale to avoid edge path calculation issues
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          relative cursor-pointer overflow-hidden
          rounded-lg border-2 bg-stone-900
          ${selected || isExpanded ? categoryColors[data.category] : "border-stone-800"}
          transition-colors duration-200
        `}
        variants={{
          collapsed: { width: 250, height: 80 },
          expanded: { width: 400, height: "auto", minHeight: 300 },
        }}
        transition={
          isExpanded
            ? { type: "spring", stiffness: 300, damping: 30 }
            : {
                opacity: { duration: 0.4, delay },
                scale: { duration: 0.4, delay },
              }
        }
        whileHover={
          !isExpanded
            ? {
                scale: 1.03,
                boxShadow: "0 8px 20px rgba(249, 115, 22, 0.25)",
              }
            : undefined
        }
      >
        {/* Collapsed State */}
        {!isExpanded && (
          <div className="flex h-full flex-col justify-between p-3">
            <div className="flex items-start gap-2">
              {/* Category Indicator */}
              <div
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${categoryDotColors[data.category]}`}
              />
              {/* Title */}
              <h3 className="flex-1 text-sm font-semibold leading-tight text-stone-100">
                {data.title}
              </h3>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between">
              {/* Company Badge */}
              <span className="rounded bg-stone-800 px-2 py-0.5 text-xs text-stone-400">
                {data.company}
              </span>
              {/* Tech Count */}
              <span className="text-xs text-stone-500">
                {data.technologies.length} tech
                {data.technologies.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        {/* Expanded State */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex h-full flex-col p-4"
          >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <div
                    className={`h-2 w-2 shrink-0 rounded-full ${categoryDotColors[data.category]}`}
                  />
                  <span className="rounded bg-stone-800 px-2 py-0.5 text-xs text-stone-400">
                    {data.company}
                  </span>
                </div>
                <h3 className="text-base font-semibold leading-tight text-stone-100">
                  {data.title}
                </h3>
              </div>
              {/* Close Button */}
              <button
                onClick={handleClick}
                className="rounded p-1 text-stone-400 transition-colors hover:bg-stone-800 hover:text-stone-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            <p className="mb-3 text-sm leading-relaxed text-stone-300">
              {data.description}
            </p>

            {/* Impact */}
            <div className="mb-4 rounded-md bg-stone-800/50 p-2">
              <span className="text-xs font-medium text-stone-400">
                Impact:
              </span>
              <p className="mt-0.5 text-sm font-semibold text-orange-500">
                {data.impact}
              </p>
            </div>

            {/* Tech Badges */}
            <div className="mt-auto">
              <span className="mb-2 block text-xs font-medium text-stone-400">
                Technologies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.technologies.map((tech) => (
                  <motion.span
                    key={tech}
                    className="rounded bg-stone-800 px-2 py-1 text-xs font-mono text-stone-300 transition-colors hover:bg-stone-700"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-stone-700"
      />
    </>
  );
}
