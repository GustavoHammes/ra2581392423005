import { useState } from "react";
import { ArrowUpRight, Code2, Settings, Trash2 } from "lucide-react";
import { useAbpProjects, useOctacodeRepos, type AbpConfig } from "../hooks/useAbpProjects";
import { ACADEMIC_DESCRIPTIONS } from "../data/github";
import { FileUpload } from "./FileUpload";

interface AbpProjectsProps {
  abpConfig: AbpConfig[];
  isAdmin?: boolean;
  onAddAbpProject: (name: string) => void;
  onRemoveAbpProject: (name: string) => void;
  onUpdateAbpProject: (name: string, updates: Partial<AbpConfig>) => void;
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

export function AbpProjects({
  abpConfig,
  isAdmin,
  onAddAbpProject,
  onRemoveAbpProject,
  onUpdateAbpProject,
}: AbpProjectsProps) {
  const [manager, setManager] = useState(false);
  const [selected, setSelected] = useState("");
  const { data: projects, dataUpdatedAt } = useAbpProjects(abpConfig);
  const { data: repos } = useOctacodeRepos(Boolean(isAdmin && manager));
  const available =
    repos?.filter((repo) => !abpConfig.some((config) => config.name === repo.name)) ?? [];
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
      {isAdmin && (
        <div className="abp-manager">
          <button
            className="button button-secondary"
            onClick={() => setManager(!manager)}
            aria-expanded={manager}
          >
            <Settings size={16} /> Gerenciar projetos acadêmicos
          </button>
          {manager && (
            <div className="admin-abp-list">
              {abpConfig.map((config) => (
                <div key={config.name} className="admin-abp-item">
                  <div className="admin-abp-title">
                    <strong>{config.name}</strong>
                    <label>
                      <input
                        type="checkbox"
                        checked={config.visible}
                        onChange={() =>
                          onUpdateAbpProject(config.name, { visible: !config.visible })
                        }
                      />{" "}
                      Visível
                    </label>
                    <button
                      className="icon-button danger"
                      aria-label={`Remover ${config.name}`}
                      onClick={() => onRemoveAbpProject(config.name)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <FileUpload
                    accept="image"
                    folder="projects"
                    value={config.image}
                    onChange={(image) => onUpdateAbpProject(config.name, { image })}
                    adminPassword={sessionStorage.getItem("adminPassword") ?? ""}
                  />
                </div>
              ))}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (selected) {
                    onAddAbpProject(selected);
                    setSelected("");
                  }
                }}
              >
                <label htmlFor="add-academic">Adicionar repositório da equipe</label>
                <select
                  id="add-academic"
                  className="admin-input"
                  value={selected}
                  required
                  onChange={(event) => setSelected(event.target.value)}
                >
                  <option value="">Selecione um projeto</option>
                  {available.map((repo) => (
                    <option key={repo.id} value={repo.name}>
                      {repo.name}
                    </option>
                  ))}
                </select>
                <button className="button button-primary" disabled={!selected}>
                  Adicionar
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
