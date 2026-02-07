"use client";

import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Building2, GraduationCap, User, Lightbulb } from "lucide-react";
import { motion, type Variants } from "framer-motion";

// Stable random values for animations (computed once at module load)
const softSkillDuration = 3 + Math.random() * 2;

// Module-level animation variants (computed once at module load)
const HERO_ENTRANCE_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
};

const BLOOM_IN_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.3, rotate: -45 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
};

const SLIDE_UP_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
};

const FADE_DROP_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
};

const POP_IN_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
};

const DEFAULT_VARIANTS: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

// Module-level transition constants
const HERO_ENTRANCE_TRANSITION = {
  duration: 0.8,
  ease: [0.34, 1.56, 0.64, 1] as const,
};

const BLOOM_TRANSITION = {
  duration: 0.6,
  ease: "easeOut" as const,
};

const SLIDE_UP_TRANSITION = {
  duration: 0.5,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

const FADE_DROP_TRANSITION = {
  duration: 0.4,
  ease: "easeOut" as const,
};

const POP_IN_TRANSITION = {
  duration: 0.4,
  ease: [0.68, -0.55, 0.265, 1.55] as const,
};

const DEFAULT_TRANSITION = {
  duration: 0.4,
  ease: "easeOut" as const,
};

// Get animation config (returns references to module-level constants)
const getAnimationConfig = (type?: string) => {
  switch (type) {
    case "hero-entrance":
      return {
        variants: HERO_ENTRANCE_VARIANTS,
        transition: HERO_ENTRANCE_TRANSITION,
      };
    case "bloom-in":
      return {
        variants: BLOOM_IN_VARIANTS,
        transition: BLOOM_TRANSITION,
      };
    case "slide-up":
      return {
        variants: SLIDE_UP_VARIANTS,
        transition: SLIDE_UP_TRANSITION,
      };
    case "fade-drop":
      return {
        variants: FADE_DROP_VARIANTS,
        transition: FADE_DROP_TRANSITION,
      };
    case "pop-in":
      return {
        variants: POP_IN_VARIANTS,
        transition: POP_IN_TRANSITION,
      };
    default:
      return {
        variants: DEFAULT_VARIANTS,
        transition: DEFAULT_TRANSITION,
      };
  }
};

export function CustomNode({
  data,
  selected,
  id,
}: {
  data: {
    label: string;
    type: string;
    period?: string;
    animationDelay?: number;
    animationType?: string;
    onHoverChange?: (nodeId: string, isEntering: boolean) => void;
    onClickReveal?: () => void;
    isRevealing?: boolean;
  };
  selected: boolean;
  id: string;
}) {
  const { variants, transition } = getAnimationConfig(data.animationType);
  const delay = data.animationDelay ?? 0;
  // Root node (name) - HERO with maximum prominence and pulsing animation
  if (data.type === "root") {
    return (
      <motion.div
        variants={variants}
        initial="initial"
        animate={{
          ...variants.animate,
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 20px 40px rgba(249, 115, 22, 0.2)",
            "0 20px 60px rgba(249, 115, 22, 0.4)",
            "0 20px 40px rgba(249, 115, 22, 0.2)",
          ],
        }}
        transition={{
          ...transition,
          delay,
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 0.8,
          },
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 0.8,
          },
        }}
        className={cn(
          "relative rounded-xl border-2 bg-gradient-to-br from-orange-500/20 to-stone-900 px-8 py-5 shadow-2xl transition-all cursor-pointer",
          selected
            ? "border-orange-500 shadow-orange-500/40 scale-105"
            : "border-orange-500/60 hover:border-orange-500 hover:shadow-orange-500/30",
        )}
        whileHover={{
          scale: 1.03,
          boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)",
        }}
        onClick={() => data.onClickReveal?.()}
      >
        <Handle
          type="source"
          id="top"
          position={Position.Top}
          className="!bg-orange-500 !w-3 !h-3"
        />
        <Handle
          type="source"
          id="bottom"
          position={Position.Bottom}
          className="!bg-orange-500 !w-3 !h-3"
        />
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 ring-2 ring-orange-500/30">
            <User className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold text-orange-400">
              {data.label}
            </div>
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: data.isRevealing ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-stone-500"
            >
              Click to explore career
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Company nodes - prominent timeline markers (hover reveals achievement nodes)
  if (data.type === "company") {
    return (
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        transition={{ ...transition, delay }}
        className="relative"
        onMouseEnter={() => {
          data.onHoverChange?.(id, true);
        }}
        onMouseLeave={() => {
          data.onHoverChange?.(id, false);
        }}
      >
        <motion.div
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
      </motion.div>
    );
  }

  // Education nodes - prominent timeline markers (hover reveals project nodes)
  if (data.type === "education") {
    return (
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        transition={{ ...transition, delay }}
        className="relative"
        onMouseEnter={() => {
          data.onHoverChange?.(id, true);
        }}
        onMouseLeave={() => {
          data.onHoverChange?.(id, false);
        }}
      >
        <motion.div
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
      </motion.div>
    );
  }

  // Soft skill nodes - bloom entrance + continuous float
  if (data.type === "soft-skill") {
    return (
      <motion.div
        variants={variants}
        initial="initial"
        animate={{
          ...variants.animate,
          y: [0, -8, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          ...transition,
          delay,
          y: {
            duration: softSkillDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + (transition.duration || 0.6),
          },
          rotate: {
            duration: softSkillDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + (transition.duration || 0.6),
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
          id="bottom"
          position={Position.Bottom}
          className="!bg-emerald-500 !w-2 !h-2"
        />
        <div className="flex items-center gap-2 text-xs font-medium">
          <Lightbulb className="h-3 w-3" />
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
