"use client";

import { useState, useEffect } from "react";
import { Github, ExternalLink, Lock, Globe, ShieldAlert } from "lucide-react";

// RedactedCommit type - matches app/api/github/route.ts
export type RedactedCommit = {
  id: string;
  repo: string;
  repoShort: string;
  message: string;
  sha: string;
  timestamp: string;
  visibility: "public" | "own-private" | "org-private";
  repoUrl: string | null;
  commitUrl: string | null;
};

export type GitHubActivityProps = {
  username?: string;
};

// Module-level cache (outside component)
type CacheEntry = {
  data: RedactedCommit[];
  timestamp: number;
};

const commitCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedCommits(): RedactedCommit[] | null {
  const cacheKey = "github_commits";
  const cached = commitCache.get(cacheKey);

  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    commitCache.delete(cacheKey);
    return null;
  }

  return cached.data;
}

function setCachedCommits(commits: RedactedCommit[]): void {
  const cacheKey = "github_commits";
  commitCache.set(cacheKey, {
    data: commits,
    timestamp: Date.now(),
  });
}

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

export function GitHubActivity({ username = "" }: GitHubActivityProps) {
  const [commits, setCommits] = useState<RedactedCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHubActivity() {
      // Check cache first
      const cached = getCachedCommits();
      if (cached) {
        setCommits(cached);
        setLoading(false);
        return;
      }

      // Fetch from our API route
      try {
        const response = await fetch("/api/github");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          // Cache the response
          setCachedCommits(data.commits || []);
          setCommits(data.commits || []);
        }
      } catch {
        setError("Unable to load activity");
      } finally {
        setLoading(false);
      }
    }
    fetchGitHubActivity();
  }, []);

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
          {!loading && commits.length > 0 && (
            <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/20 text-orange-500 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        {/* Commits list */}
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-full bg-white/10 animate-pulse" />
                <div className="h-4 w-2/3 bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-white/40 font-mono text-sm">{error}</p>
        ) : commits.length === 0 ? (
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
