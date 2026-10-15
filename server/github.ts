import { GITHUB_ACCOUNTS, type GitHubAccount, type GitHubRepo } from "../src/data/github.js";

export async function loadGitHubRepos(
  account: GitHubAccount,
  token?: string,
): Promise<GitHubRepo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "GustavoHammes-Portfolio",
    "X-GitHub-Api-Version": "2026-03-10",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const repos: GitHubRepo[] = [];
  let page = 1;
  let hasNext = true;
  const signal = AbortSignal.timeout(8_000);
  while (hasNext) {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_ACCOUNTS[account]}/repos?per_page=100&sort=full_name&page=${page}`,
      { headers, signal },
    );
    if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid GitHub response");
    for (const item of data) {
      // Only return explicitly public repositories, even if the server has a token.
      if (item.private !== false || item.disabled || item.archived) continue;
      repos.push({
        id: item.id,
        name: item.name,
        full_name: item.full_name,
        description: item.description,
        html_url: item.html_url,
        homepage: item.homepage,
        language: item.language,
        topics: item.topics ?? [],
        stargazers_count: item.stargazers_count,
        pushed_at: item.pushed_at,
        updated_at: item.updated_at,
        fork: item.fork,
        archived: item.archived,
        disabled: item.disabled,
        private: false,
      });
    }
    hasNext = /rel="next"/.test(response.headers.get("link") ?? "");
    page += 1;
  }
  return repos;
}
