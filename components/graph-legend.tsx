"use client";

import { motion } from "framer-motion";
import {
  Building2,
  GraduationCap,
  Code2,
  User,
  Lightbulb,
  Briefcase,
} from "lucide-react";

export function GraphLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 rounded-lg border border-stone-800 bg-stone-950/95 p-4 shadow-xl backdrop-blur-sm max-w-[200px]"
    >
      <h3 className="mb-3 text-sm font-semibold text-stone-300">
        Graph Legend
      </h3>

      {/* Node Types */}
      <div className="mb-4 space-y-2">
        <div className="text-xs font-medium text-stone-500">Node Types</div>

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20">
            <User className="h-3 w-3 text-orange-500" />
          </div>
          <span className="text-xs text-stone-400">Profile</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/20">
            <Building2 className="h-3 w-3 text-blue-500" />
          </div>
          <span className="text-xs text-stone-400">Company</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/20">
            <GraduationCap className="h-3 w-3 text-purple-500" />
          </div>
          <span className="text-xs text-stone-400">Education</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-500/20">
            <Briefcase className="h-3 w-3 text-orange-500" />
          </div>
          <span className="text-xs text-stone-400">Achievement</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20">
            <Lightbulb className="h-3 w-3 text-emerald-500" />
          </div>
          <span className="text-xs text-stone-400">Soft Skill</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-700/50">
            <Code2 className="h-3 w-3 text-stone-400" />
          </div>
          <span className="text-xs text-stone-400">Technology</span>
        </div>
      </div>

      {/* Edge Types */}
      <div className="space-y-2 border-t border-stone-800 pt-3">
        <div className="text-xs font-medium text-stone-500">
          Connection Types
        </div>

        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-blue-500" />
          <span className="text-xs text-stone-400">Career Path</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-violet-500" />
          <span className="text-xs text-stone-400">Education</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-orange-500" />
          <span className="text-xs text-stone-400">Project</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-emerald-500" />
          <span className="text-xs text-stone-400">Soft Skill</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-purple-500" />
          <span className="text-xs text-stone-400">Uses Tech</span>
        </div>
      </div>

      <div className="mt-3 border-t border-stone-800 pt-3 text-xs text-stone-500">
        Click achievements to expand details
      </div>
    </motion.div>
  );
}
