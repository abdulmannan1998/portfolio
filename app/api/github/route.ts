import { NextResponse } from "next/server";
import { fetchGitHubCommits } from "@/lib/github";

export async function GET() {
  const commits = await fetchGitHubCommits();

  return NextResponse.json(
    { commits },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
