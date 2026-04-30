import { useQuery } from '@tanstack/react-query';

// ⚠️ octacodeteam é um usuário GitHub, não uma organização.
// Use /users/ ao invés de /orgs/
const GITHUB_USER = 'octacodeteam';

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

async function fetchRepos(): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
    { headers: { Accept: 'application/vnd.github+json' } }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

/** Retorna todos os repos do usuário (para o painel admin) */
export function useOctacodeRepos() {
  return useQuery<GithubRepo[]>({
    queryKey: ['octacode-repos'],
    queryFn: fetchRepos,
    staleTime: 1000 * 60 * 10, // cache de 10 minutos
    retry: false,               // não tenta de novo se der erro
  });
}

/** Retorna apenas os projetos visíveis mesclados com a config */
export function useAbpProjects(abpConfig: AbpConfig[]) {
  return useQuery<AbpProject[]>({
    queryKey: ['abp-projects'],
    queryFn: async () => {
      const repos = await fetchRepos();
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
    retry: false,
    enabled: abpConfig.length > 0, // só busca se tiver algo configurado
  });
}