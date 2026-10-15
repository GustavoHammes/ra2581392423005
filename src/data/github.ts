export const GITHUB_ACCOUNTS = { personal: "GustavoHammes", team: "octacodeteam" } as const;
export type GitHubAccount = keyof typeof GITHUB_ACCOUNTS;

// Keep existing complete projects while new projects opt in with the portfolio topic.
export const SELECTED_REPOSITORIES = [
  "entregalab",
  "Desafio_tecnico",
  "Projetos_caseiros",
  "App_Scholar",
  "Financias",
  "NLW-agents-Rocketseat",
];

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  pushed_at: string;
  updated_at: string;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  private: boolean;
}

export const ACADEMIC_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  ABP4: {
    title: "Medicamentos & IoT",
    description:
      "Projeto de sistema integrado com aplicativo e dispositivo IoT para organizar a administração de medicamentos.",
  },
  ABP3: {
    title: "Dados ambientais",
    description: "Projeto em equipe para consulta e visualização de dados ambientais.",
  },
  ABP2: {
    title: "Monitoramento de queimadas",
    description:
      "Consulta de áreas queimadas, risco de fogo e focos de calor com dados do BDQueimadas.",
  },
  ABP1: {
    title: "Aprendendo Scrum",
    description: "Plataforma educativa sobre Scrum, com conteúdo, avaliações e certificados.",
  },
};
