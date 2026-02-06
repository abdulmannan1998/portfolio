import {
  Building2,
  GraduationCap,
  User,
  Lightbulb,
  Briefcase,
} from "lucide-react";

export function GraphLegend() {
  return (
    <div
      className="rounded-lg border border-stone-800/50 bg-stone-950/80 p-4 shadow-xl backdrop-blur-sm max-w-[200px] opacity-80 hover:opacity-100 transition-opacity"
      style={{ animation: "legend-slide-in 0.5s ease-out forwards" }}
    >
      <h3 className="mb-3 text-xs font-semibold text-stone-400">Legend</h3>

      {/* Node Types */}
      <div className="mb-3 space-y-1.5">
        <div className="text-[10px] font-medium text-stone-600 uppercase tracking-wider">
          Nodes
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/15">
            <User className="h-2.5 w-2.5 text-orange-500" />
          </div>
          <span className="text-[11px] text-stone-500">Profile</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/15">
            <Building2 className="h-2.5 w-2.5 text-blue-500" />
          </div>
          <span className="text-[11px] text-stone-500">Company</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-purple-500/15">
            <GraduationCap className="h-2.5 w-2.5 text-purple-500" />
          </div>
          <span className="text-[11px] text-stone-500">Education</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-orange-500/15">
            <Briefcase className="h-2.5 w-2.5 text-orange-500" />
          </div>
          <span className="text-[11px] text-stone-500">Achievement</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15">
            <Lightbulb className="h-2.5 w-2.5 text-emerald-500" />
          </div>
          <span className="text-[11px] text-stone-500">Soft Skill</span>
        </div>
      </div>

      {/* Edge Types */}
      <div className="space-y-1.5 border-t border-stone-800/50 pt-2.5">
        <div className="text-[10px] font-medium text-stone-600 uppercase tracking-wider">
          Connections
        </div>

        <div className="flex items-center gap-2">
          <div className="h-0.5 w-5 bg-blue-500/60" />
          <span className="text-[11px] text-stone-500">Career</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-0.5 w-5 bg-violet-500/60" />
          <span className="text-[11px] text-stone-500">Education</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-0.5 w-5 bg-orange-500/60" />
          <span className="text-[11px] text-stone-500">Project</span>
        </div>
      </div>

      <div className="mt-2.5 border-t border-stone-800/50 pt-2.5 text-[10px] text-stone-600">
        💡 Click achievements to expand
      </div>
    </div>
  );
}
