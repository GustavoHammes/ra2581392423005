export type ProjectCategory = 'Faculdade' | 'Pessoal' | 'Trabalho' | 'Outro';

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
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year?: string;
  url?: string;
}

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'NLW Agents',
    description: 'Aplicação com IA, transcrição de áudio e interface moderna construída com React e TailwindCSS.',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=340&fit=crop',
    tags: ['React', 'IA', 'TailwindCSS'],
    category: 'Pessoal',
    featured: true,
  },
  {
    id: '2',
    title: 'ABP – Dashboard Solar',
    description: 'Visualização interativa de dados ambientais com React, TypeScript, e Leaflet para análise geoespacial.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=340&fit=crop',
    tags: ['React', 'TypeScript', 'Leaflet'],
    category: 'Faculdade',
    featured: true,
  },
  {
    id: '3',
    title: 'Simulador Financeiro',
    description: 'Ferramenta para simulação de investimentos e empréstimos com cálculos em tempo real.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=340&fit=crop',
    tags: ['React', 'TypeScript'],
    category: 'Faculdade',
  },
];

export const DEFAULT_CERTIFICATES: Certificate[] = [
  { id: '1', title: 'NLW Agents', issuer: 'Rocketseat', year: '2025' },
  { id: '2', title: 'Discover', issuer: 'Rocketseat', year: '2024' },
  { id: '3', title: 'Bootcamp Creator IT – Low Code', issuer: 'Creator IT', year: '2024' },
  { id: '4', title: 'Front-end com Gemini', issuer: 'Alura', year: '2024' },
  { id: '5', title: 'Imersão Cloud Devops', issuer: 'Alura', year: '2024' },
  { id: '6', title: 'NDG Linux Unhatched', issuer: 'Cisco', year: '2023' },
];
