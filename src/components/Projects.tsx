import { useState } from "react";
import { ArrowUpRight, ChevronDown, Code2, Github } from "lucide-react";
import type { Project } from "../data/projects";
import { externalUrl, repositoryKey } from "../lib/github";

interface ProjectsProps {
  projects: Project[];
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  const source = externalUrl(project.githubUrl);
  const candidate = externalUrl(project.liveUrl);
  const live = candidate && !repositoryKey(candidate) ? candidate : undefined;
  return (
    <article className={`project-card ${index === 0 ? "project-lead" : ""}`}>
      <div className={`project-preview preview-${index % 3}`}>
        <div className="preview-topline">
          <span className="mono">
            {String(index + 1).padStart(2, "0")} /{" "}
            {project.category === "Faculdade" ? "PROJETO ACADÊMICO" : "PROJETO PESSOAL"}
          </span>
          <ArrowUpRight size={19} aria-hidden="true" />
        </div>
        {project.image && !imageFailed ? (
          <img
            src={project.image}
            alt={`Interface do projeto ${project.title}`}
            loading="lazy"
            width="1200"
            height="720"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="project-image-fallback">
            <Code2 size={48} />
            <span>{project.title}</span>
          </div>
        )}
      </div>
      <div className="project-content">
        <div className="project-heading">
          <span className="mono project-type">
            {project.title === "NLW Agents"
              ? "ESTUDO · ROCKETSEAT"
              : project.tags.includes("React Native")
                ? "WEB & MOBILE"
                : "APLICAÇÃO WEB"}
          </span>
        </div>
        <h3>{project.title}</h3>
        <p className="project-description">{project.summary || project.description}</p>
        <div className="tags">
          {project.tags.slice(0, 5).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
          {project.tags.length > 5 && (
            <span title={project.tags.slice(5).join(", ")}>+{project.tags.length - 5}</span>
          )}
        </div>
        {(project.challenge || project.approach) && (
          <details className="project-details">
            <summary>
              Por dentro do projeto <ChevronDown size={15} />
            </summary>
            <div>
              {project.challenge && (
                <p>
                  <strong>O problema</strong>
                  {project.challenge}
                </p>
              )}
              {project.approach && (
                <p>
                  <strong>A solução</strong>
                  {project.approach}
                </p>
              )}
            </div>
          </details>
        )}
        <div className="project-links">
          {source && (
            <a href={source} target="_blank" rel="noopener noreferrer">
              <Github size={16} /> Código-fonte <ArrowUpRight size={14} />
            </a>
          )}
          {live && (
            <a href={live} target="_blank" rel="noopener noreferrer">
              Abrir aplicação <ArrowUpRight size={16} />
            </a>
          )}
          {!source && !live && <span className="muted">Documentação em preparação</span>}
        </div>
      </div>
    </article>
  );
}

export function Projects({ projects }: ProjectsProps) {
  const featured = [...projects.filter((p) => p.featured)].sort(
    (a, b) => Number(b.title === "App Scholar") - Number(a.title === "App Scholar"),
  );
  const selected = featured.length ? featured : projects.slice(0, 3);
  return (
    <section id="projetos" className="section container" aria-labelledby="projects-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="section-number">01 /</span> TRABALHOS SELECIONADOS
          </p>
          <h2 id="projects-title">
            Do problema
            <br />
            ao projeto.
          </h2>
        </div>
        <p>
          Uma seleção do que venho construindo.
          <br />
          Cada projeto, um desafio diferente.
        </p>
      </div>
      <div className="projects-grid">
        {selected.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
