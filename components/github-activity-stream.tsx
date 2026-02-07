import { fetchGitHubCommits } from "@/lib/github";
import { GitHubActivity } from "@/components/github-activity";
import { SOCIAL_LINKS } from "@/lib/social-links";

export async function GitHubActivityStream() {
  const commits = await fetchGitHubCommits();
  return (
    <GitHubActivity commits={commits} username={SOCIAL_LINKS.github.username} />
  );
}
