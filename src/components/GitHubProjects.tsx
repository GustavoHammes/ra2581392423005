import { useState } from "react";
import { ArrowDown, ArrowUpRight, Github, RefreshCw } from "lucide-react";
import type { Project } from "../data/projects";
import { useGitHub } from "../hooks/useGitHub";
import { externalUrl, repositoryKey, selectPortfolioRepos } from "../lib/github";
import snapshot from "../data/github-snapshot.json";
import type { GitHubRepo } from "../data/github";

export function GitHubProjects({ projects }: { projects: Project[] }) {
  const { data, isError, isFetching, refetch } = useGitHub("personal");
  const [expanded, setExpanded] = useState(false);
  const excluded = projects
    .filter((project) => project.featured)
    .map((project) => repositoryKey(project.githubUrl))
    .filter((key): key is string => Boolean(key));
  const repos = selectPortfolioRepos(data ?? (snapshot.personal as GitHubRepo[]), excluded);
  const visible = expanded ? repos : repos.slice(0, 4);
  return (
    <section className="github-section container" aria-labelledby="github-title">
      <div className="github-heading">
        <div>
          <p className="eyebrow">
            <Github size={15} /> DO MEU GITHUB
          </p>
          <h3 id="github-title">Outras ideias em código.</h3>
        </div>
        <div className="sync-status" role="status">
          <span className={`status-dot ${!data ? "status-saved" : ""}`} />
          {data ? "Sincronizado com o GitHub" : "Seleção salva do GitHub"}
          {isError && (
            <button
              className="icon-button"
              onClick={() => void refetch()}
              disabled={isFetching}
              aria-label="Tentar atualizar projetos"
            >
              <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            </button>
          )}
        </div>
      </div>
      {repos.length ? (
        <div className="repository-grid">
          {visible.map((repo) => {
            const homepage = externalUrl(repo.homepage);
            return (
              <article className="repository-card" key={repo.id}>
                <div className="repo-title">
                  <Github size={18} />
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name.replace(/[_-]/g, " ")}
                    <ArrowUpRight size={17} />
                  </a>
                </div>
                <p>
                  {repo.description?.trim() ||
                    "Explore o código e a documentação deste projeto no GitHub."}
                </p>
                <div className="repo-meta">
                  <span>
                    <span className="language-dot" />
                    {repo.language || "Projeto open source"}
                  </span>
                  {homepage && !repositoryKey(homepage) && (
                    <a href={homepage} target="_blank" rel="noopener noreferrer">
                      Demo <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="muted">
          Novos projetos serão publicados por aqui. Explore também meu perfil no GitHub.
        </p>
      )}
      <div className="github-bottom">
        <a
          className="text-link"
          href="https://github.com/GustavoHammes?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explorar meu GitHub <ArrowUpRight size={16} />
        </a>
        {repos.length > 4 && (
          <button className="text-link" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Mostrar menos" : "Ver mais projetos"}
            <ArrowDown size={15} style={expanded ? { transform: "rotate(180deg)" } : undefined} />
          </button>
        )}
      </div>
    </section>
  );
}
