import { SELECTED_REPOSITORIES, type GitHubRepo } from "../data/github";

export function externalUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

export function repositoryKey(value?: string | null): string | undefined {
  const safe = externalUrl(value);
  if (!safe) return undefined;
  const url = new URL(safe);
  const parts = url.pathname.split("/").filter(Boolean);
  if (url.hostname.toLowerCase() !== "github.com" || parts.length < 2) return undefined;
  return `${parts[0]}/${parts[1].replace(/\.git$/, "")}`.toLowerCase();
}

export function selectPortfolioRepos(repos: GitHubRepo[], excluded: string[] = []): GitHubRepo[] {
  const selection = new Set(SELECTED_REPOSITORIES.map((name) => name.toLowerCase()));
  const excludedKeys = new Set(excluded.map((key) => key.toLowerCase()));
  return repos
    .filter((repo) => !repo.private && !repo.fork && !repo.archived && !repo.disabled)
    .filter((repo) => !excludedKeys.has(repo.full_name.toLowerCase()))
    .filter((repo) => repo.topics.includes("portfolio") || selection.has(repo.name.toLowerCase()))
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at));
}
