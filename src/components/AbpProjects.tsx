import { useState } from "react";
import { ArrowUpRight, Code2 } from "lucide-react";
import { useAbpProjects, type AbpConfig } from "../hooks/useAbpProjects";
import { ACADEMIC_DESCRIPTIONS } from "../data/github";

interface AbpProjectsProps {
  abpConfig: AbpConfig[];
}

function AcademicImage({ image }: { image: string }) {
  const [failed, setFailed] = useState(false);
  return image && !failed ? (
    <img
      src={image}
      alt=""
      loading="lazy"
      width="240"
      height="180"
      onError={() => setFailed(true)}
    />
  ) : (
    <Code2 size={27} />
  );
}

export function AbpProjects({ abpConfig }: AbpProjectsProps) {
  const { data: projects, dataUpdatedAt } = useAbpProjects(abpConfig);
  return (
    <section
      id="abp"
      className="section academic-section container"
      aria-labelledby="academic-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="section-number">02 /</span> COLABORAÇÃO & PRÁTICA
          </p>
          <h2 id="academic-title">
            Construir junto.
            <br />
            Aprender na prática.
          </h2>
        </div>
        <div className="academic-intro">
          <p>
            Projetos desenvolvidos em equipe na Fatec,
            <br />
            com a Octacode.
          </p>
          <a
            href="https://github.com/octacodeteam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Conheça a equipe <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <div className="academic-grid">
        {projects.map((project) => {
          const info = ACADEMIC_DESCRIPTIONS[project.name];
          return (
            <a
              className="academic-project"
              key={project.id}
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="academic-image">
                <AcademicImage image={project.image} />
              </div>
              <div className="academic-content">
                <span className="mono">{project.name} · EM EQUIPE</span>
                <h3>{info?.title || project.name}</h3>
                <p>
                  {info?.description ||
                    project.description?.trim() ||
                    "Veja o desenvolvimento e a documentação do projeto."}
                </p>
              </div>
              <ArrowUpRight className="academic-arrow" size={19} />
            </a>
          );
        })}
      </div>
      {!dataUpdatedAt && (
        <p className="snapshot-note">
          Exibindo a seleção salva dos projetos acadêmicos.{" "}
          <a href="https://github.com/octacodeteam" target="_blank" rel="noopener noreferrer">
            Ver no GitHub ↗
          </a>
        </p>
      )}
    </section>
  );
}
