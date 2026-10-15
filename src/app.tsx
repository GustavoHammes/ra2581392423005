import { ArrowUpRight, Github } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { GitHubProjects } from "./components/GitHubProjects";
import { AbpProjects } from "./components/AbpProjects";
import { About } from "./components/About";
import { Certificates } from "./components/Certificates";
import { Contact } from "./components/Contact";
import { DEFAULT_PROJECTS, DEFAULT_CERTIFICATES, DEFAULT_ABP_CONFIG } from "./data/projects";

export default function App() {
  return (
    <>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Projects projects={DEFAULT_PROJECTS} />
        <GitHubProjects projects={DEFAULT_PROJECTS} />
        <AbpProjects abpConfig={DEFAULT_ABP_CONFIG} />
        <About />
        <Certificates certificates={DEFAULT_CERTIFICATES} />
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="container footer-content">
          <a className="wordmark" href="#inicio" aria-label="Voltar ao início">
            gh<span>.</span>
          </a>
          <p>
            © {new Date().getFullYear()} Gustavo Hammes<span className="footer-dot">·</span>Feito
            com intenção, do começo ao código.
          </p>
          <div className="footer-links">
            <a
              href="https://github.com/GustavoHammes/ra2581392423005"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={14} /> Código deste site <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
