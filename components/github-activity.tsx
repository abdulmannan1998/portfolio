"use client";

import { useState, useEffect } from "react";
import { Github, ExternalLink, GitCommit, Lock, Globe } from "lucide-react";

export type GitHubEvent = {
  id: string;
  type: string;
  repo: { name: string; url: string };
  payload: {
    commits?: { message: string; sha: string }[];
    ref?: string;
    action?: string;
  };
  created_at: string;
  public: boolean;
};

export type GitHubActivityProps = {
  username?: string;
};

// Module-level cache (outside component)
type CacheEntry = {
  data: GitHubEvent[];
  timestamp: number;
};

const eventCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedEvents(username: string): GitHubEvent[] | null {
  const cacheKey = `github_events_${username}`;
  const cached = eventCache.get(cacheKey);

  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    eventCache.delete(cacheKey);
    return null;
  }

  return cached.data;
}

function setCachedEvents(username: string, events: GitHubEvent[]): void {
  const cacheKey = `github_events_${username}`;
  eventCache.set(cacheKey, {
    data: events,
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

function getCommitMessage(event: GitHubEvent): string {
  if (event.type === "PushEvent" && event.payload.commits?.length) {
    const message = event.payload.commits[0].message;
    return message.length > 50 ? message.substring(0, 50) + "..." : message;
  }
  if (event.type === "CreateEvent")
    return `Created ${event.payload.ref || "repository"}`;
  if (event.type === "PullRequestEvent")
    return `${event.payload.action} pull request`;
  return event.type.replace("Event", "");
}

export function GitHubActivity({
  username = "sunnyimmortal",
}: GitHubActivityProps) {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHubActivity() {
      // Check cache first
      const cached = getCachedEvents(username);
      if (cached) {
        setEvents(cached);
        setLoading(false);
        return;
      }

      // Fetch from API
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=5`,
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();

        // Cache the response
        setCachedEvents(username, data);
        setEvents(data);
      } catch {
        setError("Unable to load activity");
      } finally {
        setLoading(false);
      }
    }
    fetchGitHubActivity();
  }, [username]);

  const latestEvent = events[0];

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
          {!loading && latestEvent && (
            <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/20 text-orange-500 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        {/* Latest Push */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
              Latest Push
            </span>
            {!loading && latestEvent && (
              <span className="text-xs font-mono text-white/30">
                {formatTimeAgo(latestEvent.created_at)}
              </span>
            )}
          </div>

          {loading ? (
            <div className="h-6 w-3/4 bg-white/10 animate-pulse" />
          ) : error ? (
            <p className="text-white/40 font-mono text-sm">{error}</p>
          ) : latestEvent ? (
            <>
              <p className="text-lg md:text-xl text-white font-black leading-tight mb-3">
                &quot;{getCommitMessage(latestEvent)}&quot;
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-white/40 font-mono">REPO:</span>
                {latestEvent.public ? (
                  <a
                    href={`https://github.com/${latestEvent.repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1 font-bold"
                  >
                    <Globe className="h-3 w-3" />
                    {latestEvent.repo.name.split("/")[1]}
                  </a>
                ) : (
                  <span className="text-orange-500 flex items-center gap-1 font-bold">
                    <Lock className="h-3 w-3" />
                    PRIVATE
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="text-white/40 font-mono">No recent activity</p>
          )}
        </div>

        {/* Recent Activity */}
        {!loading && events.length > 1 && (
          <div className="pt-6 border-t border-white/10">
            <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3">
              Recent Activity
            </p>
            <div className="space-y-2">
              {events.slice(1, 4).map((event) => (
                <div key={event.id} className="flex items-center gap-2 text-sm">
                  <GitCommit className="h-3 w-3 text-white/40 shrink-0" />
                  <span className="text-white/60 truncate flex-1 font-mono text-xs">
                    {getCommitMessage(event)}
                  </span>
                  <span className="text-white/30 text-xs font-mono shrink-0">
                    {formatTimeAgo(event.created_at)}
                  </span>
                </div>
              ))}
            </div>
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
