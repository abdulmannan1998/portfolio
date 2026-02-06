import { fetchGitHubCommits } from "@/lib/github";
import { PageContent } from "@/components/page-content";

// ISR revalidation is configured in lib/github.ts via fetch options (revalidate: 300)
export default async function Page() {
  const commits = await fetchGitHubCommits();
  return <PageContent commits={commits} />;
}
