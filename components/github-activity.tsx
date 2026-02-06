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
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=5`,
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
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
    <div className="relative bg-stone-900 p-8 md:p-12">
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-orange-500" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Github className="h-8 w-8 text-white" />
            <div>
              <span className="text-white/40 font-mono text-xs uppercase tracking-wider">
                Live Feed
              </span>
              <h3 className="text-2xl font-black text-white">GITHUB</h3>
            </div>
          </div>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold text-sm hover:bg-orange-500 transition-colors"
          >
            VIEW PROFILE
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Latest Push */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
              Latest Push
            </span>
            {!loading && latestEvent && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-500 text-black text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                {formatTimeAgo(latestEvent.created_at)}
              </span>
            )}
          </div>

          {loading ? (
            <div className="h-8 w-3/4 bg-white/10 animate-pulse" />
          ) : error ? (
            <p className="text-white/40 font-mono">{error}</p>
          ) : latestEvent ? (
            <>
              <p className="text-2xl md:text-3xl text-white font-black leading-tight mb-4">
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
          <div className="pt-8 border-t border-white/10">
            <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-4">
              Recent Activity
            </p>
            <div className="space-y-3">
              {events.slice(1, 4).map((event) => (
                <div key={event.id} className="flex items-center gap-3 text-sm">
                  <GitCommit className="h-4 w-4 text-white/40" />
                  <span className="text-white/60 truncate flex-1 font-mono">
                    {getCommitMessage(event)}
                  </span>
                  <span className="text-white/40 text-xs font-mono">
                    {formatTimeAgo(event.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
