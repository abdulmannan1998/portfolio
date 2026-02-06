import { Github, ExternalLink, Lock, Globe, ShieldAlert } from "lucide-react";
import type { RedactedCommit } from "@/lib/github";

export type GitHubActivityProps = {
  commits: RedactedCommit[];
  username: string;
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Redaction visual component
function Redacted({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block px-2 py-0.5 bg-gradient-to-r from-orange-500/10 via-orange-500/25 to-orange-500/10 border-l-2 border-orange-500 overflow-hidden animate-pulse">
      <span className="text-orange-500/60 font-mono text-xs uppercase tracking-wider">
        {children}
      </span>
    </span>
  );
}

export function GitHubActivity({ commits, username }: GitHubActivityProps) {
  return (
    <div className="relative bg-stone-900 p-6">
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-orange-500" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Github className="h-6 w-6 text-white" />
          <div>
            <span className="text-white/40 font-mono text-xs uppercase tracking-wider">
              Live Feed
            </span>
            <h3 className="text-lg font-black text-white">GITHUB</h3>
          </div>
          {commits.length > 0 && (
            <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/20 text-orange-500 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        {/* Commits list */}
        {commits.length === 0 ? (
          <p className="text-white/40 font-mono text-sm">No recent commits</p>
        ) : (
          <div className="space-y-5">
            {commits.map((commit, index) => (
              <div
                key={commit.id}
                className={`space-y-2 ${index === 0 ? "pb-5 border-b border-white/10" : ""}`}
              >
                {/* Visibility indicator + message */}
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="shrink-0 mt-0.5">
                    {commit.visibility === "public" ? (
                      <Globe className="h-4 w-4 text-white/40" />
                    ) : commit.visibility === "own-private" ? (
                      <Lock className="h-4 w-4 text-orange-500" />
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-orange-500" />
                    )}
                  </div>

                  {/* Message */}
                  <div className="flex-1 min-w-0">
                    {commit.message === "[CLASSIFIED]" ? (
                      <Redacted>[CLASSIFIED]</Redacted>
                    ) : (
                      <p
                        className={`font-mono ${index === 0 ? "text-base md:text-lg" : "text-sm"} text-white leading-snug`}
                      >
                        {commit.message.length > 60
                          ? `${commit.message.substring(0, 60)}...`
                          : commit.message}
                      </p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-white/30 font-mono text-xs shrink-0">
                    {formatTimeAgo(commit.timestamp)}
                  </span>
                </div>

                {/* Repo + SHA */}
                <div className="flex items-center gap-3 ml-7">
                  {/* Repo */}
                  {commit.repo === "[REDACTED]" ? (
                    <Redacted>[REDACTED]</Redacted>
                  ) : commit.repoUrl ? (
                    <a
                      href={commit.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400 transition-colors font-bold text-sm"
                    >
                      {commit.repoShort}
                    </a>
                  ) : (
                    <span className="text-white/40 text-sm font-mono">
                      {commit.repoShort}
                    </span>
                  )}

                  {/* SHA */}
                  {commit.commitUrl ? (
                    <a
                      href={commit.commitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/20 hover:text-white/40 transition-colors font-mono text-[10px]"
                    >
                      {commit.sha.substring(0, 7)}
                    </a>
                  ) : (
                    <span className="text-white/20 font-mono text-[10px]">
                      {commit.sha.substring(0, 7)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Profile link */}
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-2 text-sm font-mono text-white/40 hover:text-orange-500 transition-colors"
        >
          VIEW PROFILE
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
