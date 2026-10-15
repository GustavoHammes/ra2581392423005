import { ArrowDown, ArrowDownRight, ArrowUpRight, Github, MapPin } from "lucide-react";

export function Hero() {
  return (
    <>
      <section id="inicio" className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> GUSTAVO HAMMES · DESENVOLVEDOR FULL STACK
          </p>
          <h1 id="hero-title">
            Ideias no papel.
            <br />
            Soluções <span>na tela.</span>
          </h1>
          <p className="hero-description">
            Desenvolvo aplicações web e mobile conectando interfaces, APIs e dados. Meu foco é
            transformar problemas do dia a dia em experiências simples de usar.
          </p>
          <div className="hero-actions">
            <a href="#projetos" className="button button-primary">
              Conheça meu trabalho <ArrowDownRight size={18} />
            </a>
            <a
              href="/Gustavo-Henrique-Ferreira-Hammes_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Ver currículo <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="hero-meta">
            <span>
              <MapPin size={14} /> Jacareí, São Paulo
            </span>
            <span className="meta-divider" />
            <a href="https://github.com/GustavoHammes" target="_blank" rel="noopener noreferrer">
              <Github size={15} /> @GustavoHammes <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        <div className="portrait-composition">
          <div className="portrait-frame">
            <img
              src="/portrait.webp"
              alt="Gustavo Hammes"
              fetchPriority="high"
              width="960"
              height="1280"
            />
            <div className="portrait-caption">
              <span>
                Curiosidade para aprender.
                <br />
                <strong>Cuidado para construir.</strong>
              </span>
              <span className="portrait-symbol" aria-hidden="true">
                ↗
              </span>
            </div>
          </div>
          <span className="portrait-index mono" aria-hidden="true">
            01 / EM CONSTANTE CONSTRUÇÃO
          </span>
          <div className="portrait-note mono">
            <span className="status-dot" /> CODE. LEARN. BUILD.
          </div>
        </div>
        <a className="scroll-cue mono" href="#projetos">
          <ArrowDown size={14} /> EXPLORE O PORTFÓLIO
        </a>
      </section>
      <div className="stack-strip">
        <div className="container stack-content">
          <span className="mono stack-label">NO MEU DIA A DIA</span>
          <span>React</span>
          <span>TypeScript</span>
          <span>Node.js</span>
          <span>Python</span>
          <span>PostgreSQL</span>
          <span className="stack-last">React Native</span>
        </div>
      </div>
    </>
  );
}
