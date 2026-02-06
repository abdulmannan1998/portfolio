import { NextResponse } from "next/server";

// RedactedCommit type - must match the shape in github-activity.tsx
export type RedactedCommit = {
  id: string; // unique id (sha + index)
  repo: string; // full "owner/repo" or "[REDACTED]"
  repoShort: string; // just repo name or "[REDACTED]"
  message: string; // commit message or "[CLASSIFIED]"
  sha: string; // full sha or truncated 7-char
  timestamp: string; // ISO date string
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
  };
  created_at: string;
  public: boolean;
};

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;

    // Determine API endpoint and headers based on token availability
    const apiUrl = githubToken
      ? `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30`
      : `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`;

    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (githubToken) {
      headers.Authorization = `Bearer ${githubToken}`;
    }

    // Fetch events from GitHub API
    const response = await fetch(apiUrl, { headers });

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

    // Filter to only PushEvent
    const pushEvents = events.filter((e) => e.type === "PushEvent");

    // Flatten commits from all push events
    const commits: RedactedCommit[] = [];

    for (const event of pushEvents) {
      if (!event.payload.commits || event.payload.commits.length === 0) {
        continue;
      }

      for (const commit of event.payload.commits) {
        // Determine visibility tier
        let visibility: "public" | "own-private" | "org-private";
        let repo: string;
        let repoShort: string;
        let message: string;
        let sha: string;
        let repoUrl: string | null;
        let commitUrl: string | null;

        if (event.public) {
          // Public commit - show everything
          visibility = "public";
          repo = event.repo.name;
          repoShort = event.repo.name.split("/")[1] || event.repo.name;
          message = commit.message;
          sha = commit.sha;
          repoUrl = `https://github.com/${event.repo.name}`;
          commitUrl = `https://github.com/${event.repo.name}/commit/${commit.sha}`;
        } else if (event.repo.name.startsWith(`${GITHUB_USERNAME}/`)) {
          // Own private repo - show message, redact repo
          visibility = "own-private";
          repo = "[REDACTED]";
          repoShort = "[REDACTED]";
          message = commit.message;
          sha = commit.sha;
          repoUrl = null;
          commitUrl = null;
        } else {
          // Org/other private repo - redact everything
          visibility = "org-private";
          repo = "[REDACTED]";
          repoShort = "[REDACTED]";
          message = "[CLASSIFIED]";
          sha = commit.sha.substring(0, 7);
          repoUrl = null;
          commitUrl = null;
        }

        commits.push({
          id: `${commit.sha}-${commits.length}`,
          repo,
          repoShort,
          message,
          sha,
          timestamp: event.created_at,
          visibility,
          repoUrl,
          commitUrl,
        });

        // Stop after we have 3 commits
        if (commits.length >= 3) {
          break;
        }
      }

      if (commits.length >= 3) {
        break;
      }
    }

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
