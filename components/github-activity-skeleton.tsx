export function GitHubActivitySkeleton() {
  return (
    <div className="relative bg-stone-900 p-6">
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-orange-500" />

      <div className="relative">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-6 bg-white/10 animate-pulse rounded" />
          <div>
            <div className="h-3 w-16 bg-white/10 animate-pulse rounded mb-1" />
            <div className="h-5 w-20 bg-white/10 animate-pulse rounded" />
          </div>
        </div>

        {/* Commit placeholders */}
        <div className="space-y-5">
          {/* First commit (wider) */}
          <div className="space-y-2 pb-5 border-b border-white/10">
            <div className="flex items-start gap-3">
              <div className="h-4 w-4 bg-white/10 animate-pulse rounded mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-5 w-[85%] bg-white/10 animate-pulse rounded" />
              </div>
              <div className="h-3 w-12 bg-white/10 animate-pulse rounded shrink-0" />
            </div>
            <div className="flex items-center gap-3 ml-7">
              <div className="h-4 w-24 bg-white/10 animate-pulse rounded" />
              <div className="h-3 w-16 bg-white/10 animate-pulse rounded" />
            </div>
          </div>

          {/* Second commit (medium) */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="h-4 w-4 bg-white/10 animate-pulse rounded mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 w-[70%] bg-white/10 animate-pulse rounded" />
              </div>
              <div className="h-3 w-12 bg-white/10 animate-pulse rounded shrink-0" />
            </div>
            <div className="flex items-center gap-3 ml-7">
              <div className="h-4 w-24 bg-white/10 animate-pulse rounded" />
              <div className="h-3 w-16 bg-white/10 animate-pulse rounded" />
            </div>
          </div>

          {/* Third commit (shorter) */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="h-4 w-4 bg-white/10 animate-pulse rounded mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 w-[55%] bg-white/10 animate-pulse rounded" />
              </div>
              <div className="h-3 w-12 bg-white/10 animate-pulse rounded shrink-0" />
            </div>
            <div className="flex items-center gap-3 ml-7">
              <div className="h-4 w-24 bg-white/10 animate-pulse rounded" />
              <div className="h-3 w-16 bg-white/10 animate-pulse rounded" />
            </div>
          </div>
        </div>

        {/* View Profile link skeleton */}
        <div className="mt-6 flex items-center gap-2">
          <div className="h-4 w-28 bg-white/10 animate-pulse rounded" />
          <div className="h-3 w-3 bg-white/10 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
