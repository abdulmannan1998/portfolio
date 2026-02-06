import { NextResponse } from "next/server";

// RedactedCommit type - must match the shape in github-activity.tsx
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

// Hardcoded username - matches SOCIAL_LINKS.github.username from lib/social-links.ts
const GITHUB_USERNAME = "abdulmannan1998";

type GitHubEvent = {
  id: string;
  type: string;
  repo: { name: string };
  payload: {
    commits?: Array<{ message: string; sha: string }>;
    head?: string;
    before?: string;
    ref?: string;
  };
  created_at: string;
  public: boolean;
};

type GitHubCommitResponse = {
  sha: string;
  commit: { message: string };
};

function makeHeaders(token: string | undefined): HeadersInit {
  const h: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;

    const apiUrl = githubToken
      ? `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30`
      : `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`;

    const headers = makeHeaders(githubToken);

    const response = await fetch(apiUrl, { headers, cache: "no-store" });

    if (!response.ok) {
      console.error("GitHub API error:", response.status, response.statusText);
      return NextResponse.json(
        { commits: [], error: "GitHub API unavailable" },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        },
      );
    }

    const events: GitHubEvent[] = await response.json();

    // Filter to PushEvent only, take first 3
    const pushEvents = events.filter((e) => e.type === "PushEvent").slice(0, 3);

    // For events without payload.commits (private repos), fetch the head commit
    const commits: RedactedCommit[] = await Promise.all(
      pushEvents.map(async (event, index) => {
        const isPublic = event.public;
        const isOwn = event.repo.name.startsWith(`${GITHUB_USERNAME}/`);

        // Determine visibility tier
        const visibility: RedactedCommit["visibility"] = isPublic
          ? "public"
          : isOwn
            ? "own-private"
            : "org-private";

        // Get commit message + sha
        let message: string;
        let sha: string;

        if (event.payload.commits && event.payload.commits.length > 0) {
          // Public events typically include commits array
          message = event.payload.commits[0].message;
          sha = event.payload.commits[0].sha;
        } else if (event.payload.head) {
          // Private events only have head SHA — fetch commit details
          // Skip fetch for org-private since we redact the message anyway
          sha = event.payload.head;

          if (visibility === "org-private") {
            message = "[CLASSIFIED]";
          } else {
            // Fetch actual commit message for public/own-private
            try {
              const commitRes = await fetch(
                `https://api.github.com/repos/${event.repo.name}/commits/${sha}`,
                { headers, cache: "no-store" },
              );
              if (commitRes.ok) {
                const commitData: GitHubCommitResponse = await commitRes.json();
                message = commitData.commit.message;
              } else {
                message = "Pushed changes";
              }
            } catch {
              message = "Pushed changes";
            }
          }
        } else {
          sha = event.id;
          message = "Pushed changes";
        }

        // Apply redaction based on visibility
        if (visibility === "public") {
          return {
            id: `${sha}-${index}`,
            repo: event.repo.name,
            repoShort: event.repo.name.split("/")[1] || event.repo.name,
            message,
            sha,
            timestamp: event.created_at,
            visibility,
            repoUrl: `https://github.com/${event.repo.name}`,
            commitUrl: `https://github.com/${event.repo.name}/commit/${sha}`,
          };
        }

        if (visibility === "own-private") {
          return {
            id: `${sha}-${index}`,
            repo: "[REDACTED]",
            repoShort: "[REDACTED]",
            message,
            sha,
            timestamp: event.created_at,
            visibility,
            repoUrl: null,
            commitUrl: null,
          };
        }

        // org-private
        return {
          id: `${sha.substring(0, 7)}-${index}`,
          repo: "[REDACTED]",
          repoShort: "[REDACTED]",
          message: "[CLASSIFIED]",
          sha: sha.substring(0, 7),
          timestamp: event.created_at,
          visibility,
          repoUrl: null,
          commitUrl: null,
        };
      }),
    );

    return NextResponse.json(
      { commits },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching GitHub events:", error);
    return NextResponse.json(
      { commits: [], error: "GitHub API unavailable" },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  }
}
