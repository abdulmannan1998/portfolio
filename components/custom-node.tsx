"use client";

import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Building2, GraduationCap, Code2, User, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

// Stable random values for animations (computed once at module load)
const softSkillDuration = 3 + Math.random() * 2;
const techDuration = 2.5 + Math.random() * 1.5;

// Animation variants for entrance effects
const getEntranceAnimation = (type?: string) => {
  switch (type) {
    case "hero-entrance":
      return {
        initial: { opacity: 0, scale: 0.5 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as const },
      };
    case "bloom-in":
      return {
        initial: { opacity: 0, scale: 0.3, rotate: -45 },
        animate: { opacity: 1, scale: 1, rotate: 0 },
        transition: { duration: 0.6, ease: "easeOut" as const },
      };
    case "slide-up":
      return {
        initial: { opacity: 0, y: 60, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
      };
    case "fade-drop":
      return {
        initial: { opacity: 0, y: -30, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.5, ease: "easeOut" as const },
      };
    case "pop-in":
      return {
        initial: { opacity: 0, scale: 0.6 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: 0.4,
          ease: [0.68, -0.55, 0.265, 1.55] as const,
        },
      };
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4, ease: "easeOut" as const },
      };
  }
};

export function CustomNode({
  data,
  selected,
}: {
  data: {
    label: string;
    type: string;
    period?: string;
    animationDelay?: number;
    animationType?: string;
  };
  selected: boolean;
}) {
  const entranceAnim = getEntranceAnimation(data.animationType);
  const delay = data.animationDelay ?? 0;
  // Root node (name) - HERO with maximum prominence
  if (data.type === "root") {
    return (
      <motion.div
        initial={entranceAnim.initial}
        animate={entranceAnim.animate}
        transition={{ ...entranceAnim.transition, delay }}
        className={cn(
          "relative rounded-xl border-2 bg-gradient-to-br from-orange-500/20 to-stone-900 px-8 py-5 shadow-2xl transition-all",
          selected
            ? "border-orange-500 shadow-orange-500/40 scale-105"
            : "border-orange-500/60 hover:border-orange-500 hover:shadow-orange-500/30",
        )}
        whileHover={{
          scale: 1.03,
          boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)",
        }}
      >
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-orange-500 !w-3 !h-3"
        />
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 ring-2 ring-orange-500/30">
            <User className="h-6 w-6 text-orange-500" />
          </div>
          <div className="text-xl font-bold text-orange-400">{data.label}</div>
        </div>
      </motion.div>
    );
  }

  // Company nodes - prominent timeline markers
  if (data.type === "company") {
    return (
      <motion.div
        initial={entranceAnim.initial}
        animate={entranceAnim.animate}
        transition={{ ...entranceAnim.transition, delay }}
        className={cn(
          "relative rounded-lg border-2 bg-stone-900 px-5 py-3 shadow-lg transition-all",
          selected
            ? "border-blue-500 shadow-blue-500/30 scale-105"
            : "border-blue-500/50 hover:border-blue-500 hover:shadow-blue-500/20",
        )}
        whileHover={{ scale: 1.03, y: -2 }}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-blue-500 !w-3 !h-3"
        />
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/20 ring-1 ring-blue-500/30">
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
      </motion.div>
    );
  }

  // Education nodes - prominent timeline markers
  if (data.type === "education") {
    return (
      <motion.div
        initial={entranceAnim.initial}
        animate={entranceAnim.animate}
        transition={{ ...entranceAnim.transition, delay }}
        className={cn(
          "relative rounded-lg border-2 bg-stone-900 px-5 py-3 shadow-lg transition-all",
          selected
            ? "border-purple-500 shadow-purple-500/30 scale-105"
            : "border-purple-500/50 hover:border-purple-500 hover:shadow-purple-500/20",
        )}
        whileHover={{ scale: 1.03, y: -2 }}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-purple-500 !w-3 !h-3"
        />
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/20 ring-1 ring-purple-500/30">
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
      </motion.div>
    );
  }

  // Soft skill nodes - bloom entrance + continuous float
  if (data.type === "soft-skill") {
    return (
      <motion.div
        initial={entranceAnim.initial}
        animate={{
          ...entranceAnim.animate,
          y: [0, -8, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          opacity: { duration: 0.6, delay },
          scale: { duration: 0.6, delay },
          y: {
            duration: softSkillDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 0.6,
          },
          rotate: {
            duration: softSkillDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 0.6,
          },
        }}
        className={cn(
          "relative rounded-full border bg-stone-900 px-4 py-2 shadow-sm transition-all opacity-70",
          selected
            ? "border-emerald-500 text-emerald-400 shadow-emerald-500/10"
            : "border-emerald-500/40 text-emerald-400/70 hover:border-emerald-500/60 hover:text-emerald-400",
        )}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-emerald-500 !w-2 !h-2"
        />
        <div className="flex items-center gap-2 text-xs font-medium">
          <Lightbulb className="h-3 w-3" />
          {data.label}
        </div>
      </motion.div>
    );
  }

  // Tech nodes - subtle supporting details, reduced prominence
  if (data.type === "tech") {
    return (
      <motion.div
        initial={entranceAnim.initial}
        animate={{
          ...entranceAnim.animate,
          y: [0, -4, 0],
          rotate: [-0.5, 0.5, -0.5],
        }}
        transition={{
          opacity: { duration: 0.4, delay },
          scale: { duration: 0.4, delay },
          y: {
            duration: techDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 0.4,
          },
          rotate: {
            duration: techDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 0.4,
          },
        }}
        className={cn(
          "relative rounded border bg-stone-950/80 px-2.5 py-1 text-xs font-medium shadow-sm transition-all opacity-80",
          selected
            ? "border-orange-500 text-orange-400 shadow-orange-500/10 opacity-100"
            : "border-stone-800 text-stone-500 hover:border-orange-500/50 hover:text-stone-400 hover:opacity-100",
        )}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-stone-700 !w-1.5 !h-1.5"
        />
        <div className="flex items-center gap-1.5">
          <Code2 className="h-2.5 w-2.5" />
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
