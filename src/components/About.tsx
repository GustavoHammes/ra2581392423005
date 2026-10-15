import { ArrowUpRight, Braces, Database, Layers3 } from "lucide-react";

const capabilities = [
  {
    icon: Layers3,
    title: "Interfaces & experiência",
    text: "Aplicações responsivas para web e mobile, com React, TypeScript e React Native.",
  },
  {
    icon: Braces,
    title: "APIs & integrações",
    text: "Conexão entre interfaces e serviços com Node.js, Express, Python e APIs REST.",
  },
  {
    icon: Database,
    title: "Dados & persistência",
    text: "Modelagem e acesso a dados com SQL, PostgreSQL e Prisma.",
  },
];

export function About() {
  return (
    <section id="sobre" className="section about-section" aria-labelledby="about-title">
      <div className="container">
        <div className="about-intro">
          <div>
            <p className="eyebrow">
              <span className="section-number">03 /</span> UM POUCO SOBRE MIM
            </p>
            <h2 id="about-title">
              Prazer, Gustavo<span className="accent">.</span>
            </h2>
          </div>
          <div className="about-copy">
            <p>
              Gosto de entender como as coisas funcionam — e de construir algo útil a partir disso.
              É o que me move no desenvolvimento de software.
            </p>
            <p>
              Estudo Desenvolvimento de Software Multiplataformas na Fatec de Jacareí. Entre
              projetos pessoais e trabalhos em equipe, conecto o que aprendo à prática: da interface
              ao banco de dados.
            </p>
            <a
              className="text-link"
              href="/Gustavo-Henrique-Ferreira-Hammes_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Conheça minha trajetória <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <div className="capabilities">
          {capabilities.map(({ icon: Icon, title, text }, index) => (
            <article key={title}>
              <div className="capability-top">
                <Icon size={23} strokeWidth={1.5} />
                <span className="mono">0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
