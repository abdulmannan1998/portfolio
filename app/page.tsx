export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-orange-950 px-4">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Gradient orb effects */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-stone-500/10 blur-3xl delay-1000" />

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
          Mannan
        </h1>

        <div className="mb-4 flex items-center justify-center gap-2 text-lg text-stone-300 sm:text-xl">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-orange-500" />
          <p>Senior Software Engineer</p>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-orange-500" />
        </div>

        <p className="text-base text-stone-400 sm:text-lg">
          Lab & Portfolio Coming Soon
        </p>

        {/* Subtle animated indicator */}
        <div className="mt-12 flex justify-center">
          <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
        </div>
      </div>
    </div>
  );
}
