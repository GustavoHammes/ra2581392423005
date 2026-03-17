import { useState } from 'react';
import { Project, ProjectCategory } from '../data/projects';

interface ProjectsProps {
  projects: Project[];
  isAdmin: boolean;
  onRemove?: (id: string) => void;
}

const CATEGORIES: (ProjectCategory | 'Todos')[] = ['Todos', 'Faculdade', 'Pessoal', 'Trabalho', 'Outro'];

function ProjectCard({ project, isAdmin, onRemove }: { project: Project; isAdmin: boolean; onRemove?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-900/20"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Admin remove button */}
      {isAdmin && onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 z-20 w-7 h-7 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold transition"
          title="Remover projeto"
        >×</button>
      )}

      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs px-2 py-1 rounded-full">
          ⭐ Destaque
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image || `https://picsum.photos/seed/${project.id}/600/340`}
          alt={project.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-110' : 'scale-100'}`}
          onError={e => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${project.id}/600/340`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2e] via-transparent to-transparent" />

        {/* Hover overlay with links */}
        <div className={`absolute inset-0 bg-indigo-900/60 backdrop-blur-sm flex items-center justify-center gap-3 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-indigo-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition"
              onClick={e => e.stopPropagation()}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              Ver projeto
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/20 transition"
              onClick={e => e.stopPropagation()}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
          )}
          {!project.liveUrl && !project.githubUrl && (
            <span className="text-white/60 text-sm">Em breve</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-indigo-300 transition-colors">{project.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-4">{project.description}</p>

        {/* Category */}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full border ${
            project.category === 'Faculdade' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' :
            project.category === 'Pessoal' ? 'bg-green-500/10 border-green-500/20 text-green-300' :
            project.category === 'Trabalho' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
            'bg-white/5 border-white/10 text-white/40'
          }`}>
            {project.category}
          </span>
          {(project.liveUrl || project.githubUrl) && (
            <a href={project.liveUrl || project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition">
              Ver projeto
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function Projects({ projects, isAdmin, onRemove }: ProjectsProps) {
  const [filter, setFilter] = useState<ProjectCategory | 'Todos'>('Todos');

  const filtered = filter === 'Todos' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projetos" className="py-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-3">Portfólio</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Meus <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Projetos</span></h2>
        <p className="text-white/40 max-w-md mx-auto">Uma seleção dos projetos que desenvolvi durante minha jornada acadêmica e pessoal.</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
            {cat !== 'Todos' && (
              <span className="ml-1.5 text-xs opacity-60">
                {projects.filter(p => p.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-5xl mb-4">📂</p>
          <p>Nenhum projeto nessa categoria ainda.</p>
          {isAdmin && <p className="text-sm mt-2 text-indigo-400">Use o painel admin (Ctrl+Shift+A) para adicionar.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              isAdmin={isAdmin}
              onRemove={onRemove ? () => onRemove(project.id) : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
