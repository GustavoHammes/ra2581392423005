import nlwAgentsImg from '../assets/images/nlw-agents.png';
import dashboardSolarImg from '../assets/images/abp2.png';
import jornadaScrumImg from '../assets/images/abp1.png';
import financasImg from '../assets/images/investimento.png';
import laserCatImg from '../assets/images/cat_laser.png';

export const projectsData = [
  {
    title: "NLW Agents",
    description: "Aplicação com IA, transcrição de áudio e interface moderna construída com React e TailwindCSS.",
    image: nlwAgentsImg,
    link: "https://github.com/GustavoHammes/NLW-agents-Rocketseat",
    tags: ["React", "IA", "TailwindCSS"]
  },
  {
    title: "ABP - Dashboard Solar",
    description: "Visualização interativa de dados ambientais com React, TypeScript, e Leaflet para análise geoespacial.",
    image: dashboardSolarImg,
    link: "https://github.com/octacodeteam/ABP2",
    tags: ["React", "TypeScript", "Leaflet"]
  },
  {
    title: "ABP - Jornada Scrum",
    description: "Projeto para apresentar os conceitos, fundamentos e papéis do framework ágil Scrum.",
    image: jornadaScrumImg,
    link: "https://github.com/octacodeteam/ABP1",
    tags: ["HTML", "JavaScript", "SQL"]
  },
  {
    title: "Financias",
    description: "Simulador de empréstimos e investimentos com cálculo de juros, relatórios e backend integrado.",
    image: financasImg,
    link: "https://github.com/GustavoHammes/Financias",
    tags: ["TypeScript", "Backend", "Finanças"]
  },
  {
    title: "Laser para gatos - E-SPANTALHO",
    description: "Projeto divertido com Python, OpenCV e Arduino para rastrear gatos e controlar um laser automaticamente.",
    image: laserCatImg,
    link: "https://github.com/SamuelLucasVieira/laser-cat-tracker",
    tags: ["Python", "OpenCV", "Arduino"]
  }
];

export const certificatesData = [
    { url: "https://app.rocketseat.com.br/certificates/44817ebf-e9fd-4275-b6be-e2f3fba58421", title: "NLW Agents - Rocketseat", issuer: "Rocketseat" },
    { url: "https://app.rocketseat.com.br/certificates/246212d7-5030-4de8-a835-30786b455b0f", title: "Discover - Rocketseat", issuer: "Rocketseat"},
    { url: "/Certificado_lowcode.jpg", title: "Bootcamp Creator IT - Low Code", issuer: "Creator IT" },
    { url: "https://cursos.alura.com.br/immersion/certificate/b69b431d-6e9c-40aa-8c9e-72e739b92631?lang", title: "Front-end com Gemini - Alura", issuer: "Alura" },
    { url: "https://cursos.alura.com.br/immersion/certificate/c2561f7e-153a-4f8c-abe3-d52c00022876?lang", title: "Imersão Cloud Devops - Alura", issuer: "Alura" },
    { url: "/Certificado_cisco.pdf", title: "NDG Linux Unhatched - Cisco", issuer: "Cisco" }
];
