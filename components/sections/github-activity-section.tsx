"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, GitCommit, Lock, Globe } from "lucide-react";

type GitHubEvent = {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  payload: {
    commits?: { message: string; sha: string }[];
    ref?: string;
    action?: string;
  };
  created_at: string;
  public: boolean;
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

function getCommitMessage(event: GitHubEvent): string {
  if (event.type === "PushEvent" && event.payload.commits?.length) {
    const message = event.payload.commits[0].message;
    // Truncate long messages
    return message.length > 60 ? message.substring(0, 60) + "..." : message;
  }
  if (event.type === "CreateEvent") {
    return `Created ${event.payload.ref || "repository"}`;
  }
  if (event.type === "PullRequestEvent") {
    return `${event.payload.action} pull request`;
  }
  return event.type.replace("Event", "");
}

export function GitHubActivitySection({
  username = "sunnyimmortal",
}: {
  username?: string;
}) {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHubActivity() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=5`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch GitHub activity");
        }

        const data = await response.json();
        setEvents(data);
      } catch {
        setError("Unable to load GitHub activity");
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubActivity();
  }, [username]);

  const latestEvent = events[0];

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24">
      <div className="absolute inset-0 bg-stone-950" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* GitHub Activity Card */}
          <div className="relative rounded-2xl border border-stone-800 bg-gradient-to-br from-stone-900/80 to-stone-950 p-8 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-stone-800/30 to-transparent rounded-bl-full" />

            {/* Header */}
            <div className="relative flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Github className="h-8 w-8 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Mannan&apos;s{" "}
                    <span className="text-emerald-400 italic">Github</span>
                  </h3>
                </div>
              </div>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Latest Push */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                  Latest Push
                </span>
                {loading ? (
                  <div className="h-5 w-16 bg-stone-800 rounded animate-pulse" />
                ) : latestEvent ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {formatTimeAgo(latestEvent.created_at)}
                  </span>
                ) : null}
              </div>

              {loading ? (
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-stone-800 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-stone-800 rounded animate-pulse" />
                </div>
              ) : error ? (
                <p className="text-stone-500 text-sm">{error}</p>
              ) : latestEvent ? (
                <>
                  <p className="text-xl text-white font-medium leading-relaxed mb-3">
                    &quot;{getCommitMessage(latestEvent)}&quot;
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-stone-500">Repo:</span>
                    {latestEvent.public ? (
                      <a
                        href={`https://github.com/${latestEvent.repo.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
                      >
                        <Globe className="h-3 w-3" />
                        {latestEvent.repo.name.split("/")[1]}
                      </a>
                    ) : (
                      <span className="text-orange-400 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Private work
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-stone-500 text-sm">No recent activity</p>
              )}
            </div>

            {/* Recent commits preview */}
            {!loading && events.length > 1 && (
              <div className="mt-8 pt-6 border-t border-stone-800/50">
                <p className="text-xs font-mono text-stone-600 uppercase tracking-wider mb-4">
                  Recent Activity
                </p>
                <div className="space-y-3">
                  {events.slice(1, 4).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <GitCommit className="h-4 w-4 text-stone-600" />
                      <span className="text-stone-500 truncate flex-1">
                        {getCommitMessage(event)}
                      </span>
                      <span className="text-stone-600 text-xs font-mono">
                        {formatTimeAgo(event.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Links Card */}
          <div className="grid grid-rows-2 gap-4">
            {/* GitHub CTA */}
            <motion.a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="group relative flex items-center justify-between rounded-xl border border-stone-800 bg-stone-900/50 p-6 hover:border-stone-700 transition-all overflow-hidden"
            >
              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                  <Github className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-white transition-colors">
                    GitHub
                  </h4>
                  <p className="text-sm text-stone-500">
                    View my open source work
                  </p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-stone-600 group-hover:text-white transition-colors" />
            </motion.a>

            {/* LinkedIn CTA */}
            <motion.a
              href="https://linkedin.com/in/mannanabdul"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="group relative flex items-center justify-between rounded-xl border border-stone-800 bg-stone-900/50 p-6 hover:border-blue-500/30 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all">
                  <svg
                    className="h-7 w-7 text-blue-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    LinkedIn
                  </h4>
                  <p className="text-sm text-stone-500">
                    Let&apos;s connect professionally
                  </p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-stone-600 group-hover:text-blue-400 transition-colors" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
