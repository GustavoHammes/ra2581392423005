import portfolioData from "./portfolio-defaults.json";

export type ProjectCategory = "Faculdade" | "Pessoal" | "Trabalho" | "Outro";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: ProjectCategory;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  summary?: string;
  challenge?: string;
  approach?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year?: string;
  /** External link (Credly, Rocketseat, etc.) */
  url?: string;
  /** Local path to PDF stored in public/certificates/ e.g. /certificates/nlw-agents.pdf */
  pdfPath?: string;
}

export const DEFAULT_PROJECTS: Project[] = portfolioData.projects as Project[];
export const DEFAULT_CERTIFICATES: Certificate[] = portfolioData.certificates;
