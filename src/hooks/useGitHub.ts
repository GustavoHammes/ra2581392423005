import { useQuery } from "@tanstack/react-query";
import type { GitHubAccount, GitHubRepo } from "../data/github";

export function useGitHub(account: GitHubAccount, enabled = true) {
  return useQuery<GitHubRepo[]>({
    queryKey: ["github-repositories", account],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/github?account=${account}`, { signal });
      if (!response.ok) throw new Error("Não foi possível atualizar os projetos.");
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error("Resposta inválida.");
      return data as GitHubRepo[];
    },
    staleTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    retry: 1,
    enabled,
  });
}
