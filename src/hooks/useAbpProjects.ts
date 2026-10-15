import { useGitHub } from "./useGitHub";
import snapshot from "../data/github-snapshot.json";
import type { GitHubRepo } from "../data/github";

export interface AbpConfig {
  name: string;
  image: string;
  visible: boolean;
}
export type GithubRepo = GitHubRepo;
export interface AbpProject extends GitHubRepo {
  image: string;
  visible: boolean;
}

export function useOctacodeRepos(enabled = true) {
  return useGitHub("team", enabled);
}

export function useAbpProjects(abpConfig: AbpConfig[]) {
  const query = useGitHub("team", abpConfig.length > 0);
  const repos = query.data ?? (snapshot.team as GitHubRepo[]);
  const data = abpConfig
    .filter((config) => config.visible)
    .map((config) => {
      const repo = repos.find((item) => item.name === config.name);
      return repo ? { ...repo, image: config.image, visible: true } : null;
    })
    .filter((project): project is AbpProject => project !== null);
  return { ...query, data };
}
