import { RESUME_DATA } from "@/data/resume-data";

/**
 * Lightweight preloader with Tailwind + CSS animations
 * Loads quickly with minimal dependencies
 */
export function CSSPreloader() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black p-6 md:p-12 font-mono text-xs uppercase text-stone-400 tracking-widest"
      style={{ animation: "preloader-fade-in 0.3s ease-in" }}
    >
      <div className="flex h-full flex-col justify-between">
        {/* Top Section */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="mb-4 text-stone-100">LOADING</h2>
            <div className="flex flex-col gap-1 opacity-70">
              <div
                className="text-stone-100 opacity-100"
                style={{
                  animation: "preloader-step-fade 0.5s ease-in forwards",
                  animationDelay: "0s",
                }}
              >
                Loading application...
              </div>
              <div
                className="opacity-50"
                style={{
                  animation: "preloader-step-fade 0.5s ease-in forwards",
                  animationDelay: "0.3s",
                }}
              >
                Initializing React Flow...
              </div>
              <div
                className="opacity-50"
                style={{
                  animation: "preloader-step-fade 0.5s ease-in forwards",
                  animationDelay: "0.6s",
                }}
              >
                Loading graph system...
              </div>
              <div
                className="opacity-50"
                style={{
                  animation: "preloader-step-fade 0.5s ease-in forwards",
                  animationDelay: "0.9s",
                }}
              >
                Preparing components...
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div
            className="flex flex-col gap-4 opacity-0"
            style={{
              animation: "preloader-welcome-fade 0.5s ease-in 1s forwards",
            }}
          >
            <h2 className="text-stone-100">WELCOME</h2>

            <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-1">
              <span className="opacity-50">NAME :</span>
              <span className="text-stone-100">
                {RESUME_DATA.personal.name}
              </span>

              <span className="opacity-50">ROLE :</span>
              <span className="text-stone-100">
                {RESUME_DATA.personal.title}
              </span>

              <span className="opacity-50">FROM :</span>
              <span className="text-stone-100">
                {RESUME_DATA.personal.location}
              </span>

              <span className="opacity-50">LIKE :</span>
              <span className="text-stone-100">Clean Code &amp; UI</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="opacity-50">
          Transitioning to scene...
          <span
            className="ml-1 inline-block"
            style={{ animation: "preloader-blink 1s infinite" }}
          >
            _
          </span>
        </div>
      </div>
    </div>
  );
}
