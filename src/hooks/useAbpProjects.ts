import { useQuery } from '@tanstack/react-query';

const ORG = 'octacodeteam';

export interface AbpConfig {
  name: string;     // nome exato do repositório no GitHub
  image: string;    // caminho da imagem, ex: /projects/abp1.png
  visible: boolean; // controla se aparece no portfólio
}

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  topics: string[];
}

export interface AbpProject extends GithubRepo {
  image: string;
  visible: boolean;
}

async function fetchOctacodeRepos(): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/orgs/${ORG}/repos?per_page=100&sort=updated`,
    { headers: { Accept: 'application/vnd.github+json' } }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

/** Retorna todos os repos da org (para o painel admin) */
export function useOctacodeRepos() {
  return useQuery<GithubRepo[]>({
    queryKey: ['octacode-repos'],
    queryFn: fetchOctacodeRepos,
    staleTime: 1000 * 60 * 10,
  });
}

/** Retorna apenas os projetos visíveis mesclados com a config */
export function useAbpProjects(abpConfig: AbpConfig[]) {
  return useQuery<AbpProject[]>({
    queryKey: ['abp-projects', abpConfig],
    queryFn: async () => {
      const repos = await fetchOctacodeRepos();

      const visibleConfig = abpConfig.filter(c => c.visible);

      return visibleConfig
        .map(config => {
          const repo = repos.find(r => r.name === config.name);
          if (!repo) return null;
          return { ...repo, image: config.image, visible: config.visible };
        })
        .filter(Boolean) as AbpProject[];
    },
    staleTime: 1000 * 60 * 10,
    enabled: abpConfig.length > 0,
  });
}
